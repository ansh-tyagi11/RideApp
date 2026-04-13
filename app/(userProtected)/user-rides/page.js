"use client"
import React, { useState, useRef, useEffect } from 'react';
import { forAllRiderRides } from '@/actions/useractions';
import useUser from '@/hooks/useUser';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const page = () => {
    const { user } = useUser();
    const router = useRouter();
    const [filter, setFilter] = useState("all");
    const [input, setInput] = useState('');
    const [debouncedInput, setDebouncedInput] = useState("");
    const [highlighted, setHighlighted] = useState(null);
    const loadMoreRef = useRef(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedInput(input)
        }, 500)

        return () => clearTimeout(timer)
    }, [input])

    const fetchRides = async ({ pageParam = 1 }) => {
        let res = await forAllRiderRides(user?.email, filter, pageParam);
        return res;
    }

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isError,
        isLoading
    } = useInfiniteQuery({
        queryKey: ["user-rides", user?.email, filter],
        queryFn: fetchRides,
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage?.nextPage ?? undefined,
        enabled: !!user?.email
    });

    const rides = data?.pages?.flatMap((page) => page.rides) ?? [];

    useEffect(() => {
        const el = loadMoreRef.current;
        if (!el) return;

        const observer = new IntersectionObserver((entries) => {
            const first = entries[0];
            if (first.isIntersecting && hasNextPage && !isFetchingNextPage) {
                fetchNextPage()
            }
        }, { threshold: 0.1 })

        observer.observe(el)

        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage])

    const match = rides.filter((r) => {
        const search = debouncedInput.toLowerCase();

        const formattedDate = r.createdAt ? new Date(r.createdAt).toLocaleDateString([], {
            day: "2-digit",
            year: "2-digit",
            month: "short"
        }) : "";

        return (
            r._id?.toString().toLowerCase().includes(search) ||
            r.dropLocation?.toLowerCase().includes(search) ||
            formattedDate.includes(search) ||
            r.pickupLocation?.toLowerCase().includes(search) ||
            r.amount?.toString().includes(search)
        )
    })

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <span className="animate-spin material-symbols-outlined text-4xl text-[#137fec]">
                    progress_activity
                </span>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center h-screen gap-3">
                <span className="material-symbols-outlined text-4xl text-red-500">error</span>
                <p className="text-red-500 font-semibold">Something went wrong</p>
            </div>
        );
    }

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
                        <Link href={"/user-home"} className="bg-[#135bec] hover:bg-[#135bec]/90 text-white h-12 px-8 rounded-full font-bold text-sm transition-all shadow-lg shadow-[#135bec]/20 hover:shadow-[#135bec]/30 flex items-center gap-2 group">
                            <span className="material-symbols-outlined group-hover:animate-pulse">add</span>
                            Book a Ride
                        </Link>
                    </div>
                    <header className="flex items-center justify-between dark:border-slate-800 py-8 dark:bg-slate-900/80 backdrop-blur-md pt-0 top-0 z-10">
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
                                {debouncedInput.trim() && (
                                    <ul className="absolute top-full left-0 right-0 mt-1 max-h-64 overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg z-50">
                                        {match.length > 0 ? (
                                            match.map((item, index) => (
                                                <li
                                                    key={index}
                                                    onClick={() => {
                                                        const el = document.getElementById(item._id);
                                                        if (el) {
                                                            setHighlighted(item._id);
                                                            el.scrollIntoView({ behavior: "smooth", block: "center" });
                                                            setTimeout(() => setHighlighted(null), 2000);
                                                        }
                                                    }}
                                                    className="px-4 py-2 hover:bg-[#137fec]/10 dark:hover:bg-[#137fec]/20 cursor-pointer rounded-md"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="text-sm font-semibold">Pickup: {item.pickupLocation}</div>
                                                        <div className="text-sm font-semibold">Drop: {item.dropLocation}</div>
                                                    </div>
                                                    <div className="text-xs text-slate-500 dark:text-slate-400 uppercase">
                                                        {item.status} • {new Date(item.createdAt).toLocaleDateString([], { month: "short", year: "numeric", day: "2-digit" })} • &#8377;{item.amount}
                                                    </div>
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
                    {/* Filters */}
                    <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                        {["all", "completed", "cancelled", "active"].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`${filter === f ? "bg-[#137fec] text-white" : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
                                    } px-5 py-2 rounded-full text-sm font-bold transition-all cursor-pointer border border-slate-200 dark:border-slate-700 capitalize`}
                            >{f === "active" ? "Ongoing" : f.charAt(0).toUpperCase() + f.slice(1)}</button>
                        ))}
                    </div>
                    {/* Rides List */}
                    <div className="space-y-6">
                        {/* Card: Ongoing Ride */}
                        {rides.length > 0 ? (rides.map((ride) => (
                            <div id={ride._id} key={ride._id} className={`group bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700 transition-all duration-300 relative overflow-hidden ${highlighted === ride._id ? "ring-2 ring-[#137fec]" : ""}`}>
                                {ride.status !== "cancelled" && ride.status !== "completed" && <div className="absolute top-0 left-0 w-1 h-full bg-[#135bec]" />}{/* Status Indicator Line */}
                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Ride Details */}
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                {ride.status !== "cancelled" && ride.status !== "completed" && <div className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-[#135bec] dark:text-blue-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                                                    <span className="relative flex h-2 w-2">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                                    </span>
                                                    {ride.status}
                                                </div>
                                                }

                                                {ride.status === "cancelled" && <div className="px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                                                    <span className="material-symbols-outlined text-[16px]">cancel</span>
                                                    Canceled
                                                </div>
                                                }

                                                {ride.status === "completed" && <div className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                                                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                                                    Completed
                                                </div>
                                                }

                                                <span className="text-sm text-gray-400 font-medium">Standard • Toyota Camry</span>
                                            </div>
                                            <p className={`text-lg font-bold dark:text-white ${ride.status === "cancelled" ? "text-gray-400 line-through" : "text-[#111318]"}`}>&#8377;{ride.amount}</p>
                                        </div>
                                        <div className="relative pl-4 border-l-2 border-dashed border-gray-200 dark:border-gray-600 ml-2 space-y-6">
                                            <div className="relative">
                                                <div className="absolute -left-5.75 top-1 size-3 rounded-full bg-white dark:bg-gray-800 border-[3px] border-[#111318] dark:border-gray-200">
                                                </div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Pick up •  {ride.pickupTime ? `${new Date(ride.pickupTime).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit"
                                                })}` : "--:--"}</p>
                                                <p className="text-sm font-semibold text-[#111318] dark:text-white">
                                                    {ride.pickupLocation}
                                                </p>
                                            </div>
                                            <div className="relative">
                                                <div className="absolute -left-5.75 top-1 size-3 bg-white dark:bg-gray-800 border-[3px] border-[#135bec]">
                                                </div> {/* Square for destination */}
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Drop off • {ride.dropTime ? `${new Date(ride.dropTime).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit"
                                                })}` : "--:--"}</p>
                                                <p className="text-sm font-semibold text-[#111318] dark:text-white">
                                                    {ride.dropLocation}
                                                </p>
                                            </div>
                                        </div>
                                        {ride.status !== "cancelled" && ride.status !== "completed" && <div className="mt-6 flex gap-3">
                                            <button onClick={() => router.push(`/user-home/ride?rideId=${ride._id}`)} className="flex-1 bg-[#135bec] text-white h-10 px-4 rounded-full text-sm font-bold shadow-lg shadow-[#135bec]/20 hover:bg-blue-700 transition-colors">Track
                                                Ride
                                            </button>
                                            <button className="size-10 rounded-full border border-gray-200 dark:border-gray-600 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-500 transition-colors"
                                                title="Emergency">
                                                <span className="material-symbols-outlined text-xl">security</span>
                                            </button>
                                        </div>
                                        }
                                    </div>
                                    {/* Map Preview */}
                                    {ride.status !== "cancelled" && <div className="w-full md:w-64 h-40 md:h-auto bg-gray-100 dark:bg-gray-900 rounded-xl overflow-hidden relative">
                                        <div className="absolute inset-0 bg-cover bg-center opacity-80"
                                            data-alt="Map showing a route through city streets"
                                            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBVnqV0CaYO3RpmurvxaelsGqLF3YpLoROGqYrnSzP-oEnPvRudALEDv6OeIAyD0vTgaI5zejX7xoJa-5gVUXHu3eVMwG2vmOkq5QFXNeZxO-5c5Lwu93XTazZD1z-LOssaUtonxT0N4Um4sRpNcLKFDqBLj7eScJgH0JgvAzIsFQUUQ2aV5C-u0ADp_WoOKgSLGkyLo3qG4OSo9j2Px-v9WKQk0HeI_rDkRTilc7iTg4ZfIvb0lznQXojrFgCDgrvTO0FK24rQtO2n')" }}>
                                        </div>
                                        <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent"></div>
                                    </div>}

                                </div>
                            </div>))
                        ) : (
                            <div className="px-4 py-2 text-slate-400 dark:text-slate-500 text-sm">No rides found</div>
                        )}
                    </div>

                    <div ref={loadMoreRef} className="mt-8 flex flex-col items-center gap-3 py-6">
                        {isFetchingNextPage && (
                            <div className="flex items-center justify-center">
                                <span className="animate-spin material-symbols-outlined text-4xl text-[#137fec]">
                                    progress_activity
                                </span>
                            </div>

                        )}
                        {!hasNextPage && rides.length > 0 && (
                            <p className="text-slate-400 text-sm font-medium">You've reached the end</p>
                        )}
                    </div>
                </main >
            </div >
        </>
    )
}

export default page
