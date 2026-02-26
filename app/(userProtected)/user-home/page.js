"use client"
import React, { useState } from 'react';
import Maps from '@/components/maps';

export default function Home() {
    const [pickup, setPickup] = useState('Current Location');
    const [destination, setDestination] = useState('');

    const recentPlaces = [
        {
            name: 'Bond Street Sushi',
            time: '12 min',
            distance: '4.2 km',
            icon: 'restaurant',
            color: 'orange'
        },
        {
            name: 'Blue Bottle Coffee',
            time: '5 min',
            distance: '1.1 km',
            icon: 'local_cafe',
            color: 'purple'
        },
        {
            name: 'Westfield Mall',
            time: '25 min',
            distance: '12 km',
            icon: 'shopping_bag',
            color: 'sky'
        },
        {
            name: "Sarah's Apartment",
            time: '18 min',
            distance: '6.5 km',
            icon: 'favorite',
            color: 'pink'
        }
    ];

    const getColorClasses = (color) => {
        const colors = {
            orange: 'bg-orange-100 text-orange-600',
            purple: 'bg-purple-100 text-purple-600',
            sky: 'bg-sky-100 text-sky-600',
            pink: 'bg-pink-100 text-pink-600'
        };
        return colors[color] || 'bg-gray-100 text-gray-600';
    };

    return (
        <>

            <div className="relative w-full h-screen flex flex-col bg-[#f6f7f8] text-slate-900 overflow-hidden">
                {/* Main Map Area */}
                <main className="absolute inset-0 z-0">
                    <div className="w-full h-full bg-cover bg-center">
                        <Maps />
                        <div className="absolute inset-0 bg-blue-50/30 mix-blend-overlay" />
                        <div className="absolute inset-0 bg-white/10 backdrop-contrast-[0.9] backdrop-brightness-110" />
                    </div>

                    {/* Floating Car Markers */}
                    <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 p-2 bg-white rounded-full shadow-lg z-0 animate-pulse">
                        <span className="material-symbols-outlined text-[#2b9dee]">directions_car</span>
                    </div>
                    <div className="absolute top-2/3 left-2/3 p-2 bg-white rounded-full shadow-lg z-0">
                        <span className="material-symbols-outlined text-slate-400">directions_car</span>
                    </div>
                    <div className="absolute bottom-1/4 left-1/4 p-2 bg-white rounded-full shadow-lg z-0">
                        <span className="material-symbols-outlined text-slate-400">directions_car</span>
                    </div>
                </main>

                {/* Floating UI Panel (Left Side) */}
                <div className="absolute z-40 top-24 left-6 md:left-12 w-full lg:max-w-105 max-w-85 flex flex-col gap-5 h-[calc(100vh-8rem)] pointer-events-none">
                    {/* Main Booking Card */}
                    <div className="bg-white rounded-3xl shadow-lg p-6 pointer-events-auto flex flex-col gap-6">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <h1 className="text-xl font-bold text-slate-900">Book a ride</h1>
                            <span className="bg-[#2b9dee]/10 text-[#2b9dee] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                Now
                            </span>
                        </div>

                        {/* Inputs with Connector */}
                        <div className="relative flex flex-col gap-4">
                            {/* Connector Line */}
                            <div className="absolute left-5.75 top-7 bottom-7 w-0.5 border-l-2 border-dotted border-slate-300 z-0" />

                            {/* Pickup Input */}
                            <div className="relative z-10 group">
                                <label className="flex items-center bg-[#f6f7f8] group-focus-within:bg-white group-focus-within:ring-2 group-focus-within:ring-[#2b9dee]/20 transition-all rounded-full border border-transparent group-focus-within:border-[#2b9dee]/30">
                                    <div className="w-12 h-12 flex items-center justify-center text-[#2b9dee] shrink-0">
                                        <span className="material-symbols-outlined text-[20px]">my_location</span>
                                    </div>
                                    <input
                                        className="w-full bg-transparent outline-none border-none text-slate-900 font-medium placeholder-slate-400 focus:ring-0 text-sm py-3.5 pr-4"
                                        placeholder="Pickup location"
                                        type="text"
                                        value={pickup}
                                        onChange={(e) => setPickup(e.target.value)}
                                    />
                                </label>
                            </div>

                            {/* Destination Input */}
                            <div className="relative z-10 group">
                                <label className="flex items-center bg-[#f6f7f8] group-focus-within:bg-white group-focus-within:ring-2 group-focus-within:ring-[#2b9dee]/20 transition-all rounded-full border border-transparent group-focus-within:border-[#2b9dee]/30">
                                    <div className="w-12 h-12 flex items-center justify-center text-slate-400 group-focus-within:text-red-500 transition-colors shrink-0">
                                        <span className="material-symbols-outlined text-[24px]">location_on</span>
                                    </div>
                                    <input
                                        className="w-full outline-none bg-transparent border-none text-slate-900 font-medium placeholder-slate-400 focus:ring-0 text-sm py-3.5 pr-4"
                                        placeholder="Where to?"
                                        type="text"
                                        value={destination}
                                        onChange={(e) => setDestination(e.target.value)}
                                    />
                                    <div className="pr-3 text-slate-400">
                                        <span className="material-symbols-outlined text-[20px]">search</span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Quick Action Chips */}
                        <div className="flex items-center gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                            <button className="flex items-center gap-2 pl-3 pr-4 py-2.5 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors min-w-max group">
                                <span className="material-symbols-outlined text-[18px] group-hover:scale-110 transition-transform">home</span>
                                <span className="text-sm font-bold">Home</span>
                            </button>
                            <button className="flex items-center gap-2 pl-3 pr-4 py-2.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-700 transition-colors min-w-max group">
                                <span className="material-symbols-outlined text-[18px] group-hover:scale-110 transition-transform">work</span>
                                <span className="text-sm font-bold">Work</span>
                            </button>
                            <button className="flex items-center gap-2 pl-3 pr-4 py-2.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors min-w-max group">
                                <span className="material-symbols-outlined text-[18px] group-hover:scale-110 transition-transform">bookmark</span>
                                <span className="text-sm font-bold">Saved</span>
                            </button>
                        </div>
                    </div>

                    {/* Recent Places Panel */}
                    <div className="flex-1 overflow-hidden flex flex-col pointer-events-auto">
                        <div className="bg-white/90 backdrop-blur-xl rounded-t-3xl rounded-b-[2.5rem] shadow-lg flex flex-col h-full border border-white/40">
                            <div className="p-6 pb-2">
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Recent Places</h3>
                            </div>
                            <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-1">
                                {recentPlaces.map((place, index) => (
                                    <button
                                        key={index}
                                        className="w-full flex items-center gap-4 p-3 rounded-2xl hover:bg-white/80 hover:shadow-sm transition-all group text-left"
                                    >
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform ${getColorClasses(place.color)}`}>
                                            <span className="material-symbols-outlined text-[20px]">{place.icon}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-slate-900 font-bold text-sm truncate">{place.name}</p>
                                            <p className="text-slate-500 text-xs truncate">{place.time} • {place.distance}</p>
                                        </div>
                                        <div className="text-slate-300 group-hover:text-[#2b9dee] transition-colors">
                                            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
