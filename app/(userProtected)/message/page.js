"use client"
import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useSearchParams } from 'next/navigation';

const page = () => {
    const [message, setMessage] = useState("");
    const [id, setId] = useState("")
    const [Socket, setSocket] = useState(null);
    const search = useSearchParams();

    useEffect(() => {
        let roomId = search.get("rideId")
        console.log(roomId)
        const socket = io.connect('http://localhost:4000');
        setSocket(socket)
        socket.on("connect", () => {
            console.log("Connected:");
        });

        socket.emit('roomId', roomId)

        setId(roomId)

        socket.on("chat", (payload) => {
            console.log(payload.message)
        });

    }, [])

    useEffect(() => {
        console.log("Room updated:", id);
    }, [id]);

    const send = (e) => {
        e.preventDefault();
        if (!id) {
            console.log("Room not ready yet");
            return;
        }

        Socket.emit("chat", { message: message, roomId: id });
    }

    return (
        <>
            <form onSubmit={send}>
                <input type="text" placeholder='Send Message' name='text' value={message} onChange={(e) => setMessage(e.target.value)} />
                <button type='submit'>Send</button>
            </form>
        </>
    )
}

export default page
