"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const RideSelection = () => {
    const [isActive, setIsActive] = useState("Sedan")
    const [rideData, setRideData] = useState(null)
    const router = useRouter()

    useEffect(() => {
        const storedRideData = localStorage.getItem("rideData");
        console.log(storedRideData)
        if (!storedRideData) {
            router.push("/user-home");
            return;
        }
        try {
            const data = JSON.parse(storedRideData);
            const { drop, pickup, duration, distance } = data;
            console.log(drop)
            setRideData({ drop, pickup, duration, distance });
        } catch (error) {
            console.error("Invalid rideData in localStorage:", error);
            router.push("/user-home");
        }
    }, [])

    useEffect(() => {
        if (rideData?.pickup && rideData?.drop) {
            calculateAmount(rideData)
        }
    }, [rideData])

    const calculateAmount = async (rideData) => {
        try {
            const response = await fetch("/api/mappls/distance", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    pickup: rideData?.pickup,
                    drop: rideData?.drop,
                }),
            });

            const data = await response.json();
            console.log("Distance API response:", data);
            return data;
        } catch (error) {
            console.error("Error fetching distance:", error);
        }
    };




    return (
        <>
            <div className="bg-[#f6f7f8] dark:bg-[#101a22] font-display text-gray-900 dark:text-white h-screen flex flex-col overflow-hidden">
                {/* Main Content: Split View */}
                <div className="flex flex-1 overflow-hidden relative">
                    {/* Left Side: Map */}
                    <div className="flex-1 relative w-full lg:w-[65%] h-full bg-gray-100 dark:bg-gray-900 group">
                        <div className="w-full h-full bg-cover bg-center"
                            data-alt="Stylized map of city streets with a route highlighted in blue" data-location="San Francisco"
                            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD2WNcjeOBkQGWbDQz26fF_3qQb7ughAU1o6L4FW0O_YIaD_36p53RKtYdDnWPx16F-xPJmo2FMBTs7HR42qth7X9umD8oVdk_8s3Td4ZIzYw4MlqdF_d67OE0MLj9ZTZphh9eTqRji45HI8yqkVkbiHM0qlaD0--Pn4fer-0L6Ny1BQtYhB-ibqSEZxMqBHlw_z6IN8YJB5uuCmzJuUy6B90yons0WS6OLqhaSSWw8Y2CU1QOrUEBkCSQzd9Xhmesxv1ez-xNghUi2")' }}>
                            {/* Map Overlay Gradient for better visibility */}
                            <div className="absolute inset-0 bg-[#2b9dee]/5 mix-blend-multiply pointer-events-none"></div>
                        </div>
                        {/* Floating Map Controls */}
                        <div className="absolute right-6 bottom-8 flex flex-col gap-3">
                            <button className="bg-white dark:bg-[#1e293b] p-3 rounded-full shadow-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-transform hover:scale-105">
                                <span className="material-symbols-outlined">my_location</span>
                            </button>
                            <button className="bg-white dark:bg-[#1e293b] p-3 rounded-full shadow-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-transform hover:scale-105">
                                <span className="material-symbols-outlined">add</span>
                            </button>
                            <button className="bg-white dark:bg-[#1e293b] p-3 rounded-full shadow-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-transform hover:scale-105">
                                <span className="material-symbols-outlined">remove</span>
                            </button>
                        </div>
                        {/* Ride Status Pill on Map */}
                        <div className="absolute top-22 left-6 bg-white/90 dark:bg-[#1e293b]/90 backdrop-blur-md px-4 py-2 rounded-full shadow-soft flex items-center gap-2 animate-pulse">
                            <div className="size-2 rounded-full bg-green-500"></div>
                            <span className="text-sm font-bold text-gray-800 dark:text-gray-100">Finding nearby drivers...</span>
                        </div>
                    </div>
                    {/* Right Side: Control Panel / Sidebar */}
                    <div className="lg:max-w-105 w-full lg:w-[35%] min-w-100 h-full bg-white dark:bg-[#111518] shadow-2xl flex flex-col z-10 pt-20 border-l border-gray-100 dark:border-gray-800">
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-8 flex flex-col gap-6">
                            {/* Location Timeline */}
                            <div className="bg-gray-50 dark:bg-[#192229] p-5 rounded-2xl border border-gray-100 dark:border-gray-700/50">
                                <span className='flex items-center justify-between'><h2 className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-4">Your Route</h2>
                                    <h2 className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-4">Total Distance {Math.floor(rideData?.distance)} Km</h2>
                                </span>
                                <div className="grid grid-cols-[24px_1fr] gap-x-4">
                                    <div className="flex flex-col items-center pt-1">
                                        <div className="size-3 bg-[#2b9dee] rounded-full ring-4 ring-[#2b9dee]/20"></div>
                                        <div className="w-0.5 bg-linear-to-b from-[#2b9dee]/50 to-gray-300 dark:to-gray-600 h-full min-h-10 my-1 rounded-full"></div>
                                    </div>
                                    <div className="pb-6">
                                        <p className="text-xs text-gray-500 font-medium mb-0.5">Pick up • {new Date().toLocaleTimeString([], {
                                            hour: "numeric",
                                            minute: "2-digit",
                                        }).toUpperCase()}</p>
                                        <p className="text-[#111518] dark:text-white text-base font-bold leading-tight">
                                            {rideData?.pickup}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <span className="material-symbols-outlined text-gray-800 dark:text-white text-[24px]">location_on</span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium mb-0.5">Drop off • {rideData?.duration
                                            ? new Date(Date.now() + rideData.duration * 60000).toLocaleTimeString([], {
                                                hour: "numeric",
                                                minute: "2-digit",
                                            }).toUpperCase()
                                            : "Calculating..."
                                        } • {rideData?.duration ? `${Math.floor(rideData.duration / 60)}h ${rideData.duration % 60}m` : ""}
                                        </p>
                                        <p className="text-[#111518] dark:text-white text-base font-bold leading-tight">
                                            {rideData?.drop}
                                        </p>
                                        {/* <div className='text-sm text-gray-500 font-medium mb-0.5'>Total Distance {Math.floor(rideData?.distance)} Km</div> */}
                                    </div>
                                </div>

                            </div>
                            {/* Ride Selection Header */}
                            <div>
                                <h3 className="text-[#111518] dark:text-white text-xl font-bold mb-4 flex items-center gap-2">
                                    Choose a ride
                                    <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs px-2 py-1 rounded-full font-medium">
                                        3 options
                                    </span>
                                </h3>
                                <div className="flex flex-col gap-4">
                                    {/* Option 1: Micro */}
                                    <div onClick={() => setIsActive("Micro")} className={`group relative flex items-center justify-between p-4 rounded-2xl dark:bg-[#192229] dark:border-gray-700 cursor-pointer hover:shadow-soft hover:-translate-y-1 ${isActive === "Micro" ? 'border-yellow-400 border-2 shadow-glow bg-yellow-50' : 'hover:border-yellow-300 dark:hover:border-yellow-600 border border-gray-100 bg-white transition-all duration-300'}`} >
                                        <div className="flex items-center gap-4">
                                            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-xl">
                                                <span className="material-symbols-outlined text-yellow-600 dark:text-yellow-400 text-[28px]">electric_car</span>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-[#111518] dark:text-white text-lg font-bold">Micro</p>
                                                    <span className="material-symbols-outlined text-gray-400 text-[14px]">person</span>
                                                    <span className="text-xs text-gray-500 font-medium">1-2</span>
                                                </div>
                                                <p className="text-gray-500 text-sm">4 min away</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[#111518] dark:text-white text-lg font-bold">₹12</p>
                                        </div>
                                    </div>
                                    {/* Option 2: Sedan (Selected) */}
                                    <div onClick={() => setIsActive("Sedan")} className={`group relative flex items-center justify-between p-4 rounded-2xl dark:bg-blue-900/10 shadow-glow cursor-pointer ${isActive === "Sedan" ? 'border-[#2b9dee] border-2 shadow-glow bg-blue-50/50' : 'border border-gray-100 dark:border-gray-700 hover:border-blue-300 hover:shadow-soft hover:-translate-y-1 transition-all duration-300'}`}>
                                        <div className={`absolute -top-3 left-6 bg-[#2b9dee] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${isActive === "Sedan" ? 'block' : 'hidden'}`}>
                                            Recommended
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="bg-white dark:bg-[#2b9dee]/20 p-3 rounded-xl shadow-sm">
                                                <span className="material-symbols-outlined text-[#2b9dee] text-[28px]">local_taxi</span>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-[#111518] dark:text-white text-lg font-bold">Sedan</p>
                                                    <span className="material-symbols-outlined text-gray-400 text-[14px]">person</span>
                                                    <span className="text-xs text-gray-500 font-medium">1-4</span>
                                                </div>
                                                <p className="text-[#2b9dee] text-sm font-medium">2 min away</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[#111518] dark:text-white text-lg font-bold">₹18.00</p>
                                        </div>
                                    </div>
                                    {/* Option 3: SUV */}
                                    <div onClick={() => setIsActive("SUV")} className={`group relative flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-soft hover:-translate-y-1 ${isActive === "SUV" ? 'border-emerald-400 border-2 shadow-glow bg-emerald-50' : 'bg-white dark:bg-[#192229] border border-gray-100 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-600'}`}>
                                        <div className="flex items-center gap-4">
                                            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-xl">
                                                <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-[28px]">airport_shuttle</span>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-[#111518] dark:text-white text-lg font-bold">SUV</p>
                                                    <span className="material-symbols-outlined text-gray-400 text-[14px]">person</span>
                                                    <span className="text-xs text-gray-500 font-medium">1-6</span>
                                                </div>
                                                <p className="text-gray-500 text-sm">8 min away</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[#111518] dark:text-white text-lg font-bold">₹28.00</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Bottom Actions Area */}
                        <div className="p-6 lg:p-8 bg-white dark:bg-[#111518] border-t border-gray-100 dark:border-gray-800 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-20">
                            {/* CTA Button */}
                            <button className="w-full bg-[#2b9dee] hover:bg-[#2b9dee]/90 text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-[#2b9dee]/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group">
                                <Link href="/user-home/captain-searching" className="flex items-center gap-2">
                                    <span>Confirm {isActive}</span>
                                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                </Link>
                            </button>
                        </div>
                    </div>
                </div>
            </div >
        </>
    );
};

export default RideSelection;
