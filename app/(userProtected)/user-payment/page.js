"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import useUser from '@/hooks/useUser';
import { forAllRiderPayments } from '@/actions/useractions';
import { useInfiniteQuery } from '@tanstack/react-query';

const page = () => {
    const [input, setInput] = useState('');
    const [debouncedInput, setDebouncedInput] = useState('');
    const { user } = useUser();
    const [filter, setFilter] = useState("All Payments");
    const loadMoreRef = useRef(null);
    const [highlighted, setHighlighted] = useState(null);

    const fetchPayments = useCallback(async ({ pageParam = 1 }) => {
        const response = await forAllRiderPayments(user?.email, filter, pageParam);
        return response;
    }, [user?.email, filter])

    const {
        data,
        fetchNextPage,
        isFetchingNextPage,
        hasNextPage
    } = useInfiniteQuery({
        queryKey: ["rider-payments", user?.email, filter],
        queryFn: fetchPayments,
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage?.nextPage ?? undefined,
        enabled: !!user?.email
    })

    const payments = data?.pages?.flatMap((page) => page?.payments ?? []) ?? [];

    console.log(payments)

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedInput(input)
        }, 500)

        return () => clearTimeout(timer)
    }, [input])

    useEffect(() => {
        const el = loadMoreRef.current;
        if (!el) return;

        const observer = new IntersectionObserver((entries) => {
            let first = entries[0]

            if (first.isIntersecting && hasNextPage && !isFetchingNextPage) {
                fetchNextPage()
            }
        }, { threshold: 0.1 })

        observer.observe(el);

        return () => observer.disconnect()

    }, [isFetchingNextPage, hasNextPage, fetchNextPage])

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

    const fmtDate = (iso) =>
        new Date(iso).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });

    const fmtTime = (iso) =>
        new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

    const match = payments.filter((p) => {
        const formattedDate = fmtDate(p.createdAt);
        const search = debouncedInput.toLowerCase();

        return (
            p.pickupLocation?.toLowerCase().includes(search) ||
            p.dropLocation?.toLowerCase().includes(search) ||
            formattedDate?.includes(search) ||
            p.transactionId?.toString().includes(search) ||
            p.captainUsername.toLowerCase().includes(search) ||
            p.vehicle.toLowerCase().includes(search)
        )
    })

    const StatCard = ({ label, value, positive, icon, iconBg, iconColor }) => (
        <div className="flex flex-col gap-4 rounded-2xl p-5 bg-white dark:bg-slate-800/70 border border-slate-100 dark:border-slate-700/50 shadow-sm">
            <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{label}</p>
                <div className={`p-1.5 ${iconBg} rounded-xl ${iconColor}`}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{icon}</span>
                </div>
            </div>
            <div>
                <p className="text-[28px] font-black text-slate-800 dark:text-white tracking-tight leading-none mb-2">{value}</p>
                <p className={`text-xs font-semibold flex items-center gap-1.5 ${positive ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"}`}>
                    {/* <span>{change}</span> */}
                    <span className="text-slate-400 dark:text-slate-500 font-normal">vs last month</span>
                </p>
            </div>
        </div>
    );

    const formatINR = (amount) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format((amount ?? 0));

    const totalSpent = formatINR(
        payments
            .filter((p) => p?.status === "completed")
            .reduce((s, p) => s + (p?.amount ?? 0), 0)
    );

    const rideCount = payments.filter((p) => p?.status === "completed").length;
    const canceledCount = payments.filter((p) => p?.status === "canceled").length;

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
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <StatCard label="Total Spent" value={totalSpent} positive icon="payments" iconBg="bg-blue-50 dark:bg-blue-900/20" iconColor="text-blue-600 dark:text-blue-400" />
                                <StatCard label="Rides Taken" value={rideCount} positive icon="directions_car" iconBg="bg-emerald-50 dark:bg-emerald-900/20" iconColor="text-emerald-600 dark:text-emerald-400" />
                                <StatCard label="Canceled" value={canceledCount} positive={false} icon="cancel" iconBg="bg-red-50 dark:bg-red-900/20" iconColor="text-red-500 dark:text-red-400" />
                            </div>

                            {/* Filters & Search */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-hide">
                                    {["All Payments", "Completed", "Cancelled", "Pending"].map((f) => {
                                        return (
                                            <button key={f} onClick={() => setFilter(f)} className={`${filter === f
                                                ? "bg-[#111318] text-white dark:bg-white dark:text-black"
                                                : "bg-white dark:bg-[#1a202c] hover:bg-gray-50 dark:hover:bg-gray-800"
                                                } flex h-9 items-center justify-center rounded-lg dark:bg-[#1a202c] border border-[#dbdfe6] dark:border-gray-700 text-[#616f89] dark:text-gray-300 px-4 text-sm font-medium  transition-colors whitespace-nowrap cursor-pointer`}>
                                                {f}
                                            </button>
                                        )
                                    })}
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
                                    {debouncedInput.trim() && (
                                        <ul className="absolute top-full left-0 right-0 mt-1 max-h-64 overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg z-50">
                                            {match.length > 0 ? (
                                                match.map((item, index) => (
                                                    <li key={index} onClick={() => {
                                                        let el = document.getElementById(item._id)
                                                        if (el) {
                                                            setHighlighted(item._id);
                                                            el.scrollIntoView({ behavior: "smooth", block: "center" });
                                                            setTimeout(() => setHighlighted(null), 2000);
                                                        }
                                                    }}
                                                        className="px-4 py-2 hover:bg-[#137fec]/10 dark:hover:bg-[#137fec]/20 cursor-pointer rounded-md">
                                                        <div className='flex items-center justify-between'>
                                                            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Pick Up:{item.pickupLocation}</div>
                                                            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Drop :{item.dropLocation}</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-semibold uppercase">{item.status} • {fmtDate(item.createdAt)} • &#8377;{item.amount}</div>
                                                            <div className="text-sm font-semibold">Transaction ID:{item.transactionId}</div>
                                                        </div>
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
                            {payments.length > 0 ? (payments.map((payment, index) => {
                                return (
                                    <div id={payment?._id} key={payment?._id ?? payment?.rideId ?? index} className="flex flex-col gap-4">
                                        <div className={`group flex flex-col md:flex-row items-start md:items-center justify-between p-5 bg-[#ffffff] dark:bg-[#1a202c] rounded-xl border shadow-sm hover:shadow-md transition-all duration-200 
                                                ${highlighted === payment._id ? "border-[#135bec] ring-2 ring-[#135bec]/30"
                                                : payment.status === "completed" ? "border-[#f0f2f4] dark:border-gray-700/50 hover:border-[#135bec]/20 dark:hover:border-[#135bec]/40"
                                                    : (payment.status === "canceled" || payment.status === "failed") ? "border-[#f0f2f4] dark:border-gray-700/50 hover:border-red-200 dark:hover:border-red-900/40"
                                                        : payment.status === "pending" ? "border-yellow-200 dark:border-yellow-900/30" : "border-[#f0f2f4] dark:border-gray-700/50"
                                            }`}>

                                            <div className="flex items-start gap-4 w-full md:w-auto">
                                                <div className={`size-12 rounded-full bg-[#f0f2f4] dark:bg-gray-800 flex items-center justify-center text-[#111318] dark:text-white shrink-0 group-hover:bg-[#135bec]/10 transition-colors 
                                                    ${payment.status === "completed" && "group-hover:text-[#135bec]"} 
                                                    ${payment.status === "canceled" || payment.status === "failed" && "text-red-600 dark:text-red-400"} 
                                                    ${payment.status === "pending" && "text-yellow-600 dark:text-yellow-400"}
                                                    `}>

                                                    <span className="material-symbols-outlined">
                                                        {payment.status === "completed" && "local_taxi"}
                                                        {payment.status === "pending" && "schedule"}
                                                        {(payment.status === "canceled" || payment.status === "failed") && "no_crash"}
                                                    </span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h4 className="text-base font-bold text-[#111318] dark:text-white">Captain Name: {payment.captainUsername}</h4>
                                                        <span className="text-xs text-[#616f89] dark:text-gray-400">{fmtDate(payment.createdAt)} • {fmtTime(payment.createdAt)}</span>
                                                    </div>
                                                    <h4 className="text-sm text-[#616f89] dark:text-gray-400">Vehicle Name: {payment.vehicle}</h4>

                                                    <div className="flex items-center gap-2 text-sm text-[#616f89] dark:text-gray-400">
                                                        <span className="material-symbols-outlined text-[16px] text-gray-400">trip_origin</span>
                                                        <span className="truncate max-w-30 md:max-w-50">Pick Up: {payment.pickupLocation}</span>
                                                        <span className="material-symbols-outlined text-[16px] text-gray-400">arrow_right_alt</span>
                                                        <span className="truncate max-w-30 md:max-w-50">Drop: {payment.dropLocation}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-[#616f89] dark:text-gray-400">
                                                        Transaction ID: {payment.transactionId}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto mt-4 md:mt-0 gap-4 md:gap-1 pl-16 md:pl-0">
                                                <div className="text-right flex flex-col items-end">
                                                    <p className="text-lg font-bold text-[#135bec] dark:text-blue-400">{formatINR(payment.amount)}</p>
                                                    {payment.status === "completed" && (
                                                        <div className="flex items-center gap-1 mt-1">
                                                            <span className="size-2 rounded-full bg-green-500"></span>
                                                            <span className="text-xs font-medium text-green-700 dark:text-green-400">Paid</span>
                                                        </div>
                                                    )}
                                                    {payment.status === "canceled" && (
                                                        <div className="text-right flex flex-col items-end">
                                                            <div className="flex items-center gap-1 mt-1 bg-red-100 dark:bg-red-900/30 px-2 py-0.5 rounded-full">
                                                                <span className="text-xs font-bold text-red-700 dark:text-red-400">Canceled</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {payment.status === "pending" && (
                                                        <div className="flex items-center gap-1 mt-1">
                                                            <span className="size-2 rounded-full bg-yellow-400 animate-pulse"></span>
                                                            <span className="text-xs font-medium text-yellow-700 dark:text-yellow-400">Processing</span>
                                                        </div>
                                                    )}
                                                    {payment.status === "failed" && (
                                                        <div className="flex items-center gap-1 mt-1">
                                                            <span className="size-2 rounded-full bg-red-400 animate-pulse"></span>
                                                            <span className="text-xs font-medium text-red-700 dark:text-yellow-400">Failed</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }))
                                : (
                                    <div className="px-4 py-2 text-slate-400 dark:text-slate-500 text-sm mx-auto">No Payments found</div>
                                )}

                            <div ref={loadMoreRef} className="mt-8 flex flex-col items-center gap-3 py-6">
                                {isFetchingNextPage && (
                                    <div className="flex items-center justify-center">
                                        <span className="animate-spin material-symbols-outlined text-4xl text-[#137fec]">
                                            progress_activity
                                        </span>
                                    </div>

                                )}
                                {!hasNextPage && payments.length > 0 && (
                                    <p className="text-slate-400 text-sm font-medium">You've reached the end</p>
                                )}
                            </div>
                        </div>
                    </div>
                </main >
            </div >
        </>
    )
}

export default page
