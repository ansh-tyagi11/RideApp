"use client"
import { useState, useRef, useEffect } from "react";

const quickReplies = ["I see you!", "Where are you?", "Be there in a sec"];

const initialMessages = [
    {
        id: 1,
        sender: "captain",
        text: "Hello! I've arrived at the pickup point. I'm parked right next to the main entrance.",
        time: "10:43 AM",
    },
    {
        id: 2,
        sender: "user",
        text: "Great, thank you! I'm just coming down the elevator now. Be there in 2 minutes.",
        time: "10:44 AM",
    },
    {
        id: 3,
        sender: "captain",
        text: "No rush at all. I have my hazard lights on, white Camry.",
        time: "10:45 AM",
    },
];


export default function Message() {
    const [messages, setMessages] = useState(initialMessages);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const getCurrentTime = () => {
        return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    const sendMessage = (text) => {
        const trimmed = text.trim();
        if (!trimmed) return;
        const newMsg = {
            id: Date.now(),
            sender: "user",
            text: trimmed,
            time: getCurrentTime(),
        };
        setMessages((prev) => [...prev, newMsg]);
        setInput("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") sendMessage(input);
    };

    return (
        <div
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", backgroundColor: "#fbf8ff" }}
            className="max-w-md mx-auto flex w-75 h-75 right-20 top-30 flex-col relative overflow-hidden bg-[#fbf8ff]">
            {/* Top App Bar */}
            <nav
                style={{
                    background: "rgba(251, 248, 255, 0.85)",
                    backdropFilter: "blur(20px)",
                    borderBottom: "1px solid rgba(195, 197, 217, 0.2)",
                }}
                className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#f3f2ff] transition-colors">
                        <span className="material-symbols-outlined text-[#191b25]">arrow_back</span>
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#e7e7f5] overflow-hidden border border-[#c3c5d9]/10">
                            <img
                                alt="Captain David"
                                className="w-full h-full object-cover"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPzugtsM6PTgh5VpHsfsW4bG7Ho2op-aqew2D3ouBILV4WCE8rwHPiZpCcCfZByvY5lnmjG6SSsHimZDRuOxDXLJpwxp70x4XRPQGRZQwxjlLQDSOr1v215M_1khVdGz-eL9bEPns_We5rdJDVLLAsuhb_QcxYJJlrhnL1rqQ_DX1yMaM8NQ_6mwGaEjTd4LrvsFp93QKD-YbfkylmkOSW0d2F7beIf2o4pm-AX7yJjA0cvms506a4xfhOShKQQJwFDE_XAPCzYpo"
                            />
                        </div>
                        <div>
                            <h1 className="text-[#191b25] font-bold text-base leading-tight">Captain David</h1>
                            <p className="text-[#737688] text-xs">Toyota Camry • AB 123 CD</p>
                        </div>
                    </div>
                </div>
                <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#003ec7]/10 text-[#003ec7] transition-transform active:scale-95">
                    <span className="material-symbols-outlined">call</span>
                </button>
            </nav>

            {/* Main Chat Area */}
            <main
                className="flex-1 overflow-y-auto px-6 w-70 pt-4 pb-36 space-y-6"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }} >
                {/* Trip Context Card */}
                <section className="relative">
                    <div className="bg-white rounded-xl p-6 border border-[#c3c5d9]/15 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className="space-y-1">
                                <span className="text-[10px] font-bold tracking-wider text-[#003ec7] uppercase">
                                    Current Trip
                                </span>
                                <h2 className="text-[#191b25] font-bold text-lg">Heading to Downtown</h2>
                            </div>
                            <div className="bg-[#f3f2ff] px-3 py-1 rounded-full">
                                <span className="text-[#191b25] font-bold text-sm">$24.50</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 py-2">
                            <div className="flex flex-col items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-[#003ec7]" />
                                <div className="w-0.5 h-6 bg-[#e7e7f5]" />
                                <div className="w-2 h-2 rounded-full border-2 border-[#003ec7] bg-white" />
                            </div>
                            <div className="flex-1 space-y-3">
                                <p className="text-[#737688] text-sm truncate">1248 Luxury Ave, Beverly Hills</p>
                                <p className="text-[#191b25] text-sm font-medium truncate">The Grand Hyatt Regency</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Timestamp */}
                <div className="flex justify-center">
                    <span className="text-[#737688] text-[10px] font-semibold tracking-widest uppercase">
                        10:42 AM
                    </span>
                </div>

                {/* Messages */}
                {messages.map((msg) =>
                    msg.sender === "captain" ? (
                        <div key={msg.id} className="flex items-end gap-3 max-w-[85%]">
                            <div className="flex-1 space-y-2">
                                <div className="bg-[#ededfb] text-[#191b25] p-4 rounded-t-xl rounded-br-xl rounded-bl-none text-sm leading-relaxed">
                                    {msg.text}
                                </div>
                                <span className="text-[10px] text-[#737688] px-1">
                                    Captain David • {msg.time}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div key={msg.id} className="flex items-end gap-3 max-w-[85%] ml-auto">
                            <div className="flex-1 space-y-2 flex flex-col items-end">
                                <div
                                    style={{ background: "linear-gradient(135deg, #003ec7 0%, #0052ff 100%)" }}
                                    className="text-white p-4 rounded-t-xl rounded-bl-xl rounded-br-none text-sm shadow-md leading-relaxed">
                                    {msg.text}
                                </div>
                                <div className="flex items-center gap-1 px-1">
                                    <span className="text-[10px] text-[#737688]">{msg.time}</span>
                                    <span
                                        className="material-symbols-outlined text-[#003ec7] text-xs"
                                        style={{ fontVariationSettings: "'FILL' 1", fontSize: "14px" }} >
                                        done_all
                                    </span>
                                </div>
                            </div>
                        </div>
                    )
                )}
                <div ref={messagesEndRef} />
            </main>

            {/* Bottom Controls */}
            <div
                style={{
                    background: "rgba(251, 248, 255, 0.9)",
                    backdropFilter: "blur(20px)",
                    borderTop: "1px solid rgba(195, 197, 217, 0.2)",
                }}
                className="z-50 max-w-md mx-auto px-6 pb-8 pt-4">
                {/* Quick Reply Chips */}
                <div className="flex gap-2 overflow-x-auto mb-4"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
                    {quickReplies.map((reply) => (
                        <button
                            key={reply}
                            onClick={() => sendMessage(reply)}
                            className="whitespace-nowrap bg-[#e7e7f5] text-[#191b25] px-4 py-2 rounded-full text-xs font-semibold hover:bg-[#e1e1ef] transition-colors active:scale-95">
                            {reply}
                        </button>
                    ))}
                </div>

                {/* Composer */}
                <div className="flex items-center gap-3">
                    <div className="flex-1 flex items-center bg-[#ededfb] rounded-full px-4 py-1 border border-[#c3c5d9]/10 focus-within:border-[#003ec7]/30 transition-all">
                        <button className="w-8 h-8 flex items-center justify-center text-[#737688] hover:text-[#003ec7] transition-colors">
                            <span className="material-symbols-outlined">add_circle</span>
                        </button>
                        <input
                            className="flex-1 bg-transparent border-none outline-none text-sm py-3 px-2 text-[#191b25] placeholder:text-[#737688]/60"
                            placeholder="Message Captain..."
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <button className="w-8 h-8 flex items-center justify-center text-[#737688] hover:text-[#003ec7] transition-colors">
                            <span className="material-symbols-outlined">mood</span>
                        </button>
                    </div>
                    <button
                        onClick={() => sendMessage(input)}
                        style={{ background: "linear-gradient(135deg, #003ec7 0%, #0052ff 100%)" }}
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg active:scale-95 transition-transform">
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