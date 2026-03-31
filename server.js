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
    cors: {
        origin: "*",
    }
});

const startServer = async () => {
    try {
        await connectDB();

        httpServer.on("error", (err) => {
            if (err.code === "EADDRINUSE") {
                console.error(`Port ${port} is already in use. Stop the other process or set PORT in .env.local.`);
                process.exit(1);
            }
            throw err;
        });

        httpServer.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });

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

        console.log(socket.id, "joined room", roomId);

        const roomClients = chat.adapter.rooms.get(roomId);
        const clientCount = roomClients ? roomClients.size : 0;

        console.log("Users in room:", clientCount);
    });

    socket.on("chat", (msg) => {
        console.log(msg);

        chat.to(msg.roomId).emit("chat", msg);
    });

    socket.on("disconnect", () => {
        console.log("Disconnected:", socket.id);
    });
});


rideStatus.on("connection", (socket) => {

    socket.on("roomId", (roomId) => {
        socket.join(roomId);

        console.log(socket.id, "joined room", roomId);

        const roomClients = rideStatus.adapter.rooms.get(roomId);
        const clientCount = roomClients ? roomClients.size : 0;

        console.log("Users in room:", clientCount);
    });

    socket.on("redirect", async (acceptInfo) => {
        const { captainEmail, rideId } = acceptInfo;

        const captain = await User.findOne({ email: captainEmail });
        // console.log(captain);

        const captainId = captain._id;

        const updatedRide = await Rides.findOneAndUpdate(
            { _id: rideId, status: "searching" },
            {
                $set: {
                    status: "Accepted",
                    captainId: captainId
                }
            },
            { new: true }
        );

        if (!updatedRide) {
            rideStatus.to(rideId).emit("rideRejected", "Ride already accepted");
            socket.disconnect()
            return;
        }

        rideStatus.emit("redirect", rideId);
    });

    socket.on("rideStatus", async (statusInfo) => {
        const { rideId, rideStatus: status } = statusInfo;

        const updatedRide = await Rides.findOneAndUpdate(
            { _id: rideId },
            {
                $set: {
                    status: status,
                }
            },
            { new: true }
        );

        rideStatus.to(rideId).emit("status", status);

    })
});
