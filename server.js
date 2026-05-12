import express from "express";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import connectDB from "./db/connectDB.js";
import Rides from "./models/Rides.js";
import User from "./models/User.js";

dotenv.config({ path: ".env.local" });

const app = express();
const port = Number(process.env.PORT) || 4000;

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: { origin: "*" }
});

const captainSocketMap = new Map();

const startServer = async () => {
    try {
        await connectDB();
        await User.updateMany(
            {
                role: "captain",
                $or: [
                    { "captain.location": { $exists: false } },
                    { "captain.location.coordinates": { $exists: false } },
                    { "captain.location.coordinates.0": { $exists: false } },
                    { "captain.location.coordinates.1": { $exists: false } }
                ]
            },
            {
                $set: {
                    "captain.location": { type: "Point", coordinates: [0, 0] }
                }
            }
        );
        httpServer.on("error", (err) => {
            if (err.code === "EADDRINUSE") {
                console.error(`Port ${port} is already in use.`);
                process.exit(1);
            }
            throw err;
        });
        httpServer.listen(port, () => console.log(`Server running on port ${port}`));
    } catch (error) {
        console.log(error);
    }
};

startServer();

const chat = io.of("/chat");
const rideStatus = io.of("/rideStatus");

chat.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("roomId", (roomId) => {
        socket.join(roomId);
        const clientCount = chat.adapter.rooms.get(roomId)?.size ?? 0;
        console.log(`${socket.id} joined room ${roomId} — ${clientCount} users`);
    });

    socket.on("chat", (msg) => {
        chat.to(msg.roomId).emit("chat", msg);
    });

    socket.on("disconnect", () => console.log("Disconnected:", socket.id));
});

rideStatus.on("connection", (socket) => {

    socket.on("captainLocation", async (location) => {
        const { longitude, latitude, captainId } = location;
        console.log(location);
        if (!captainId) return;

        const lng = Number(longitude);
        const lat = Number(latitude);
        if (!Number.isFinite(lng) || !Number.isFinite(lat)) return;

        await User.findOneAndUpdate(
            { _id: captainId, role: "captain" },
            { $set: { "captain.location": { type: "Point", coordinates: [lng, lat] } } },
            { new: false }
        );
    });

    socket.on("registerCaptain", (captainId) => {
        captainSocketMap.set(captainId, socket.id);
        console.log(`Captain ${captainId} registered with socket ${socket.id}`);
    });

    socket.on("roomId", (roomId) => {
        socket.join(roomId);
        const clientCount = rideStatus.adapter.rooms.get(roomId)?.size ?? 0;
        console.log(`${socket.id} joined room ${roomId} — ${clientCount} users`);
    });

    socket.on("findRide", async (rideLocation) => {
        const { latitude, longitude, pickup, drop, amount, rideId, distance, duration } = rideLocation;

        console.log("Finding captains near:", latitude, longitude);

        try {
            const nearbyCaptains = await User.find({
                role: "captain",
                "captain.status": "active",
                "captain.location": {
                    $near: {
                        $geometry: {
                            type: "Point",
                            coordinates: [longitude, latitude]
                        },
                        $maxDistance: 5000
                    }
                }
            }).select("_id email name captain.vehicle");

            console.log(`Found ${nearbyCaptains.length} nearby captains`);

            if (nearbyCaptains.length === 0) {
                rideStatus.to(rideId).emit("noCaptains", "No captains available nearby.");
                return;
            }

            nearbyCaptains.forEach((captain) => {
                const captainSocketId = captainSocketMap.get(captain._id.toString());
                if (captainSocketId) {
                    rideStatus.to(captainSocketId).emit("newRide", {
                        rideId,
                        pickup,
                        drop,
                        amount,
                        distance,
                        duration,
                        passengerLocation: { latitude, longitude }
                    });
                }
            });

        } catch (err) {
            console.error("findRide error:", err);
        }
    });

    socket.on("redirect", async (acceptInfo) => {
        const { captainEmail, rideId } = acceptInfo;

        try {
            const captain = await User.findOne({ email: captainEmail });
            if (!captain) return;

            const updatedRide = await Rides.findOneAndUpdate(
                { _id: rideId, status: "searching" },
                { $set: { status: "accepted", captainId: captain._id } },
                { new: true }
            );

            if (!updatedRide) {
                socket.emit("rideRejected", "Ride already accepted by another captain.");
                return;
            }

            rideStatus.to(rideId).emit("redirect", rideId);

        } catch (err) {
            console.error("redirect error:", err);
        }
    });

    socket.on("rideStatus", async (statusInfo) => {
        const { rideId, rideStatus: status } = statusInfo;
        const normalizedStatus = String(status || "").toLowerCase();

        try {
            await Rides.findOneAndUpdate(
                { _id: rideId },
                [{
                    $set: {
                        status: normalizedStatus,
                        pickupTime: {
                            $cond: [
                                { $eq: [normalizedStatus, "ongoing"] },
                                { $ifNull: ["$pickupTime", "$$NOW"] },
                                "$pickupTime"
                            ]
                        },
                        dropTime: {
                            $cond: [
                                { $eq: [normalizedStatus, "completed"] },
                                { $ifNull: ["$dropTime", "$$NOW"] },
                                "$dropTime"
                            ]
                        }
                    }
                }],
                { new: true, updatePipeline: true }
            );

            rideStatus.to(rideId).emit("status", normalizedStatus);

        } catch (err) {
            console.error("rideStatus error:", err);
        }
    });

    socket.on("captainLocation", (location) => {
        const { longitude, latitude, rideId } = location;
        console.log("Live location:", longitude, latitude);

        rideStatus.to(rideId).emit("riderLocation", location);
    });

    socket.on("disconnect", () => {
        for (const [captainId, socketId] of captainSocketMap.entries()) {
            if (socketId === socket.id) {
                captainSocketMap.delete(captainId);
                console.log(`Captain ${captainId} disconnected`);
                break;
            }
        }
    });
});
