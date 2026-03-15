const express = require('express');
const app = express();
const port = 4000;
const { createServer } = require("http");
const { Server } = require("socket.io");
const crypto = require('crypto');

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
    }
})

io.on("connection", (socket) => {

    // console.log(socket.id); 
    // console.log("Socket is active to be connected");
    const roomId = crypto.randomBytes(32).toString('hex')

    socket.emit('roomId', roomId)

    socket.on("chat", (payload) => {
        console.log(payload);

        io.to(payload.roomId).emit("chat", payload)
    })

    socket.on("disconnect", () => {
        console.log("Disconnected:", socket.id)
    })
})

httpServer.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})