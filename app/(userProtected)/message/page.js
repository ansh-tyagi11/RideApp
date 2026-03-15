"use client"
import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const Socket = io.connect('http://localhost:4000')

const page = () => {
    const [message, setMessage] = useState("");
    const [id, setId] = useState("")

    useEffect(() => {
        Socket.on('roomId', (roomId) => {
            setId(roomId)
        })
        console.log(id)
    }, [])

    const send = (e) => {
        e.preventDefault();

        Socket.emit("chat", { message: message, room: id });

        Socket.on("chat", (payload) => {
            console.log(payload.message)
        });
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
