"use client";
import React, { useEffect, useRef, useState, useMemo } from 'react';
import useCaptain from '@/hooks/useCaptain';
import { forAllCaptainRides } from '@/actions/useractions';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

const Page = () => {
    const [isActiveId, setActiveId] = useState(null);
    const [input, setInput] = useState('');
    const [filter, setFilter] = useState("all");
    const [highlighted, setHighlighted] = useState(null);
    const [debouncedInput, setDebouncedInput] = useState("");
    const { user: captain } = useCaptain();
    const router = useRouter();
    const loadMoreRef = useRef(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedInput(input);
        }, 500);
        return () => clearTimeout(timer);
    }, [input]);

    const fetchRides = async ({ pageParam = 1 }) => {
        const res = await forAllCaptainRides(captain.email, filter, pageParam);
        return res;
    };

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isError,
        isLoading,
    } = useInfiniteQuery({
        queryKey: ["captain-rides", captain?.email, filter],
        queryFn: fetchRides,
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage?.nextPage ?? undefined,
        enabled: !!captain?.email
    });

    const rides = useMemo(() => {
        const flat = data?.pages?.flatMap((page) => page.rides) ?? [];
        const seen = new Set();
        return flat.filter((ride) => {
            if (seen.has(ride._id)) return false;
            seen.add(ride._id);
            return true;
        });
    }, [data]);

    useEffect(() => {
        const el = loadMoreRef.current;
        if (!el) return;

        const observer = new IntersectionObserver((entries) => {
            const first = entries[0];
            if (first.isIntersecting && hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
            }
        }, { threshold: 0.1 });

        observer.observe(el);
        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    const match = rides.filter((r) => {
        const search = debouncedInput.toLowerCase();
        const formattedDate = r.createdAt
            ? new Date(r.createdAt)
                .toLocaleDateString([], { month: "short", day: "2-digit", year: "numeric" })
                .toLowerCase()
            : "";
        return (
            r._id?.toString().toLowerCase().includes(search) ||
            r.dropLocation?.toLowerCase().includes(search) ||
            formattedDate.includes(search) ||
            r.pickupLocation?.toLowerCase().includes(search) ||
            r.amount?.toString().includes(search)
        );
    });

    const handleExpand = (id) => {
        setActiveId((prev) => (prev === id ? null : id));
    };

    function formatDuration(start, end) {
        const ms = new Date(end) - new Date(start);
        const mins = Math.floor(ms / (1000 * 60));
        const hrs = Math.floor(mins / 60);
        return `${hrs}h ${mins % 60}m`;
    }

    const handleRedirectToRide = (id) => {
        router.push(`/captain-home/ride/?rideId=${id}`);
    };

    const statusStyles = {
        cancelled: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
        completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
        pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400",
        arriving: "bg-[#137fec] text-white",
        accepted: "bg-[#137fec] text-white",
        ongoing: "bg-[#137fec] text-white",
    };

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
            <div className="bg-[#f6f7f8] dark:bg-[#101922] pt-20 font-display text-slate-900 dark:text-slate-100 min-h-screen">
                <div className="flex overflow-hidden">
                    <main className="flex-1 overflow-y-auto flex flex-col">
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

                            {/* Search Bar */}
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
                                                                }
                                                            }}
                                                            className="px-4 py-2 hover:bg-[#137fec]/10 dark:hover:bg-[#137fec]/20 cursor-pointer rounded-md"
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <div className="text-sm font-semibold">Pickup: {item.pickupLocation}</div>
                                                                <div className="text-sm font-semibold">Drop: {item.dropLocation}</div>
                                                            </div>
                                                            <div className="text-xs text-slate-500 dark:text-slate-400 uppercase">
                                                                {item.status} • {new Date(item.createdAt).toLocaleDateString([], { month: "short", year: "numeric", day: "2-digit" })} • ₹{item.amount}
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

                            {/* Filter Chips */}
                            <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                                {["all", "completed", "cancelled", "active"].map((f) => (
                                    <button
                                        key={f}
                                        onClick={() => setFilter(f)}
                                        className={`${filter === f
                                            ? "bg-[#137fec] text-white"
                                            : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
                                            } px-5 py-2 rounded-full text-sm font-bold transition-all cursor-pointer border border-slate-200 dark:border-slate-700 capitalize`}
                                    >
                                        {f === "active" ? "Ongoing" : f.charAt(0).toUpperCase() + f.slice(1)}
                                    </button>
                                ))}
                            </div>

                            {/* Ride Cards */}
                            <div className="flex-col flex gap-6">
                                {rides.length > 0 ? (
                                    rides.map((ride) => (
                                        <div
                                            id={ride._id}
                                            key={ride._id}
                                            className={`bg-white z-0 hover:z-10 dark:bg-slate-900 rounded-xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 transition-all flex flex-col lg:flex-col gap-6 ${ride.status === "cancelled" ? "hover:border-red-400/40" : "hover:border-[#137fec]/40"} ${highlighted === ride._id ? "ring-2 ring-[#137fec]" : ""}`}
                                        >
                                            <div className="flex lg:flex-row flex-col gap-6">
                                                <div
                                                    className="w-full lg:w-48 h-32 lg:h-auto bg-center bg-no-repeat bg-cover rounded-lg overflow-hidden shrink-0 border border-slate-100 dark:border-slate-800"
                                                    style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuA4TXpQ_w5zchUC4uhnPZYEb_A2sKtCNhEiJ6mTsHGwoPleSBLOyYUyGvgL8iow4_IBW1b6nRMwi78CRxduHWa_yjfEywSeyKOHAdG1iRu4rSFYFmNCueeGQgtMIGj4SNgE_aDkrGmv2ggIW_2guTeEgwpHbi5hWpNTmsm7YikXlVrTpzD9XvmjQNorKuHDr_0fBX75iPX4wUfATiHsOiKjKylB9balP1_Bn4h9zDoxx7Tg4dxwTyqeaUB10BhhgOnVKcAYra_dejQ")` }}
                                                />
                                                <div className="flex-1 flex flex-col justify-between">
                                                    <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
                                                        <div className="flex flex-col">
                                                            <div className="flex items-center gap-2 mb-3">
                                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${statusStyles[ride.status] || "bg-gray-100 text-gray-700"}`}>
                                                                    {ride.status}
                                                                </span>
                                                                <span className={`${ride.status === "completed" || ride.status === "cancelled" ? "text-slate-400" : "text-[#137fec] font-bold"} text-sm font-medium`}>
                                                                    {ride.status === "completed" || ride.status === "cancelled"
                                                                        ? `${new Date(ride.createdAt).toLocaleDateString('en-US', { month: "short", day: "numeric", year: "numeric" })} • ${new Date(ride.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                                                                        : "In Progress"}
                                                                </span>
                                                            </div>
                                                            <div className="space-y-3">
                                                                <div className="flex items-start gap-3">
                                                                    <span className="material-symbols-outlined text-[#137fec] text-lg">radio_button_checked</span>
                                                                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{ride.pickupLocation}</p>
                                                                </div>
                                                                <div className="flex items-start gap-3">
                                                                    <span className="material-symbols-outlined text-slate-400 text-lg">location_on</span>
                                                                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{ride.dropLocation}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">
                                                                {ride.status === "completed" && "Total Earned"}
                                                                {ride.status === "cancelled" && "Fee"}
                                                                {ride.status !== "completed" && ride.status !== "cancelled" && "Est. Fare"}
                                                            </p>
                                                            <p className="text-2xl font-black text-slate-900 dark:text-white">₹{ride.captainEarning}</p>
                                                        </div>
                                                    </div>

                                                    {ride.status !== "cancelled" && (
                                                        ride.status === "completed" ? (
                                                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50 dark:border-slate-800">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                                                                        <span className="material-symbols-outlined text-sm">schedule</span>
                                                                        {ride.duration ? `${Math.floor(ride.duration / 60)}h ${Math.floor(ride.duration % 60)}m` : "--:--"}
                                                                    </div>
                                                                    <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                                                                        <span className="material-symbols-outlined text-sm">distance</span>
                                                                        {`${Math.floor(ride.distance)}`} km
                                                                    </div>
                                                                </div>
                                                                <button
                                                                    onClick={() => handleExpand(ride._id)}
                                                                    className="text-[#137fec] text-sm font-bold flex items-center gap-1"
                                                                >
                                                                    <span className="hover:underline">
                                                                        {isActiveId === ride._id ? "View Less" : "View Details"}
                                                                    </span>
                                                                    <span className={`material-symbols-outlined text-sm transition-transform ${isActiveId === ride._id ? "rotate-180" : "rotate-0"}`}>
                                                                        expand_more
                                                                    </span>
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#137fec]/10">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="flex items-center gap-1.5 text-[#137fec] text-xs font-bold">
                                                                        <span className="material-symbols-outlined text-sm animate-pulse">navigation</span>
                                                                        8 mins remaining
                                                                    </div>
                                                                </div>
                                                                <button
                                                                    onClick={() => handleRedirectToRide(ride._id)}
                                                                    className="bg-[#137fec] text-white px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-[#137fec]/90 transition-all"
                                                                >
                                                                    Open Navigation
                                                                </button>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </div>

                                            {/* Expanded Detail Panel */}
                                            {isActiveId === ride._id && ride.status === "completed" && (
                                                <div className="transition-all duration-300 ease-in-out">
                                                    <div className="p-6 border-b border-[#e7edf3] dark:border-slate-800 flex flex-col md:flex-row gap-6">
                                                        <div className="w-full md:w-1/3 aspect-video bg-slate-200 dark:bg-slate-800 rounded-lg overflow-hidden relative"
                                                            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDJc9CrlFypKbmlXHVtfPCrv4gkz5Or3kk_gvFln5D_w1iRixAFLiTVWKE9jchoYOTycbUJyK3d_1y4wNJ1st894mWY4d8ZpBVrWxPVSOVlnaFV5J1psU2EFME181VZ0EDP-tkpRy2AR2wIHCXGbEEXkXC57clZeUIEdmYEW-qxzUiDR8DgwzhCoL54wCcWFWw8NnxFr4Wmgv-qA6alg21C9rQLGh72jenspJ2nOJArKXCYvkp0afBCVjr6EkgRYEa8rf02OySjMHM')" }}>
                                                            <div className="absolute inset-0 bg-cover bg-center"
                                                                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBQkiHOlJx_3AtvPu_ZiDEI5LShfvWrO8I3aZ7ci40DNK-85ghcUHyZhwQ5yczFURfyLJYF8fOqDj6F7k65Pz1HsB96q17tRa7rkNYW_X5LZG-sOdBLuiHcHeIkR8I06bRtoohMwAIkYhVOuWlvduLy4OyYt8cvkijXdq0Ptsx6qees6oVe6dELiMzqtdaTw6rEJDuBXIoSds4355LVB8-3tAulRTav_dkHb0VjcCJHWxLqKLt2jUqLjH96tHYrxYp9er6OqIcbUnU")' }}>
                                                            </div>
                                                            <div className="absolute inset-0 bg-[#137fec]/10"></div>
                                                            <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-slate-900/90 px-3 py-1.5 rounded-lg text-xs font-bold text-[#137fec] shadow-sm uppercase tracking-wider">
                                                                Successful Trip
                                                            </div>
                                                        </div>
                                                        <div className="flex-1 flex flex-col justify-between py-1">
                                                            <div>
                                                                <h3 className="text-[#0d141b] dark:text-white text-2xl font-bold mb-1">Trip #{ride._id?.slice(-5)}</h3>
                                                                <p className="text-[#4c739a] dark:text-slate-400 text-sm">
                                                                    Completed on {new Date(ride.createdAt).toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })} • {new Date(ride.dropTime).toLocaleTimeString([], { hour: "2-digit", minute: '2-digit' })}
                                                                </p>
                                                            </div>
                                                            <div className="flex items-center gap-6 mt-4 md:mt-0">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-12 w-12 border-2 border-[#137fec]/20"
                                                                        style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCUbz21ajIBfSGCjsVoWNXFbxq3hRP7yo4-krBWXHt82PhlKkcoUxwu0IRLriTGpAgXHnzRacBRJ5x3gpX7qA58GSH6S7x73-vZtHjPRxSlZRgkCEOayBDRNHKxb2J5wFSb0B6NtkEWVv0lURjsUZYxjEI18kvXTtH34vXCtZc2lQ3aRZjhw_LrRxHk5D57giVbmPpGIbqO94dyYCV72NXzQlxr_RIHQCzaIIxNlVTI937iKk832S2Es-3o8jpUGfDFHVSqP2kT4hY")' }}>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-[#0d141b] dark:text-white font-bold leading-tight">John Doe</p>
                                                                        <div className="flex items-center text-yellow-500 gap-1">
                                                                            <span className="material-symbols-outlined text-[16px] material-symbols-fill">star</span>
                                                                            <span className="text-xs font-bold text-[#4c739a] dark:text-slate-400">4.9</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="h-10 w-px bg-slate-200 dark:bg-slate-800"></div>
                                                                <div className="flex flex-col">
                                                                    <p className="text-xs uppercase text-[#4c739a] dark:text-slate-500 font-bold tracking-wider">Payment</p>
                                                                    <div className="flex items-center gap-1.5 text-[#137fec]">
                                                                        <span className="material-symbols-outlined text-[18px]">credit_card</span>
                                                                        <span className="text-sm font-bold uppercase">{ride.paymentProvider}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2">
                                                        <div className="p-6 border-r border-[#e7edf3] dark:border-slate-800">
                                                            <h4 className="text-sm font-bold text-[#0d141b] dark:text-white mb-6 uppercase tracking-widest">Journey Details</h4>
                                                            <div className="relative pl-8 mb-8">
                                                                <div className="absolute left-1.75 top-2 bottom-2 w-0.5 bg-slate-200 dark:bg-slate-800 border-dashed border-l-2"></div>
                                                                <div className="mb-8 relative">
                                                                    <div className="absolute -left-8 top-1 size-4 rounded-full bg-[#137fec] ring-4 ring-[#137fec]/10"></div>
                                                                    <p className="text-xs font-bold text-[#137fec] uppercase mb-1">
                                                                        Pickup • {ride.pickupTime ? `${new Date(ride.pickupTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "--:--"}
                                                                    </p>
                                                                    <p className="text-sm font-medium text-[#0d141b] dark:text-slate-200">{ride.pickupLocation}</p>
                                                                </div>
                                                                <div className="relative">
                                                                    <div className="absolute -left-8 top-1 size-4 rounded-full bg-slate-800 dark:bg-slate-200 ring-4 ring-slate-200 dark:ring-slate-700"></div>
                                                                    <p className="text-xs font-bold text-[#4c739a] dark:text-slate-500 uppercase mb-1">
                                                                        Dropoff • {ride.dropTime ? `${new Date(ride.dropTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "--:--"}
                                                                    </p>
                                                                    <p className="text-sm font-medium text-[#0d141b] dark:text-slate-200">{ride.dropLocation}</p>
                                                                </div>
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div className="bg-[#f0f4f8] dark:bg-slate-800/50 p-4 rounded-lg">
                                                                    <p className="text-xs text-[#4c739a] mb-1">Trip Duration</p>
                                                                    <div className="flex items-center gap-2 font-bold text-[#0d141b] dark:text-white">
                                                                        <span className="material-symbols-outlined text-[18px] text-[#4c739a]">schedule</span>
                                                                        {formatDuration(ride.pickupTime, ride.dropTime)}
                                                                    </div>
                                                                </div>
                                                                <div className="bg-[#f0f4f8] dark:bg-slate-800/50 p-4 rounded-lg">
                                                                    <p className="text-xs text-[#4c739a] mb-1">Distance</p>
                                                                    <div className="flex items-center gap-2 font-bold text-[#0d141b] dark:text-white">
                                                                        <span className="material-symbols-outlined text-[18px] text-[#4c739a]">route</span>
                                                                        {`${Math.floor(ride.distance)}`} km
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="p-6 bg-slate-50/50 dark:bg-slate-900/50">
                                                            <h4 className="text-sm font-bold text-[#0d141b] dark:text-white mb-6 uppercase tracking-widest">Payout Breakdown</h4>
                                                            <div className="space-y-4">
                                                                <div className="flex justify-between items-center text-sm">
                                                                    <span className="text-[#4c739a] dark:text-slate-400">Base Fare</span>
                                                                    <span className="font-medium text-[#0d141b] dark:text-slate-200">₹{ride.amount}</span>
                                                                </div>
                                                                <div className="flex justify-between items-center text-sm">
                                                                    <span className="text-[#4c739a] dark:text-slate-400">Peak Surge (1.2x)</span>
                                                                    <span className="font-medium text-[#137fec]">+₹0.00</span>
                                                                </div>
                                                                <div className="flex justify-between items-center text-sm">
                                                                    <span className="text-[#4c739a] dark:text-slate-400">Platform Service Fee (20%)</span>
                                                                    <span className="font-medium text-red-500">-₹{ride.platformFee}</span>
                                                                </div>
                                                                <div className="flex justify-between items-center text-sm">
                                                                    <span className="text-[#4c739a] dark:text-slate-400">Passenger Tip</span>
                                                                    <span className="font-medium text-emerald-600 dark:text-emerald-400">+₹{ride.tip}</span>
                                                                </div>
                                                                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 mt-4">
                                                                    <div className="flex justify-between items-end">
                                                                        <div>
                                                                            <p className="text-xs font-bold text-[#137fec] uppercase mb-1">Net Earnings</p>
                                                                            <p className="text-3xl font-black text-[#0d141b] dark:text-white">₹{ride.captainEarning}</p>
                                                                        </div>
                                                                        <div className="flex items-center gap-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full text-xs font-bold">
                                                                            <span className="material-symbols-outlined text-[14px]">check_circle</span>
                                                                            Paid
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
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
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-4 py-2 text-slate-400 dark:text-slate-500 text-sm">No rides found</div>
                                )}
                            </div>

                            <div ref={loadMoreRef} className="mt-8 flex flex-col items-center gap-3 py-6">
                                {isFetchingNextPage && (
                                    <span className="animate-spin material-symbols-outlined text-2xl text-[#137fec]">
                                        progress_activity
                                    </span>
                                )}
                                {!hasNextPage && rides.length > 0 && (
                                    <p className="text-slate-400 text-sm font-medium">You've reached the end</p>
                                )}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
};

export default Page;