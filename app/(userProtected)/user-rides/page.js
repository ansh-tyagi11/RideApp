import React from 'react'

const page = () => {
    return (
        <>
            <div className="bg-[#f6f7f8] dark:bg-[#101622] text-[#111318] dark:text-white font-display min-h-screen flex flex-col">
                {/* Main Content */}
                <main className="flex-1 w-full max-w-4xl mx-auto px-8 py-28 md:px-6 md:py-30">
                    {/* Page Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[#111318] dark:text-white mb-2">My Rides
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400">View and manage your travel history</p>
                        </div>
                        <button className="bg-[#135bec] hover:bg-[#135bec]/90 text-white h-12 px-8 rounded-full font-bold text-sm transition-all shadow-lg shadow-[#135bec]/20 hover:shadow-[#135bec]/30 flex items-center gap-2 group">
                            <span className="material-symbols-outlined group-hover:animate-pulse">add</span>
                            Book a Ride
                        </button>
                    </div>
                    {/* Filters */}
                    <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                        <button className="h-10 px-6 rounded-full bg-[#111318] text-white font-medium text-sm flex items-center justify-center whitespace-nowrap shadow-md transition-transform active:scale-95">
                            All
                        </button>
                        <button className="h-10 px-6 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-medium text-sm flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 whitespace-nowrap transition-colors">
                            Completed
                        </button>
                        <button className="h-10 px-6 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-medium text-sm flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 whitespace-nowrap transition-colors">
                            Scheduled
                        </button>
                        <button className="h-10 px-6 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-medium text-sm flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 whitespace-nowrap transition-colors">
                            Canceled
                        </button>
                    </div>
                    {/* Rides List */}
                    <div className="space-y-6">
                        {/* Card: Ongoing Ride */}
                        <div className="group bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700 transition-all duration-300 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-[#135bec]"></div> {/* Status Indicator Line */}
                            <div className="flex flex-col md:flex-row gap-6">
                                {/* Ride Details */}
                                <div className="flex-1 flex flex-col justify-between">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-[#135bec] dark:text-blue-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                                                <span className="relative flex h-2 w-2">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                                </span>
                                                Ongoing
                                            </div>
                                            <span className="text-sm text-gray-400 font-medium">Standard • Toyota Camry</span>
                                        </div>
                                        <p className="text-lg font-bold text-[#111318] dark:text-white">$18.50</p>
                                    </div>
                                    <div className="relative pl-4 border-l-2 border-dashed border-gray-200 dark:border-gray-600 ml-2 space-y-6">
                                        <div className="relative">
                                            <div className="absolute -left-5.75 top-1 size-3 rounded-full bg-white dark:bg-gray-800 border-[3px] border-[#111318] dark:border-gray-200">
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Pick up • 4:32 PM</p>
                                            <p className="text-sm font-semibold text-[#111318] dark:text-white">88 Broadway, New York
                                            </p>
                                        </div>
                                        <div className="relative">
                                            <div className="absolute -left-5.75 top-1 size-3 bg-white dark:bg-gray-800 border-[3px] border-[#135bec]">
                                            </div> {/* Square for destination */}
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Drop off • Est. 4:55 PM</p>
                                            <p className="text-sm font-semibold text-[#111318] dark:text-white">101 Park Ave, New York
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-6 flex gap-3">
                                        <button className="flex-1 bg-[#135bec] text-white h-10 px-4 rounded-full text-sm font-bold shadow-lg shadow-[#135bec]/20 hover:bg-blue-700 transition-colors">Track
                                            Ride
                                        </button>
                                        <button className="size-10 rounded-full border border-gray-200 dark:border-gray-600 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-500 transition-colors"
                                            title="Contact Driver">
                                            <span className="material-symbols-outlined text-xl">chat</span>
                                        </button>
                                        <button className="size-10 rounded-full border border-gray-200 dark:border-gray-600 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-500 transition-colors"
                                            title="Emergency">
                                            <span className="material-symbols-outlined text-xl">security</span>
                                        </button>
                                    </div>
                                </div>
                                {/* Map Preview */}
                                <div className="w-full md:w-64 h-40 md:h-auto bg-gray-100 dark:bg-gray-900 rounded-xl overflow-hidden relative">
                                    <div className="absolute inset-0 bg-cover bg-center opacity-80"
                                        data-alt="Map showing a route through city streets"
                                        style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBVnqV0CaYO3RpmurvxaelsGqLF3YpLoROGqYrnSzP-oEnPvRudALEDv6OeIAyD0vTgaI5zejX7xoJa-5gVUXHu3eVMwG2vmOkq5QFXNeZxO-5c5Lwu93XTazZD1z-LOssaUtonxT0N4Um4sRpNcLKFDqBLj7eScJgH0JgvAzIsFQUUQ2aV5C-u0ADp_WoOKgSLGkyLo3qG4OSo9j2Px-v9WKQk0HeI_rDkRTilc7iTg4ZfIvb0lznQXojrFgCDgrvTO0FK24rQtO2n')" }}>
                                    </div>
                                    <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent"></div>
                                </div>
                            </div>
                        </div>
                        {/* Card: Completed Ride */}
                        <div className="group bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700 transition-all duration-300">
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex-1 flex flex-col justify-between">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                                                Completed
                                            </div>
                                            <span className="text-sm text-gray-400 font-medium">Premium • Tesla Model 3</span>
                                        </div>
                                        <p className="text-lg font-bold text-[#111318] dark:text-white">$24.50</p>
                                    </div>
                                    <div className="relative pl-4 border-l-2 border-gray-100 dark:border-gray-700 ml-2 space-y-6">
                                        <div className="relative">
                                            <div className="absolute -left-5.75 top-1 size-3 rounded-full bg-gray-300 dark:bg-gray-600">
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Oct 24 • 2:30 PM</p>
                                            <p className="text-sm font-semibold text-[#111318] dark:text-white">123 Main St, San
                                                Francisco</p>
                                        </div>
                                        <div className="relative">
                                            <div className="absolute -left-5.75 top-1 size-3 rounded-full bg-gray-300 dark:bg-gray-600">
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Oct 24 • 2:55 PM</p>
                                            <p className="text-sm font-semibold text-[#111318] dark:text-white">456 Corporate Blvd, San
                                                Francisco</p>
                                        </div>
                                    </div>
                                    <div className="mt-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        <button className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-[#111318] dark:text-white h-9 px-4 rounded-full text-sm font-bold transition-colors">Rebook</button>
                                        <button className="text-gray-500 dark:text-gray-400 h-9 px-4 rounded-full text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">Get
                                            Receipt</button>
                                    </div>
                                </div>
                                {/* Map Preview (Smaller for history) */}
                                <div className="hidden md:block w-32 h-32 bg-gray-100 dark:bg-gray-900 rounded-xl overflow-hidden relative self-center shrink-0">
                                    <div className="absolute inset-0 bg-cover bg-center grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                                        data-alt="Map thumbnail of San Francisco route"
                                        style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDymRQVKe0fOAYwgWLYjH7qmBc2o334j3bPRZ6_wgxP4KVNWdsvR3eiO3hzAN6_UEOJ7dYI0aXH13TRGiO29A3p2wVebScT0L1jgnlURFGDxnzazMjtGISW65dlOE4tbph5qUvZ9igvP0FaZIAOjAc3s7vb2wkNdU1HwuzYbSg4LUlOHFa7tm2YjBXmMzOi1FQXxWeCAOY6n46S3Nph9LqHLFwGBsqvDMsXw3-eOOz7vKFZSILx7cAQE3uRMX9cR9fkuFa8Oo3JVMa3')" }}>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Card: Canceled Ride */}
                        <div className="group bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700 transition-all duration-300">
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex-1 flex flex-col justify-between">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-[16px]">cancel</span>
                                                Canceled
                                            </div>
                                            <span className="text-sm text-gray-400 font-medium">Standard • Honda Civic</span>
                                        </div>
                                        <p className="text-lg font-bold text-gray-400 line-through">$12.00</p>
                                    </div>
                                    <div className="relative pl-4 border-l-2 border-gray-100 dark:border-gray-700 ml-2 space-y-6">
                                        <div className="relative">
                                            <div className="absolute -left-5.75 top-1 size-3 rounded-full bg-gray-300 dark:bg-gray-600">
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Oct 22 • 9:00 AM</p>
                                            <p className="text-sm font-semibold text-[#111318] dark:text-white">789 Airport Rd, Boston
                                            </p>
                                        </div>
                                        <div className="relative">
                                            <div className="absolute -left-5.75 top-1 size-3 rounded-full bg-gray-300 dark:bg-gray-600">
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">--:--</p>
                                            <p className="text-sm font-semibold text-[#111318] dark:text-white">Hotel Luxe, Boston</p>
                                        </div>
                                    </div>
                                    <div className="mt-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        <button className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-[#111318] dark:text-white h-9 px-4 rounded-full text-sm font-bold transition-colors">Help</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Card: Scheduled Ride */}
                        <div className="group bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700 transition-all duration-300">
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex-1 flex flex-col justify-between">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-[16px]">calendar_month</span>
                                                Scheduled
                                            </div>
                                            <span className="text-sm text-gray-400 font-medium">XL • Chevrolet Suburban</span>
                                        </div>
                                        <p className="text-lg font-bold text-[#111318] dark:text-white">Est. $45.00</p>
                                    </div>
                                    <div className="relative pl-4 border-l-2 border-gray-100 dark:border-gray-700 ml-2 space-y-6">
                                        <div className="relative">
                                            <div className="absolute -left-5.75 top-1 size-3 rounded-full bg-gray-300 dark:bg-gray-600">
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Nov 15 • 5:00 AM</p>
                                            <p className="text-sm font-semibold text-[#111318] dark:text-white">Home</p>
                                        </div>
                                        <div className="relative">
                                            <div className="absolute -left-5.75 top-1 size-3 rounded-full bg-gray-300 dark:bg-gray-600">
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Nov 15 • 5:45 AM</p>
                                            <p className="text-sm font-semibold text-[#111318] dark:text-white">JFK Terminal 4</p>
                                        </div>
                                    </div>
                                    <div className="mt-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        <button className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-[#111318] dark:text-white h-9 px-4 rounded-full text-sm font-bold transition-colors">Edit</button>
                                        <button className="text-rose-600 dark:text-rose-400 h-9 px-4 rounded-full text-sm font-medium hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors">Cancel</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Show More Button */}
                        <div className="flex justify-center pt-8 pb-12">
                            <button className="text-gray-500 hover:text-[#111318] dark:text-gray-400 dark:hover:text-white text-sm font-medium flex items-center gap-2 transition-colors">
                                Show older rides
                                <span className="material-symbols-outlined">expand_more</span>
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}

export default page