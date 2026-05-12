"use client";
import React, { useEffect, useState } from 'react';
import useCaptain from '@/hooks/useCaptain';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import socket from '@/lib/socket';
import fmtTime from '@/services/helper';

const CaptainHomePage = () => {
    const { user: captain } = useCaptain();
    const router = useRouter();
    const [status, setStatus] = useState("inactive");
    const [incomingRide, setIncomingRide] = useState(null);

    useEffect(() => {
        if (!socket.connected) socket.connect();

        const activeRideId = sessionStorage.getItem("activeRideId");
        if (activeRideId) {
            router.replace(`/captain-home/ride?rideId=${activeRideId}`);
            return;
        }

        if (captain?._id) {
            socket.emit("registerCaptain", captain._id);
            console.log("Captain registered with socket:", captain._id);
        }

        if (!captain?._id) return;

        let locationData = navigator.geolocation.getCurrentPosition(
            (position) => {
                const { longitude, latitude } = position.coords;
                socket.emit("captainLocation", {
                    longitude,
                    latitude,
                    captainId: captain._id,
                });
            },
            (err) => console.error("Geolocation error:", err),
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );


        console.log(locationData);

        socket.on("newRide", (rideData) => {
            setIncomingRide(rideData);
            console.log("New ride request received:", rideData);
        });

        socket.on("rideRejected", (msg) => toast.error(msg));

        socket.on("redirect", (rideId) => {
            sessionStorage.setItem("activeRideId", rideId);
            router.push(`/captain-home/ride?rideId=${rideId}`);
        });

        return () => {
            socket.off("newRide");
            socket.off("rideRejected");
            socket.off("redirect");
        };
    }, [captain?._id]);

    const acceptRide = () => {
        if (!captain || !incomingRide) return;
        if (!socket.connected) socket.connect();

        const { rideId } = incomingRide;

        socket.emit("roomId", rideId);
        socket.emit("redirect", {
            captainEmail: captain.email,
            rideId
        });
    };

    useEffect(() => {
        if (captain?.status) setStatus(captain.status);
    }, [captain?.status]);

    const updateStatus = async (e) => {
        if (!captain) return;

        const isChecked = e.target.checked;
        const newStatus = isChecked ? "active" : "inactive";

        setStatus(newStatus);
        console.log("New status:", newStatus);
        try {
            await fetch("/api/captainProfileUpdate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: captain.email,
                    data: { status: newStatus }
                })
            });
        } catch (error) {
            console.error("Failed to update captain status:", error);
            toast.error("Failed to update status.");
        }
    };



    return (
        <>
            <div className="bg-[#f6f7f8] dark:bg-[#101922] pt-20 text-[#0d141b] transition-colors duration-200">
                <div className="flex  overflow-hidden">

                    {/* Main Content Area */}
                    <main className="flex-1 flex flex-col overflow-y-auto">
                        <div className="p-8 max-w-5xl mx-auto w-full space-y-8">
                            <header className="flex items-center justify-between bg-[#f6f7f8] dark:bg-[#1a2632]/80 backdrop-blur-md py-4">
                                <div className="flex items-center gap-4">
                                    <h2 className="text-[#0d141b] dark:text-white text-xl font-bold tracking-tight">Hi, {captain?.name || "Captain"}</h2>
                                </div>
                                <div className="flex items-center gap-6">
                                    {/* Status Toggle */}
                                    <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 p-1 rounded-full px-4 py-2 border border-slate-200 dark:border-slate-700">
                                        <span className="text-xs font-bold text-[#4c739a] dark:text-slate-400 uppercase tracking-wider">Online</span>
                                        <label className={`relative flex h-6 w-11 cursor-pointer items-center rounded-full p-0.5 ${status === "active" ? "bg-[#22c55e]" : "bg-gray-400"}`}>
                                            <div
                                                className={`h-5 w-5 rounded-full bg-white shadow-sm transform transition ${status === "active" ? "translate-x-5" : "translate-x-0"
                                                    }`}
                                            ></div>
                                            <input
                                                type="checkbox"
                                                checked={status === "active"}
                                                onChange={updateStatus}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                </div>
                            </header>
                            {/* Active Request Section */}
                            <div>
                                <div className="flex items-center justify-between mb-4 px-1">
                                    <h3 className="text-[#0d141b] dark:text-white text-xl font-bold flex items-center gap-2">
                                        <span className="relative flex h-3 w-3">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22c55e] opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#22c55e]"></span>
                                        </span>
                                        Incoming Ride Request
                                    </h3>
                                </div>
                                {/* Request Card */}
                                <div className="bg-white dark:bg-[#1a2632] rounded-2xl shadow-xl border-2 border-[#137fec]/20 overflow-hidden flex flex-col lg:flex-row">
                                    {/* Map Preview */}
                                    {incomingRide && (<div className="lg:w-1/2 relative min-h-75 bg-slate-200 dark:bg-slate-700">
                                        <div className="absolute inset-0 bg-center bg-cover"
                                            data-alt="Minimal map showing a route from downtown to airport with a blue path"
                                            data-location="San Francisco"
                                            style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuBWLyGy-l57MSuoxSSFdSBiNfCotUgWArkkrWsSpUjXeL5wERjQmJ-uh5bmJURqNmyaVIhJuKp3IO4X-MSEG6GjxE1f-yfpHG4TfdzBbHehQNoOId0UrF7JdDOABTIqjiZ_LpcQVMdfRnRXZYSjD76G5l4p8mFyxvHxBGrUrJcOCSeZfMUMh7rXKWwyDJ8tMzIJaoYT6kDepq-tkNPiKd1iFlF75WkEFOB1I9t_yXXxOHO9gxAP4Q7_THTY-p3cxJ4-aqoPnZL4_5g")` }}>
                                        </div>
                                        {/* Map Overlay Tags */}
                                        <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-3 py-1.5 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                                            <p className="text-[10px] font-bold text-[#4c739a] uppercase">Current Location</p>
                                            <p className="text-xs font-bold">Market St &amp; 4th</p>
                                        </div>
                                    </div>)}
                                    {/* Ride Details */}
                                    {incomingRide && (
                                        <div className="lg:w-1/2 p-8 flex flex-col justify-between">
                                            <div className="space-y-6">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="text-sm font-semibold text-[#4c739a] dark:text-slate-400 mb-1">
                                                            Estimated Fare
                                                        </p>
                                                        <p className="text-4xl font-extrabold text-[#0d141b] dark:text-white tracking-tighter">
                                                            &#8377;{`${(incomingRide?.amount || 0).toFixed(2)}`}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="flex-col items-center gap-2">
                                                            <div className="text-sm font-bold dark:text-white">TOTAL DISTANCE : {incomingRide?.distance}KM</div>
                                                            <span className="text-xs font-bold">ESTIMATED TIME TAKEN : {fmtTime(incomingRide?.duration)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <hr className="border-slate-100 dark:border-slate-800" />
                                                {/* Route Timeline */}
                                                <div className="space-y-4">
                                                    <div className="flex gap-4">
                                                        <div className="flex flex-col items-center gap-1 mt-1">
                                                            <div className="size-2.5 rounded-full bg-[#137fec] ring-4 ring-[#137fec]/20"></div>
                                                            <div className="w-0.5 h-10 bg-slate-200 dark:bg-slate-700 border-dashed border-l">
                                                            </div>
                                                            <div className="size-2.5 rounded-full bg-[#22c55e] ring-4 ring-[#22c55e]/20"></div>
                                                        </div>
                                                        <div className="flex-1 space-y-4">
                                                            <div>
                                                                <p className="text-[10px] font-bold text-[#4c739a] dark:text-slate-500 uppercase tracking-widest">
                                                                    Pickup • 5 mins away
                                                                </p>
                                                                <p className="text-base font-bold text-[#0d141b] dark:text-white leading-tight">
                                                                    {incomingRide?.pickup}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] font-bold text-[#4c739a] dark:text-slate-500 uppercase tracking-widest">
                                                                    Drop-off • TOTAL DISTANCE : {incomingRide?.distance}KM
                                                                </p>
                                                                <p className="text-base font-bold text-[#0d141b] dark:text-white leading-tight">
                                                                    {incomingRide?.drop}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Action Buttons */}
                                            <div className="flex gap-4 mt-8">
                                                <button onClick={acceptRide} className="flex-1 bg-[#22c55e] hover:bg-[#22c55e]/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-[#22c55e]/20 transition-all flex items-center justify-center gap-2 cursor-pointer">
                                                    <span className="material-symbols-outlined">check_circle</span>
                                                    Accept Request
                                                </button>
                                                <button className="px-6 py-4 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-[#4c739a] font-bold rounded-xl transition-all">
                                                    Decline
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    )
}

export default CaptainHomePage
