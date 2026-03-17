"use client";
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import useCaptain from '@/hooks/useCaptain';

const page = () => {
    const { user } = useCaptain();
    const [rideStatusSocket, setRideStatusSocket] = useState("")

    useEffect(() => {
        const rideStatusSocket = io.connect("http://localhost:4000/rideStatus");
        setRideStatusSocket(rideStatusSocket)
        return () => rideStatusSocket.disconnect();
    }, [])

    const acceptRide = () => {
        if (!user) return;

        console.log(user?.email);

        const currentRideId = "";

        rideStatusSocket.emit("roomId", currentRideId);

        rideStatusSocket.emit("redirect", {
            captainEmail: user?.email,
            rideId: currentRideId
        });

        rideStatusSocket.on("redirect", (redirectPayload) => {
            console.log(redirectPayload);
        });

        console.log(user?.email);
    };

    return (
        <>
            <div className="bg-[#f6f7f8] dark:bg-[#101922] pt-20 text-[#0d141b] transition-colors duration-200">
                <div className="flex  overflow-hidden">

                    {/* Main Content Area */}
                    <main className="flex-1 flex flex-col overflow-y-auto">
                        {/* Top Header */}
                        <header className="flex items-center justify-between bg-[#f6f7f8] dark:bg-[#1a2632]/80 backdrop-blur-md px-8 py-4">
                            <div className="flex items-center gap-4">
                                <h2 className="text-[#0d141b] dark:text-white text-xl font-bold tracking-tight">Captain</h2>
                            </div>
                            <div className="flex items-center gap-6">
                                {/* Status Toggle */}
                                <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 p-1 rounded-full px-4 py-2 border border-slate-200 dark:border-slate-700">
                                    <span className="text-xs font-bold text-[#4c739a] dark:text-slate-400 uppercase tracking-wider">Online</span>
                                    <label className="relative flex h-6 w-11 cursor-pointer items-center rounded-full bg-[#22c55e] p-0.5">
                                        <div className="h-5 w-5 rounded-full bg-white shadow-sm transform translate-x-5"></div>
                                        <input checked="" className="hidden" type="checkbox" readOnly />
                                    </label>
                                </div>
                                {/* Earnings Summary */}
                                <div className="hidden md:flex flex-col items-end">
                                    <p className="text-[10px] uppercase font-bold text-[#4c739a] dark:text-slate-500 tracking-widest">
                                        Today's Earnings
                                    </p>
                                    <p className="text-lg font-bold text-[#0d141b] dark:text-white">$142.50</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="size-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-[#0d141b] dark:text-white relative">
                                        <span className="material-symbols-outlined">notifications</span>
                                        <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white dark:border-[#1a2632]"></span>
                                    </button>
                                </div>
                            </div>
                        </header>
                        {/* Dashboard Content */}
                        <div className="p-8 max-w-5xl mx-auto w-full space-y-8">
                            {/* Quick Stats Section */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-white dark:bg-[#1a2632] p-6 rounded-xl shadow-sm border border-[#e7edf3] dark:border-slate-800">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                                            <span className="material-symbols-outlined">star</span>
                                        </div>
                                        <span className="text-xs font-bold text-[#22c55e]">+0.2 this week</span>
                                    </div>
                                    <p className="text-sm font-medium text-[#4c739a] dark:text-slate-400">Rating</p>
                                    <p className="text-2xl font-bold text-[#0d141b] dark:text-white">4.92</p>
                                </div>
                                <div className="bg-white dark:bg-[#1a2632] p-6 rounded-xl shadow-sm border border-[#e7edf3] dark:border-slate-800">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                            <span className="material-symbols-outlined">schedule</span>
                                        </div>
                                        <span className="text-xs font-bold text-[#4c739a]">Goal: 40h</span>
                                    </div>
                                    <p className="text-sm font-medium text-[#4c739a] dark:text-slate-400">Hours Active</p>
                                    <p className="text-2xl font-bold text-[#0d141b] dark:text-white">32.5h</p>
                                </div>
                                <div className="bg-white dark:bg-[#1a2632] p-6 rounded-xl shadow-sm border border-[#e7edf3] dark:border-slate-800">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                                            <span className="material-symbols-outlined">check_circle</span>
                                        </div>
                                        <span className="text-xs font-bold text-[#4c739a]">12 today</span>
                                    </div>
                                    <p className="text-sm font-medium text-[#4c739a] dark:text-slate-400">Total Rides</p>
                                    <p className="text-2xl font-bold text-[#0d141b] dark:text-white">1,284</p>
                                </div>
                            </div>
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
                                    <span className="text-sm font-medium text-[#137fec]">Expires in 14s</span>
                                </div>
                                {/* Request Card */}
                                <div className="bg-white dark:bg-[#1a2632] rounded-2xl shadow-xl border-2 border-[#137fec]/20 overflow-hidden flex flex-col lg:flex-row">
                                    {/* Map Preview */}
                                    <div className="lg:w-1/2 relative min-h-75 bg-slate-200 dark:bg-slate-700">
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
                                    </div>
                                    {/* Ride Details */}
                                    <div className="lg:w-1/2 p-8 flex flex-col justify-between">
                                        <div className="space-y-6">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-sm font-semibold text-[#4c739a] dark:text-slate-400 mb-1">
                                                        Estimated Fare
                                                    </p>
                                                    <p className="text-4xl font-extrabold text-[#0d141b] dark:text-white tracking-tighter">
                                                        $18.00
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-semibold text-[#4c739a] dark:text-slate-400 mb-1">Rider
                                                    </p>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-bold dark:text-white">Sarah M.</span>
                                                        <div className="flex items-center text-amber-500">
                                                            <span className="material-symbols-outlined text-xs">star</span>
                                                            <span className="text-xs font-bold">4.9</span>
                                                        </div>
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
                                                                123 Tech Plaza, Downtown
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-bold text-[#4c739a] dark:text-slate-500 uppercase tracking-widest">
                                                                Drop-off • 2.4 miles
                                                            </p>
                                                            <p className="text-base font-bold text-[#0d141b] dark:text-white leading-tight">
                                                                International Airport, Terminal 2
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Action Buttons */}
                                        <div className="flex gap-4 mt-8">
                                            <button onClick={acceptRide} className="flex-1 bg-[#22c55e] hover:bg-[#22c55e]/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-[#22c55e]/20 transition-all flex items-center justify-center gap-2">
                                                <span className="material-symbols-outlined">check_circle</span>
                                                Accept Request
                                            </button>
                                            <button className="px-6 py-4 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-[#4c739a] font-bold rounded-xl transition-all">
                                                Decline
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Online Status Alert */}
                            <div className="rounded-xl border border-[#137fec]/20 bg-[#137fec]/5 p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="size-8 bg-[#137fec]/20 rounded-full flex items-center justify-center text-[#137fec]">
                                        <span className="material-symbols-outlined text-xl">info</span>
                                    </div>
                                    <p className="text-sm font-medium text-[#0d141b] dark:text-slate-300">
                                        High demand in <span className="font-bold">SOMA area</span>. Earn up to <span
                                            className="font-bold text-[#137fec]">$5.00 extra</span> per ride.
                                    </p>
                                </div>
                                <button className="text-[#137fec] font-bold text-sm hover:underline">View Map</button>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    )
}

export default page
