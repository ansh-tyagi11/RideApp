"use client";
import React, { useState } from 'react';

const Page = () => {
    const [isActive, setIsActive] = useState(false);

    const handleExpand = () => {
        setIsActive(!isActive)
    }

    return (
        <>
            <div className="bg-[#f6f7f8] pt-20 dark:bg-[#101922] font-display text-[#0d141b] dark:text-slate-100 min-h-screen">
                <div className="flex overflow-hidden">

                    {/* Main Content */}
                    <main className="flex-1 flex flex-col overflow-y-auto">
                        <div className="p-8 max-w-5xl mx-auto w-full space-y-6">
                            {/* Top Header */}
                            <header className="rounded-xl border border-slate-200 bg-white dark:bg-[#1a2632] rounded-x dark:border-slate-800 p-8 shadow-sm overflow-hidden px-8 py-4 flex items-center justify-between">
                                <h1 className="text-xl font-bold">Earnings Dashboard</h1>
                                {/* Segmented Buttons Filter */}
                                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                                    <label className="cursor-pointer group">
                                        <input
                                            className="hidden peer"
                                            name="filter"
                                            type="radio"
                                            value="today"
                                            defaultChecked
                                        />
                                        <span className="px-4 py-1.5 text-xs font-semibold rounded-lg block transition-all text-slate-500 peer-checked:bg-white peer-checked:text-[#137fec] peer-checked:shadow-sm dark:peer-checked:bg-slate-700 dark:peer-checked:text-white">
                                            Today
                                        </span>
                                    </label>
                                    <label className="cursor-pointer group">
                                        <input
                                            className="hidden peer"
                                            name="filter"
                                            type="radio"
                                            value="week"
                                            defaultChecked
                                        />
                                        <span className="px-4 py-1.5 text-xs font-semibold rounded-lg block transition-all text-slate-500 peer-checked:bg-white peer-checked:text-[#137fec] peer-checked:shadow-sm dark:peer-checked:bg-slate-700 dark:peer-checked:text-white">This Week</span>
                                    </label>
                                    <label className="cursor-pointer group">
                                        <input
                                            className="hidden peer"
                                            name="filter"
                                            type="radio"
                                            value="month"
                                            defaultChecked
                                        />
                                        <span className="px-4 py-1.5 text-xs font-semibold rounded-lg block transition-all text-slate-500 peer-checked:bg-white peer-checked:text-[#137fec] peer-checked:shadow-sm dark:peer-checked:bg-slate-700 dark:peer-checked:text-white">Month</span>
                                    </label>
                                </div>
                            </header>
                            {/* Hero Section: Total Balance */}
                            <section className="bg-white dark:bg-[#1a2632] rounded-xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm overflow-hidden relative">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                                    <div>
                                        <p className="text-[#4c739a] font-medium text-sm mb-1 uppercase tracking-wider">This Week's Earnings</p>
                                        <h2 className="text-5xl font-extrabold text-[#0d141b] dark:text-white tracking-tight">$1,245.50 </h2>
                                        <p className="text-[#4c739a] mt-2 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-green-500 text-lg">check_circle</span>
                                            42 Trips Completed
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-center md:items-end gap-3">
                                        <button className="bg-[#137fec] hover:bg-[#137fec]/90 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-[#137fec]/20 transition-all active:scale-[0.98]">
                                            Cash Out
                                        </button>
                                        <p className="text-xs text-[#4c739a]">Standard processing applies</p>
                                    </div>
                                </div>
                                {/* Background Accent */}
                                <div className="absolute top-0 right-0 w-64 h-full bg-linear-to-l from-[#137fec]/5 to-transparent pointer-events-none">
                                </div>
                            </section>
                            {/* Trip History Section */}
                            <section className="space-y-4 pb-12">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-bold text-lg">Recent Trips</h3>
                                    <button className="text-sm font-semibold text-[#137fec] hover:underline">View All History</button>
                                </div>
                                {/* Trip Row 1 (Expanded Example) */}
                                <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                                    <div onClick={handleExpand} className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-lg text-slate-500">
                                                <span className="material-symbols-outlined">schedule</span>
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm">3:45 PM Today</p>
                                                <p className="text-xs text-[#4c739a]">12 min • 5.4 miles</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="text-right">
                                                <p className="font-bold text-base">$14.20</p>
                                                <p className="text-[10px] text-green-600 font-bold uppercase tracking-tight">Completed
                                                </p>
                                            </div>
                                            <span className={`material-symbols-outlined text-slate-400 transition-transform ${isActive ? "rotate-180" : "rotate-0"}`}>expand_more</span>
                                        </div>
                                    </div>
                                    {/* Breakdown Panel */}
                                    <div className={`px-16 bg-slate-50/50 dark:bg-slate-800/20 border-t border-slate-100 dark:border-slate-800 overflow-hidden transition-all duration-300 ease-in-out ${isActive ? "max-h-96 py-6 opacity-100" : "max-h-0 py-0 opacity-0"}`}>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-[#4c739a]">Base Fare</span>
                                                <span className="font-medium">$3.00</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-[#4c739a]">Distance (5.4 mi)</span>
                                                <span className="font-medium">$8.50</span>
                                            </div>
                                            <div className="flex justify-between text-orange-600">
                                                <span className="font-medium">Surge Pricing (1.4x)</span>
                                                <span className="font-bold">+$4.00</span>
                                            </div>
                                            <div className="flex justify-between text-slate-400">
                                                <span>Service Fee</span>
                                                <span>-$1.30</span>
                                            </div>
                                            <div className="pt-2 mt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between font-bold text-[#0d141b] dark:text-white">
                                                <span>Net Earnings</span>
                                                <span>$14.20</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Trip Row 2 */}
                                <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                                    <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-lg text-slate-500">
                                                <span className="material-symbols-outlined">schedule</span>
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm">1:20 PM Today</p>
                                                <p className="text-xs text-[#4c739a]">28 min • 14.2 miles</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="text-right">
                                                <p className="font-bold text-base">$28.45</p>
                                                <p className="text-[10px] text-green-600 font-bold uppercase tracking-tight">Completed
                                                </p>
                                            </div>
                                            <span className="material-symbols-outlined text-slate-400">expand_more</span>
                                        </div>
                                    </div>
                                </div>
                                {/* Trip Row 3 */}
                                <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                                    <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-lg text-slate-500">
                                                <span className="material-symbols-outlined">schedule</span>
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm">11:05 AM Today</p>
                                                <p className="text-xs text-[#4c739a]">8 min • 2.1 miles</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="text-right">
                                                <p className="font-bold text-base">$7.80</p>
                                                <p className="text-[10px] text-green-600 font-bold uppercase tracking-tight">Completed
                                                </p>
                                            </div>
                                            <span className="material-symbols-outlined text-slate-400">expand_more</span>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </main>
                </div>
            </div>
        </>
    )
}

export default Page