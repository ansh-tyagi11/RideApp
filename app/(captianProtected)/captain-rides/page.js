"use client";
import React, { useEffect, useState } from 'react';

const Page = () => {
    const [isActive, setIsActive] = useState(false);
    const [input, setInput] = useState('');
    const [debouncedInput, setDebouncedInput] = useState("");

    const rides = [
        {
            rideId: "RID10234",
            destination: "Connaught Place, Delhi",
            date: "2026-02-01",
            driver: "Amit Sharma",
            fare: 320
        },
        {
            rideId: "RID10235",
            destination: "Bandra West, Mumbai",
            date: "2026-01-29",
            driver: "Rahul Verma",
            fare: 540
        },
        {
            rideId: "RID10236",
            destination: "Electronic City, Bengaluru",
            date: "2026-02-02",
            driver: "Suresh Kumar",
            fare: 410
        }
    ];

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedInput(input);
        }, 500);

        return () => clearTimeout(timer)
    }, [input]);

    const match = rides.filter(ride =>
        ride.rideId.toLowerCase().includes(debouncedInput.toLowerCase()) ||
        ride.destination.toLowerCase().includes(debouncedInput.toLowerCase()) ||
        ride.date.includes(debouncedInput)
    )

    const handleExpand = () => {
        setIsActive(!isActive)
    }

    return (
        <>
            <div className="bg-[#f6f7f8] dark:bg-[#101922] pt-20 font-display text-slate-900 dark:text-slate-100 min-h-screen">
                {/* Main Container */}
                <div className="flex overflow-hidden">
                    {/* Main Content Area */}
                    <main className="flex-1 overflow-y-auto flex flex-col">

                        {/* Page Content */}
                        <div className="p-8 max-w-6xl w-full mx-auto">
                            {/* Page Heading */}
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div className="flex flex-col gap-1">
                                    <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">All Rides</h1>
                                    <p className="text-slate-500 text-sm font-medium">
                                        Review your trip history and detailed earnings report
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold shadow-sm hover:shadow-md transition-all">
                                        <span className="material-symbols-outlined text-sm">download</span>
                                        Export CSV
                                    </button>
                                </div>
                            </div>
                            {/* Top Navigation Bar */}
                            <header className="flex items-center justify-between dark:border-slate-800 py-8 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-10">
                                <div className="flex flex-col gap-4 flex-1">
                                    <label className="relative w-full max-w-md flex flex-col">
                                        <span className="material-symbols-outlined absolute left-3 top-2 text-slate-400">search</span>
                                        <input
                                            type="search"
                                            placeholder="Search ride ID, destination, or date..."
                                            className="w-full h-10 pl-10 pr-4 rounded-lg border border-slate-300 bg-slate-100 dark:bg-slate-800 text-sm focus:border-[#137fec] focus:ring-2 focus:ring-[#137fec]/50 transition-all placeholder:text-slate-400"
                                            onChange={(e) => setInput(e.target.value)}
                                            value={input}
                                        />
                                        {/* Search Results Dropdown */}
                                        {debouncedInput.trim() && (
                                            <ul className="absolute top-full left-0 right-0 mt-1 max-h-64 overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg z-50">
                                                {match.length > 0 ? (
                                                    match.map((item, index) => (
                                                        <li key={index} className="px-4 py-2 hover:bg-[#137fec]/10 dark:hover:bg-[#137fec]/20 cursor-pointer rounded-md">
                                                            <div className="text-sm font-semibold">{item.rideId}</div>
                                                            <div className="text-xs text-slate-500 dark:text-slate-400">{item.destination} • {item.date}</div>
                                                        </li>
                                                    ))
                                                ) : (
                                                    <li className="px-4 py-2 text-slate-400 dark:text-slate-500 text-sm">No rides found</li>
                                                )}
                                            </ul>
                                        )}
                                    </label>

                                </div>
                            </header>
                            {/* Filters (Chips) */}
                            <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                                <button className="px-5 py-2 rounded-full bg-[#137fec] text-white text-sm font-bold shadow-lg shadow-[#137fec]/20 transition-all">
                                    All
                                </button>
                                <button className="px-5 py-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                                    Completed
                                </button>
                                <button className="px-5 py-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                                    Canceled
                                </button>
                                <button className="px-5 py-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                                    Ongoing
                                </button>
                            </div>
                            {/* Ride Cards List */}
                            <div className="flex-col flex gap-6">
                                {/* Ride Card 1 (Completed) */}
                                <div className="bg-white dark:bg-slate-900 rounded-xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 hover:border-[#137fec]/40 transition-all flex flex-col lg:flex-col gap-6">
                                    <div className="flex lg:flex-row flex-col gap-6">
                                        <div className="w-full lg:w-48 h-32 lg:h-auto bg-center bg-no-repeat bg-cover rounded-lg overflow-hidden shrink-0 border border-slate-100 dark:border-slate-800"
                                            data-alt="Map showing a city route from downtown to airport" data-location="Dubai, UAE"
                                            style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuA4TXpQ_w5zchUC4uhnPZYEb_A2sKtCNhEiJ6mTsHGwoPleSBLOyYUyGvgL8iow4_IBW1b6nRMwi78CRxduHWa_yjfEywSeyKOHAdG1iRu4rSFYFmNCueeGQgtMIGj4SNgE_aDkrGmv2ggIW_2guTeEgwpHbi5hWpNTmsm7YikXlVrTpzD9XvmjQNorKuHDr_0fBX75iPX4wUfATiHsOiKjKylB9balP1_Bn4h9zDoxx7Tg4dxwTyqeaUB10BhhgOnVKcAYra_dejQ")` }}>
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
                                                <div className="flex flex-col">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">Completed</span>
                                                        <span className="text-slate-400 text-sm font-medium">Oct 24, 2023 • 02:30 PM</span>
                                                    </div>
                                                    <div className="space-y-3">
                                                        <div className="flex items-start gap-3">
                                                            <span className="material-symbols-outlined text-[#137fec] text-lg">radio_button_checked</span>
                                                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                                                123 Business Bay Towers, Downtown
                                                            </p>
                                                        </div>
                                                        <div className="flex items-start gap-3">
                                                            <span className="material-symbols-outlined text-slate-400 text-lg">location_on</span>
                                                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                                                International Airport Terminal 3
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Total Earned</p>
                                                    <p className="text-2xl font-black text-slate-900 dark:text-white">$24.50</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50 dark:border-slate-800">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                                                        <span className="material-symbols-outlined text-sm">schedule</span>
                                                        24 mins
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                                                        <span className="material-symbols-outlined text-sm">distance</span>
                                                        12.5 km
                                                    </div>
                                                </div>
                                                <button onClick={handleExpand} className="text-[#137fec] text-sm font-bold flex items-center gap-1">
                                                    <span className="hover:underline">View Details</span>
                                                    <span className={`material-symbols-outlined text-sm transition-transform ${isActive ? "rotate-180" : "rotate-0"}`}>expand_more</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Expanded Ride Card */}
                                    {/* Card Header: Visual Image & Basic Info */}
                                    <div className={`transition-all duration-300 ease-in-out ${isActive ? "max-w96 py-6 opacity-100" : "max-h-0 py-0 opacity-0"}`}>
                                        <div className="p-6 border-b border-[#e7edf3] dark:border-slate-800 flex flex-col md:flex-row gap-6">
                                            <div className="w-full md:w-1/3 aspect-video bg-slate-200 dark:bg-slate-800 rounded-lg overflow-hidden relative"
                                                data-location="San Francisco"
                                                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDJc9CrlFypKbmlXHVtfPCrv4gkz5Or3kk_gvFln5D_w1iRixAFLiTVWKE9jchoYOTycbUJyK3d_1y4wNJ1st894mWY4d8ZpBVrWxPVSOVlnaFV5J1psU2EFME181VZ0EDP-tkpRy2AR2wIHCXGbEEXkXC57clZeUIEdmYEW-qxzUiDR8DgwzhCoL54wCcWFWw8NnxFr4Wmgv-qA6alg21C9rQLGh72jenspJ2nOJArKXCYvkp0afBCVjr6EkgRYEa8rf02OySjMHM')" }}>
                                                <div className="absolute inset-0 bg-cover bg-center"
                                                    data-alt="Map showing the trip route from downtown to airport"
                                                    style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBQkiHOlJx_3AtvPu_ZiDEI5LShfvWrO8I3aZ7ci40DNK-85ghcUHyZhwQ5yczFURfyLJYF8fOqDj6F7k65Pz1HsB96q17tRa7rkNYW_X5LZG-sOdBLuiHcHeIkR8I06bRtoohMwAIkYhVOuWlvduLy4OyYt8cvkijXdq0Ptsx6qees6oVe6dELiMzqtdaTw6rEJDuBXIoSds4355LVB8-3tAulRTav_dkHb0VjcCJHWxLqKLt2jUqLjH96tHYrxYp9er6OqIcbUnU")' }}>
                                                </div>
                                                <div className="absolute inset-0 bg-[#137fec]/10"></div>
                                                <div
                                                    className="absolute bottom-4 left-4 bg-white/90 dark:bg-slate-900/90 px-3 py-1.5 rounded-lg text-xs font-bold text-[#137fec] shadow-sm uppercase tracking-wider">
                                                    Successful Trip</div>
                                            </div>
                                            <div className="flex-1 flex flex-col justify-between py-1">
                                                <div>
                                                    <h3 className="text-[#0d141b] dark:text-white text-2xl font-bold mb-1">Trip #84920</h3>
                                                    <p className="text-[#4c739a] dark:text-slate-400 text-sm">Completed on Tuesday, Oct 24, 2023 • 02:45 PM</p>
                                                </div>
                                                <div className="flex items-center gap-6 mt-4 md:mt-0">
                                                    <div className="flex items-center gap-3">
                                                        <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-12 w-12 border-2 border-[#137fec]/20"
                                                            data-alt="Passenger profile photo"
                                                            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCUbz21ajIBfSGCjsVoWNXFbxq3hRP7yo4-krBWXHt82PhlKkcoUxwu0IRLriTGpAgXHnzRacBRJ5x3gpX7qA58GSH6S7x73-vZtHjPRxSlZRgkCEOayBDRNHKxb2J5wFSb0B6NtkEWVv0lURjsUZYxjEI18kvXTtH34vXCtZc2lQ3aRZjhw_LrRxHk5D57giVbmPpGIbqO94dyYCV72NXzQlxr_RIHQCzaIIxNlVTI937iKk832S2Es-3o8jpUGfDFHVSqP2kT4hY")' }}>
                                                        </div>
                                                        <div>
                                                            <p className="text-[#0d141b] dark:text-white font-bold leading-tight">John Doe</p>
                                                            <div className="flex items-center text-yellow-500 gap-1">
                                                                <span
                                                                    className="material-symbols-outlined text-[16px] material-symbols-fill">star</span>
                                                                <span
                                                                    className="text-xs font-bold text-[#4c739a] dark:text-slate-400">4.9</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="h-10 w-px bg-slate-200 dark:bg-slate-800"></div>
                                                    <div className="flex flex-col">
                                                        <p
                                                            className="text-xs uppercase text-[#4c739a] dark:text-slate-500 font-bold tracking-wider">
                                                            Payment</p>
                                                        <div className="flex items-center gap-1.5 text-[#137fec]">
                                                            <span className="material-symbols-outlined text-[18px]">credit_card</span>
                                                            <span className="text-sm font-bold">Credit Card</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Detailed Content Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-2">
                                            {/* Left Col: Timeline & Stats */}
                                            <div className="p-6 border-r border-[#e7edf3] dark:border-slate-800">
                                                <h4 className="text-sm font-bold text-[#0d141b] dark:text-white mb-6 uppercase tracking-widest">
                                                    Journey Details</h4>
                                                <div className="relative pl-8 mb-8">
                                                    <div
                                                        className="absolute left-1.75 top-2 bottom-2 w-0.5 bg-slate-200 dark:bg-slate-800 border-dashed border-l-2">
                                                    </div>
                                                    <div className="mb-8 relative">
                                                        <div
                                                            className="absolute -left-8 top-1 size-4 rounded-full bg-[#137fec] ring-4 ring-[#137fec]/10">
                                                        </div>
                                                        <p className="text-xs font-bold text-[#137fec] uppercase mb-1">Pickup • 02:30 PM</p>
                                                        <p className="text-sm font-medium text-[#0d141b] dark:text-slate-200">Downtown Business
                                                            Hub, Main St 101</p>
                                                    </div>
                                                    <div className="relative">
                                                        <div
                                                            className="absolute -left-8 top-1 size-4 rounded-full bg-slate-800 dark:bg-slate-200 ring-4 ring-slate-200 dark:ring-slate-700">
                                                        </div>
                                                        <p className="text-xs font-bold text-[#4c739a] dark:text-slate-500 uppercase mb-1">
                                                            Dropoff • 02:45 PM</p>
                                                        <p className="text-sm font-medium text-[#0d141b] dark:text-slate-200">International
                                                            Airport Terminal 3</p>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="bg-[#f0f4f8] dark:bg-slate-800/50 p-4 rounded-lg">
                                                        <p className="text-xs text-[#4c739a] mb-1">Trip Duration</p>
                                                        <div className="flex items-center gap-2 font-bold text-[#0d141b] dark:text-white">
                                                            <span
                                                                className="material-symbols-outlined text-[18px] text-[#4c739a]">schedule</span>15
                                                            mins
                                                        </div>
                                                    </div>
                                                    <div className="bg-[#f0f4f8] dark:bg-slate-800/50 p-4 rounded-lg">
                                                        <p className="text-xs text-[#4c739a] mb-1">Distance</p>
                                                        <div className="flex items-center gap-2 font-bold text-[#0d141b] dark:text-white">
                                                            <span className="material-symbols-outlined text-[18px] text-[#4c739a]">route</span>
                                                            8.2 km
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Right Col: Payout Breakdown */}
                                            <div className="p-6 bg-slate-50/50 dark:bg-slate-900/50">
                                                <h4 className="text-sm font-bold text-[#0d141b] dark:text-white mb-6 uppercase tracking-widest">
                                                    Payout Breakdown</h4>
                                                <div className="space-y-4">
                                                    <div className="flex justify-between items-center text-sm">
                                                        <span className="text-[#4c739a] dark:text-slate-400">Base Fare</span>
                                                        <span className="font-medium text-[#0d141b] dark:text-slate-200">₹12.00</span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-sm">
                                                        <span className="text-[#4c739a] dark:text-slate-400">Peak Surge (1.2x)</span>
                                                        <span className="font-medium text-[#137fec]">+₹3.50</span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-sm">
                                                        <span className="text-[#4c739a] dark:text-slate-400">Passenger Tip</span>
                                                        <span className="font-medium text-emerald-600 dark:text-emerald-400">+₹2.00</span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-sm">
                                                        <span className="text-[#4c739a] dark:text-slate-400">Platform Service Fee (10%)</span>
                                                        <span className="font-medium text-red-500">-₹1.50</span>
                                                    </div>
                                                    <div className="pt-4 border-t border-slate-200 dark:border-slate-800 mt-4">
                                                        <div className="flex justify-between items-end">
                                                            <div>
                                                                <p className="text-xs font-bold text-[#137fec] uppercase mb-1">Net Earnings</p>
                                                                <p className="text-3xl font-black text-[#0d141b] dark:text-white">₹16.00</p>
                                                            </div>
                                                            <div
                                                                className="flex items-center gap-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full text-xs font-bold">
                                                                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                                                                Paid
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Action Footer */}
                                        <div className="p-6 bg-[#f8fafc] dark:bg-slate-800/20 border-t border-[#e7edf3] dark:border-slate-800 flex flex-wrap gap-4 items-center justify-between">
                                            <div className="flex gap-3">
                                                <button className="flex items-center gap-2 px-6 py-2.5 bg-[#137fec] hover:bg-[#137fec]/90 text-white rounded-lg font-bold text-sm transition-all shadow-md shadow-[#137fec]/20">
                                                    <span className="material-symbols-outlined text-[20px]">map</span>
                                                    View Route
                                                </button>
                                                <button className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-[#137fec] text-[#0d141b] dark:text-slate-100 rounded-lg font-bold text-sm transition-all">
                                                    <span className="material-symbols-outlined text-[20px]">download</span>
                                                    Get Invoice
                                                </button>
                                            </div>
                                            <button className="flex items-center gap-2 px-5 py-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg font-bold text-sm transition-all">
                                                <span className="material-symbols-outlined text-[20px]">flag</span>
                                                Report Issue
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {/* Ride Card 2 (Canceled) */}
                                <div className="bg-white dark:bg-slate-900 rounded-xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 hover:border-red-400/40 transition-all flex flex-col lg:flex-row gap-6">
                                    <div className="w-full lg:w-48 h-32 lg:h-auto bg-center bg-no-repeat bg-cover rounded-lg overflow-hidden shrink-0 border border-slate-100 dark:border-slate-800 grayscale"
                                        data-alt="Route map with a cancellation indicator" data-location="Dubai, UAE"
                                        style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuA4TXpQ_w5zchUC4uhnPZYEb_A2sKtCNhEiJ6mTsHGwoPleSBLOyYUyGvgL8iow4_IBW1b6nRMwi78CRxduHWa_yjfEywSeyKOHAdG1iRu4rSFYFmNCueeGQgtMIGj4SNgE_aDkrGmv2ggIW_2guTeEgwpHbi5hWpNTmsm7YikXlVrTpzD9XvmjQNorKuHDr_0fBX75iPX4wUfATiHsOiKjKylB9balP1_Bn4h9zDoxx7Tg4dxwTyqeaUB10BhhgOnVKcAYra_dejQ")` }}>
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <span className="bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">Canceled</span>
                                                    <span className="text-slate-400 text-sm font-medium">Oct 24, 2023 • 11:15 AM</span>
                                                </div>
                                                <div className="space-y-3 opacity-60">
                                                    <div className="flex items-start gap-3">
                                                        <span className="material-symbols-outlined text-[#137fec] text-lg">radio_button_checked</span>
                                                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                                            Marina Walk Entrance, Gate 2
                                                        </p>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <span className="material-symbols-outlined text-slate-400 text-lg">location_on</span>
                                                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                                            Mall of the Emirates
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Fee</p>
                                                <p className="text-2xl font-black text-slate-900 dark:text-white">$3.00</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50 dark:border-slate-800">
                                            <div className="flex items-center gap-4">
                                                <p className="text-red-500 text-xs font-bold uppercase italic">Canceled by Passenger</p>
                                            </div>
                                            <button className="text-slate-400 text-sm font-bold hover:underline flex items-center gap-1">
                                                Report Issue
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {/* Ride Card 3 (Ongoing) */}
                                <div className="bg-white dark:bg-slate-900 rounded-xl p-5 shadow-sm border border-[#137fec]/30 dark:border-[#137fec]/20 transition-all flex flex-col lg:flex-row gap-6 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-1">
                                        <span className="flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#137fec] opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#137fec]"></span>
                                        </span>
                                    </div>
                                    <div className="w-full lg:w-48 h-32 lg:h-auto bg-center bg-no-repeat bg-cover rounded-lg overflow-hidden shrink-0 border border-slate-100 dark:border-slate-800"
                                        data-alt="Active navigation map with live car icon" data-location="Dubai, UAE"
                                        style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuA4TXpQ_w5zchUC4uhnPZYEb_A2sKtCNhEiJ6mTsHGwoPleSBLOyYUyGvgL8iow4_IBW1b6nRMwi78CRxduHWa_yjfEywSeyKOHAdG1iRu4rSFYFmNCueeGQgtMIGj4SNgE_aDkrGmv2ggIW_2guTeEgwpHbi5hWpNTmsm7YikXlVrTpzD9XvmjQNorKuHDr_0fBX75iPX4wUfATiHsOiKjKylB9balP1_Bn4h9zDoxx7Tg4dxwTyqeaUB10BhhgOnVKcAYra_dejQ")` }}>
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <span className="bg-[#137fec] text-white px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">Ongoing Ride</span>
                                                    <span className="text-[#137fec] text-sm font-bold">In Progress</span>
                                                </div>
                                                <div className="space-y-3">
                                                    <div className="flex items-start gap-3">
                                                        <span className="material-symbols-outlined text-[#137fec] text-lg">radio_button_checked</span>
                                                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                                            Palm Jumeirah, Shoreline Apts
                                                        </p>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <span className="material-symbols-outlined text-slate-400 text-lg">location_on</span>
                                                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                                            Dubai Media City, Building 5
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Est. Fare </p>
                                                <p className="text-2xl font-black text-[#137fec]">$18.20</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#137fec]/10">
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-1.5 text-[#137fec] text-xs font-bold">
                                                    <span className="material-symbols-outlined text-sm animate-pulse">navigation</span>
                                                    8 mins remaining
                                                </div>
                                            </div>
                                            <button className="bg-[#137fec] text-white px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-[#137fec]/90 transition-all">
                                                Open Navigation
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {/* Ride Card 4 (Completed) */}
                                <div className="bg-white dark:bg-slate-900 rounded-xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 hover:border-[#137fec]/40 transition-all flex flex-col lg:flex-row gap-6">
                                    <div className="w-full lg:w-48 h-32 lg:h-auto bg-center bg-no-repeat bg-cover rounded-lg overflow-hidden shrink-0 border border-slate-100 dark:border-slate-800"
                                        data-alt="Map showing city route from hotel to park" data-location="Dubai, UAE"
                                        style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuA4TXpQ_w5zchUC4uhnPZYEb_A2sKtCNhEiJ6mTsHGwoPleSBLOyYUyGvgL8iow4_IBW1b6nRMwi78CRxduHWa_yjfEywSeyKOHAdG1iRu4rSFYFmNCueeGQgtMIGj4SNgE_aDkrGmv2ggIW_2guTeEgwpHbi5hWpNTmsm7YikXlVrTpzD9XvmjQNorKuHDr_0fBX75iPX4wUfATiHsOiKjKylB9balP1_Bn4h9zDoxx7Tg4dxwTyqeaUB10BhhgOnVKcAYra_dejQ")` }}>
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">Completed</span>
                                                    <span className="text-slate-400 text-sm font-medium">Oct 23, 2023 • 08:45 PM</span>
                                                </div>
                                                <div className="space-y-3">
                                                    <div className="flex items-start gap-3">
                                                        <span className="material-symbols-outlined text-[#137fec] text-lg">radio_button_checked</span>
                                                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                                            Burj Al Arab Hotel Entrance
                                                        </p>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <span className="material-symbols-outlined text-slate-400 text-lg">location_on</span>
                                                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                                            Zabeel Park, Gate 4
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Total
                                                    Earned</p>
                                                <p className="text-2xl font-black text-slate-900 dark:text-white">$42.10</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50 dark:border-slate-800">
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                                                    <span className="material-symbols-outlined text-sm">schedule</span>
                                                    38 mins
                                                </div>
                                                <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                                                    <span className="material-symbols-outlined text-sm">distance</span>
                                                    22.1 km
                                                </div>
                                            </div>
                                            <button className="text-[#137fec] text-sm font-bold hover:underline flex items-center gap-1">
                                                View Details
                                                <span className="material-symbols-outlined text-sm">chevron_right</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Pagination/Load More */}
                            <div className="mt-12 flex flex-col items-center gap-4">
                                <p className="text-slate-400 text-sm font-medium">Showing 4 of 128 trips</p>
                                <button className="px-8 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 text-sm font-bold shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                                    Load More History
                                </button>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    )
}

export default Page