"use client"
import React, { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";

const quickReplies = ["I see you!", "Where are you?", "Be there in a sec"];

export default function Message({ role, name, image, rideId, onClose }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef(null);
    const [Socket, setSocket] = useState(null);
    const chatFocusRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const currentUser = role;

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const roomId = rideId;
        const socket = io("http://localhost:4000/chat", {
            autoConnect: true,
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 500,
            reconnectionDelayMax: 5000,
            timeout: 20000,
        });
        setSocket(socket)
        socket.on("connect", () => {
            console.log("Connected to Socket.IO server");
        });
        socket.on("reconnect", (attempt) => {
            console.log("Reconnected after", attempt, "attempt(s)");
        });
        socket.on("reconnect_attempt", (attempt) => {
            console.log("Reconnection attempt", attempt);
        });
        socket.on("reconnect_error", (err) => {
            console.log("Reconnect error", err?.message || err);
        });

        socket.emit('roomId', roomId);

        socket.on("chat", (payload) => {
            setMessages((prev) => [...prev, { id: Date.now(), sender: payload.sender, text: payload.message, time: payload.time }])
        })

        const handleOnline = () => {
            if (!socket.connected) {
                socket.connect();
            }
        };
        window.addEventListener("online", handleOnline);

        return () => {
            window.removeEventListener("online", handleOnline);
            socket.disconnect();
        };
    }, [rideId])

    const getCurrentTime = () => {
        return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    const sendMessage = (text) => {
        const trimmed = text.trim();
        if (!trimmed) return;
        const newMsg = {
            id: Date.now(),
            sender: role,
            text: trimmed,
            time: getCurrentTime(),
        };

        Socket.emit("chat", { message: newMsg.text, sender: newMsg.sender, time: newMsg.time, roomId: rideId })
        setInput("");
        chatFocusRef.current.focus();
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") sendMessage(input);
    };

    return (
        <div
            style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                background:
                    "radial-gradient(120% 120% at 0% 0%, #ffffff 0%, #f6f4ff 45%, #f1f6ff 100%)",
            }}
            className="max-w-md mx-auto flex h-125 flex-col relative overflow-hidden">
            {/* Top App Bar */}
            <nav
                style={{
                    background:
                        "linear-gradient(135deg, rgba(17, 24, 39, 0.96) 0%, rgba(30, 64, 175, 0.92) 55%, rgba(59, 130, 246, 0.9) 100%)",
                    backdropFilter: "blur(20px)",
                    borderBottom: "1px solid rgba(59, 130, 246, 0.25)",
                }}
                className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/15 transition-colors cursor-pointer">
                        <span className="material-symbols-outlined text-white">close</span>
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 overflow-hidden border border-white/20">
                            <img
                                alt="image"
                                className="w-full h-full object-cover"
                                src={image}
                            />
                        </div>
                        <div>
                            <h1 className="text-white font-bold text-base leading-tight">{name}
                            </h1>
                            <p className="text-white/70 text-xs font-medium">Ride chat</p>
                        </div>
                    </div>
                </div>
            </nav>

            <hr className="text-black-500" />

            {/* Main Chat Area */}
            <main
                className="flex-1 overflow-y-auto px-6 pt-4 pb-36 space-y-6"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }} >

                {/* Messages */}
                {messages.map((msg) =>
                    msg.sender === currentUser ? (
                        <div key={msg.id} className="flex items-end gap-3 max-w-[85%] ml-auto">
                            <div className="flex-1 space-y-2 flex flex-col items-end">
                                <div
                                    style={{ background: "linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)" }}
                                    className="text-white p-4 rounded-t-xl rounded-bl-xl rounded-br-none text-sm shadow-md leading-relaxed wrap-break-word whitespace-pre-wrap"
                                >
                                    {msg.text}
                                </div>
                                <div className="flex items-center gap-1 px-1">
                                    <span className="text-[10px] text-[#737688]">{msg.time}</span>
                                    <span
                                        className="material-symbols-outlined text-[#2563eb] text-xs"
                                        style={{ fontVariationSettings: "'FILL' 1", fontSize: "14px" }}
                                    >
                                        done_all
                                    </span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        // LEFT SIDE (other person)
                        <div key={msg.id} className="flex items-end gap-3 max-w-[85%]">
                            <div className="flex-1 space-y-2">
                                <div className="bg-white/90 text-[#0f172a] p-4 rounded-t-xl rounded-br-xl rounded-bl-none text-sm leading-relaxed shadow-sm border border-[#e5e7eb] wrap-break-word whitespace-pre-wrap">
                                    {msg.text}
                                </div>

                                <span className="text-[10px] text-[#737688] px-1">
                                    {msg.time}
                                </span>
                            </div>
                        </div>
                    )
                )}
                <div ref={messagesEndRef} />
            </main>

            {/* Bottom Controls */}
            <div
                style={{
                    background: "linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(245,247,255,0.95) 100%)",
                    backdropFilter: "blur(20px)",
                    borderTop: "1px solid rgba(59, 130, 246, 0.15)",
                }}
                className="z-50 max-w-md mx-auto px-6 pb-8 pt-4">
                {/* Quick Reply Chips */}
                <div className="flex gap-2 overflow-x-auto mb-4"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
                    {quickReplies.map((reply) => (
                        <button
                            key={reply}
                            onClick={() => sendMessage(reply)}
                            className="whitespace-nowrap bg-white/90 text-[#0f172a] px-4 py-2 rounded-full text-xs font-semibold hover:bg-[#eef2ff] border border-[#e5e7eb] transition-colors active:scale-95">
                            {reply}
                        </button>
                    ))}
                </div>

                {/* Composer */}
                <div className="flex items-center gap-3">
                    <div className="flex-1 flex items-center bg-white/90 rounded-full px-4 py-1 border border-[#e5e7eb] focus-within:border-[#3b82f6]/40 transition-all">
                        <button className="w-8 h-8 flex items-center justify-center text-[#94a3b8] hover:text-[#2563eb] transition-colors">
                            <span className="material-symbols-outlined">add_circle</span>
                        </button>
                        <input ref={(el) => {
                            chatFocusRef.current = el;
                            el?.focus();
                        }}
                            className="flex-1 bg-transparent border-none outline-none text-sm py-3 px-2 text-[#191b25] placeholder:text-[#737688]/60"
                            placeholder="Message..."
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <button className="w-8 h-8 flex items-center justify-center text-[#94a3b8] hover:text-[#2563eb] transition-colors">
                            <span className="material-symbols-outlined">mood</span>
                        </button>
                    </div>
                    <button
                        onClick={() => sendMessage(input)}
                        style={{ background: "linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)" }}
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg active:scale-95 transition-transform cursor-pointer">
                        <span
                            className="material-symbols-outlined"
                            style={{ fontVariationSettings: "'FILL' 1" }}>
                            send
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}
