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

    socket.on("roomId", (activeRoom) => {
        socket.join(activeRoom);

        console.log(socket.id, "joined room", activeRoom);

        const clients = io.sockets.adapter.rooms.get(activeRoom);
        const numClients = clients ? clients.size : 0;

        console.log("Users in room:", numClients);
    });

    socket.on("chat", (payload) => {
        console.log(payload);

        chat.to(payload.roomId).emit("chat", payload);
    });

    socket.on("disconnect", () => {
        console.log("Disconnected:", socket.id);
    });
});


rideStatus.on("connection", (socket) => {

    socket.on("roomId", (activeRoomId) => {
        socket.join(activeRoomId);

        console.log(socket.id, "joined room", activeRoomId);

        const roomClients = rideStatus.adapter.rooms.get(activeRoomId);
        const totalClientsInRoom = roomClients ? roomClients.size : 0;

        console.log("Users in room:", totalClientsInRoom);
    });

    socket.on("redirect", async (rideAcceptanceInfo) => {
        const { captain: captainEmail, rideId: acceptedRideId } = rideAcceptanceInfo;

        const captainUser = await User.findOne({ email: captainEmail });
        console.log(captainUser);

        const captainObjectId = captainUser._id;

        const updatedRide = await Rides.findByIdAndUpdate(
            acceptedRideId,
            {
                $set: {
                    status: "Accepted",
                    captainId: captainObjectId
                }
            },
            { new: true }
        );

        console.log(updatedRide);

        rideStatus.to(acceptedRideId).emit("redirect", `/ride?rideId=${acceptedRideId}`);
    });
});