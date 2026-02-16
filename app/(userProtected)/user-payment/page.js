"use client";
import React, { useState, useEffect } from 'react';

const page = () => {
    const [input, setInput] = useState('');
    const [debounced, setDebounced] = useState('');


    useEffect(() => {
        const timer = setTimeout(() => {
            setDebounced(input)
        }, 500)

        return () => clearTimeout(timer)
    }, [input])

    const rides = [
        {
            destination: "Connaught Place, Delhi",
            date: "2026-02-01",
        },
        {
            destination: "Bandra West, Mumbai",
            date: "2026-01-29",
        },
        {
            destination: "Electronic City, Bengaluru",
            date: "2026-02-02",
        }
    ];

    const match = rides.filter(ride =>
        ride.destination.toLowerCase().includes(input.toLowerCase()) ||
        ride.date.includes(input)
    )


    return (
        <>
            <div className="bg-[#f6f6f8] pt-20 dark:bg-[#101622] text-[#111318] dark:text-white overflow-hidden h-screen flex flex-col md:flex-row">
                {/* Main Content Wrapper */}
                <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#f6f6f8] dark:bg-[#101622] relative">
                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-4 px-8 md:p-8">
                        <div className="max-w-250 mx-auto flex flex-col gap-8 pb-10">
                        {/* Top Header Area */}
                        <header className="hidden md:flex items-center justify-between py-5 bg-[#f6f6f8] dark:bg-[#101622] border-b border-transparent shrink-0">
                            <div>
                                <h2 className="text-[#111318] dark:text-white text-2xl font-bold leading-tight">Payment History</h2>
                            </div>
                            <div className="flex items-center gap-4">
                                <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1a202c] border border-[#dbdfe6] dark:border-gray-700 rounded-lg text-sm font-medium text-[#111318] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm">
                                    <span className="material-symbols-outlined text-[20px]">cloud_download</span>
                                    Download Statement
                                </button>
                                <button className="relative p-2 rounded-full bg-white dark:bg-[#1a202c] text-[#111318] dark:text-white border border-[#dbdfe6] dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm">
                                    <span className="material-symbols-outlined">notifications</span>
                                    <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border border-white dark:border-[#1a202c]"></span>
                                </button>
                            </div>
                        </header>
                            {/* Page Heading & Context (Mobile Only) */}
                            <div className="md:hidden">
                                <p className="text-[#111318] dark:text-white text-2xl font-black leading-tight mb-2">
                                    Payment History
                                </p>
                                <p className="text-[#616f89] dark:text-gray-400 text-sm">
                                    View your past transactions and trip details.
                                </p>
                            </div>
                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="flex flex-col gap-3 rounded-xl p-5 bg-[#ffffff] dark:bg-[#1a202c] border border-[#dbdfe6] dark:border-gray-700/50 shadow-sm">
                                    <div className="flex items-center justify-between">
                                        <p className="text-[#616f89] dark:text-gray-400 text-sm font-medium uppercase tracking-wider">
                                            Total Spent</p>
                                        <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded text-green-700 dark:text-green-400">
                                            <span className="material-symbols-outlined text-sm">trending_up</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[#111318] dark:text-white text-3xl font-bold tracking-tight mb-1">$452.00</p>
                                        <p className="text-green-600 dark:text-green-400 text-xs font-medium flex items-center gap-1">
                                            <span>+12%</span>
                                            <span className="text-[#616f89] dark:text-gray-400 font-normal">from last month</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3 rounded-xl p-5 bg-[#ffffff] dark:bg-[#1a202c] border border-[#dbdfe6] dark:border-gray-700/50 shadow-sm">
                                    <div className="flex items-center justify-between">
                                        <p className="text-[#616f89] dark:text-gray-400 text-sm font-medium uppercase tracking-wider">
                                            Rides Taken</p>
                                        <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded text-blue-700 dark:text-blue-400">
                                            <span className="material-symbols-outlined text-sm">directions_car</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[#111318] dark:text-white text-3xl font-bold tracking-tight mb-1">24</p>
                                        <p className="text-green-600 dark:text-green-400 text-xs font-medium flex items-center gap-1">
                                            <span>+4%</span>
                                            <span className="text-[#616f89] dark:text-gray-400 font-normal">from last month</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3 rounded-xl p-5 bg-[#ffffff] dark:bg-[#1a202c] border border-[#dbdfe6] dark:border-gray-700/50 shadow-sm">
                                    <div className="flex items-center justify-between">
                                        <p className="text-[#616f89] dark:text-gray-400 text-sm font-medium uppercase tracking-wider">
                                            Canceled Rides</p>
                                        <div className="p-1.5 bg-red-100 dark:bg-red-900/30 rounded text-red-700 dark:text-red-400">
                                            <span className="material-symbols-outlined text-sm">cancel</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[#111318] dark:text-white text-3xl font-bold tracking-tight mb-1">2</p>
                                        <p className="text-red-600 dark:text-red-400 text-xs font-medium flex items-center gap-1">
                                            <span>-10%</span>
                                            <span className="text-[#616f89] dark:text-gray-400 font-normal">improvement</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            {/* Filters & Search */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-hide">
                                    <button className="flex h-9 items-center justify-center rounded-lg bg-[#111318] dark:bg-white text-white dark:text-[#111318] px-4 text-sm font-semibold shadow-sm transition-transform active:scale-95 whitespace-nowrap">
                                        All Payments
                                    </button>
                                    <button className="flex h-9 items-center justify-center rounded-lg bg-white dark:bg-[#1a202c] border border-[#dbdfe6] dark:border-gray-700 text-[#616f89] dark:text-gray-300 px-4 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors whitespace-nowrap">
                                        Completed
                                    </button>
                                    <button className="flex h-9 items-center justify-center rounded-lg bg-white dark:bg-[#1a202c] border border-[#dbdfe6] dark:border-gray-700 text-[#616f89] dark:text-gray-300 px-4 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors whitespace-nowrap">
                                        Canceled
                                    </button>
                                    <button className="flex h-9 items-center justify-center rounded-lg bg-white dark:bg-[#1a202c] border border-[#dbdfe6] dark:border-gray-700 text-[#616f89] dark:text-gray-300 px-4 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors whitespace-nowrap">
                                        Pending
                                    </button>
                                </div>
                                <div className="relative w-full sm:w-auto">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined text-[20px]">search</span>
                                    <input
                                        className="pl-10 pr-4 py-2 w-full sm:w-64 h-9 rounded-lg bg-white dark:bg-[#1a202c] border border-[#dbdfe6] dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#135bec]/50 text-[#111318] dark:text-white placeholder:text-gray-400"
                                        placeholder="Search by date or location"
                                        type="search"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                    />
                                    {debounced.trim() && (
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
                                </div>
                            </div>
                            {/* Transaction List */}
                            <div className="flex flex-col gap-4">
                                <h3 className="text-xs font-bold text-[#616f89] dark:text-gray-500 uppercase tracking-wider mb-1 px-1">
                                    October 2023</h3>
                                {/* Card 1: Completed */}
                                <div className="group flex flex-col md:flex-row items-start md:items-center justify-between p-5 bg-[#ffffff] dark:bg-[#1a202c] rounded-xl border border-[#f0f2f4] dark:border-gray-700/50 shadow-sm hover:shadow-md hover:border-[#135bec]/20 dark:hover:border-[#135bec]/40 transition-all duration-200">
                                    <div className="flex items-start gap-4 w-full md:w-auto">
                                        <div className="size-12 rounded-full bg-[#f0f2f4] dark:bg-gray-800 flex items-center justify-center text-[#111318] dark:text-white shrink-0 group-hover:bg-[#135bec]/10 group-hover:text-[#135bec] transition-colors">
                                            <span className="material-symbols-outlined">local_taxi</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="text-base font-bold text-[#111318] dark:text-white">UberX</h4>
                                                <span className="text-xs text-[#616f89] dark:text-gray-400">• Oct 24, 2:30 PM</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-[#616f89] dark:text-gray-400">
                                                <span className="material-symbols-outlined text-[16px] text-gray-400">trip_origin</span>
                                                <span className="truncate max-w-30 md:max-w-50">Downtown Core</span>
                                                <span className="material-symbols-outlined text-[16px] text-gray-400">arrow_right_alt</span>
                                                <span className="truncate max-w-30 md:max-w-50">Intl. Airport T1</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto mt-4 md:mt-0 gap-4 md:gap-1 pl-16 md:pl-0">
                                        <div className="text-right flex flex-col items-end">
                                            <p className="text-lg font-bold text-[#135bec] dark:text-blue-400">$45.00</p>
                                            <div className="flex items-center gap-1 mt-1">
                                                <span className="size-2 rounded-full bg-green-500"></span>
                                                <span className="text-xs font-medium text-green-700 dark:text-green-400">Paid</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-3 md:hidden group-hover:flex">
                                            <button className="text-xs font-medium text-[#616f89] dark:text-gray-400 hover:text-[#135bec] dark:hover:text-white transition-colors">Receipt</button>
                                            <button className="text-xs font-medium text-[#616f89] dark:text-gray-400 hover:text-[#135bec] dark:hover:text-white transition-colors">Help</button>
                                        </div>
                                    </div>
                                </div>
                                {/* Card 2: Canceled */}
                                <div className="group flex flex-col md:flex-row items-start md:items-center justify-between p-5 bg-[#ffffff] dark:bg-[#1a202c] rounded-xl border border-[#f0f2f4] dark:border-gray-700/50 shadow-sm hover:shadow-md hover:border-red-200 dark:hover:border-red-900/40 transition-all duration-200">
                                    <div className="flex items-start gap-4 w-full md:w-auto">
                                        <div className="size-12 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-600 dark:text-red-400 shrink-0">
                                            <span className="material-symbols-outlined">no_crash</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="text-base font-bold text-[#111318] dark:text-white">Premium Black</h4>
                                                <span className="text-xs text-[#616f89] dark:text-gray-400">• Oct 22, 9:00 AM</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-[#616f89] dark:text-gray-400">
                                                <span className="material-symbols-outlined text-[16px] text-gray-400">trip_origin</span>
                                                <span className="truncate max-w-30 md:max-w-50">42 Wallaby Way</span>
                                                <span
                                                    className="material-symbols-outlined text-[16px] text-gray-400">arrow_right_alt</span>
                                                <span className="truncate max-w-30 md:max-w-50">Central Station</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto mt-4 md:mt-0 gap-4 md:gap-1 pl-16 md:pl-0">
                                        <div className="text-right flex flex-col items-end">
                                            <p className="text-lg font-bold text-[#111318] dark:text-gray-200">$5.00</p>
                                            <div className="flex items-center gap-1 mt-1 bg-red-100 dark:bg-red-900/30 px-2 py-0.5 rounded-full">
                                                <span className="text-xs font-bold text-red-700 dark:text-red-400">Canceled</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-3 md:hidden group-hover:flex">
                                            <button
                                                className="text-xs font-medium text-[#616f89] dark:text-gray-400 hover:text-red-600 transition-colors">Dispute</button>
                                        </div>
                                    </div>
                                </div>
                                {/* Card 3: Pending */}
                                <div className="group flex flex-col md:flex-row items-start md:items-center justify-between p-5 bg-[#ffffff] dark:bg-[#1a202c] rounded-xl border border-yellow-200 dark:border-yellow-900/30 shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden">
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400"></div>
                                    <div className="flex items-start gap-4 w-full md:w-auto">
                                        <div className="size-12 rounded-full bg-yellow-50 dark:bg-yellow-900/20 flex items-center justify-center text-yellow-600 dark:text-yellow-400 shrink-0">
                                            <span className="material-symbols-outlined">schedule</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="text-base font-bold text-[#111318] dark:text-white">Standard Ride</h4>
                                                <span className="text-xs text-[#616f89] dark:text-gray-400">• Oct 21, 6:15 PM</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-[#616f89] dark:text-gray-400">
                                                <span className="material-symbols-outlined text-[16px] text-gray-400">trip_origin</span>
                                                <span className="truncate max-w-30 md:max-w-50">Tech Park</span>
                                                <span
                                                    className="material-symbols-outlined text-[16px] text-gray-400">arrow_right_alt</span>
                                                <span className="truncate max-w-30 md:max-w-50">Shopping Mall</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto mt-4 md:mt-0 gap-4 md:gap-1 pl-16 md:pl-0">
                                        <div className="text-right flex flex-col items-end">
                                            <p className="text-lg font-bold text-[#111318] dark:text-gray-200">~$12.50</p>
                                            <div className="flex items-center gap-1 mt-1">
                                                <span className="size-2 rounded-full bg-yellow-400 animate-pulse"></span>
                                                <span className="text-xs font-medium text-yellow-700 dark:text-yellow-400">Processing</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-3 md:hidden group-hover:flex">
                                            <button className="text-xs font-medium text-[#135bec] hover:underline">Track Status</button>
                                        </div>
                                    </div>
                                </div>
                                <h3 className="text-xs font-bold text-[#616f89] dark:text-gray-500 uppercase tracking-wider mt-4 mb-1 px-1">
                                    September 2023</h3>
                                {/* Card 4: Older Completed */}
                                <div className="group flex flex-col md:flex-row items-start md:items-center justify-between p-5 bg-[#ffffff] dark:bg-[#1a202c] rounded-xl border border-[#f0f2f4] dark:border-gray-700/50 shadow-sm hover:shadow-md hover:border-[#135bec]/20 dark:hover:border-[#135bec]/40 transition-all duration-200">
                                    <div className="flex items-start gap-4 w-full md:w-auto">
                                        <div className="size-12 rounded-full bg-[#f0f2f4] dark:bg-gray-800 flex items-center justify-center text-[#111318] dark:text-white shrink-0 group-hover:bg-[#135bec]/10 group-hover:text-[#135bec] transition-colors">
                                            <span className="material-symbols-outlined">airport_shuttle</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="text-base font-bold text-[#111318] dark:text-white">Airport Shuttle</h4>
                                                <span className="text-xs text-[#616f89] dark:text-gray-400">• Sept 28, 5:00 AM</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-[#616f89] dark:text-gray-400">
                                                <span className="material-symbols-outlined text-[16px] text-gray-400">trip_origin</span>
                                                <span className="truncate max-w-30 md:max-w-50">Home</span>
                                                <span
                                                    className="material-symbols-outlined text-[16px] text-gray-400">arrow_right_alt</span>
                                                <span className="truncate max-w-30 md:max-w-50">Intl. Airport T3</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto mt-4 md:mt-0 gap-4 md:gap-1 pl-16 md:pl-0">
                                        <div className="text-right flex flex-col items-end">
                                            <p className="text-lg font-bold text-[#135bec] dark:text-blue-400">$28.00</p>
                                            <div className="flex items-center gap-1 mt-1">
                                                <span className="size-2 rounded-full bg-green-500"></span>
                                                <span className="text-xs font-medium text-green-700 dark:text-green-400">Paid</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-3 md:hidden group-hover:flex">
                                            <button className="text-xs font-medium text-[#616f89] dark:text-gray-400 hover:text-[#135bec] dark:hover:text-white transition-colors">Receipt</button>
                                            <button className="text-xs font-medium text-[#616f89] dark:text-gray-400 hover:text-[#135bec] dark:hover:text-white transition-colors">Rebook</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Footer / Load More */}
                            <div className="flex justify-center pt-4">
                                <button className="flex items-center gap-2 text-sm font-semibold text-[#616f89] dark:text-gray-400 hover:text-[#135bec] dark:hover:text-white transition-colors">
                                    Load more transactions
                                    <span className="material-symbols-outlined text-[18px]">expand_more</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}

export default page
