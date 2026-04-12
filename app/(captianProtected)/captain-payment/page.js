"use client";
import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import useCaptain from '@/hooks/useCaptain';
import { forAllCaptainPayment } from '@/actions/useractions';
import { useInfiniteQuery } from '@tanstack/react-query';

const Page = () => {
    const { user: captain } = useCaptain();
    const [isActive, setActiveId] = useState(null);
    const loadMoreRef = useRef(null);
    const [activeFilter, setActiveFilter] = useState("All");

    const handleExpand = (id) => {
        setActiveId((prev) => (prev === id ? null : id));
    };

    const fetchPayments = useCallback(async ({ pageParam = 1 }) => {
        let response = await forAllCaptainPayment(captain?.email, activeFilter, pageParam);
        return response;
    }, [captain?.email, activeFilter])

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useInfiniteQuery({
        queryKey: ["captain-payments", activeFilter, captain?.email],
        queryFn: fetchPayments,
        initialPageParam: 1,
        getNextPageParam: (page) => page.nextPage ?? undefined,
        enabled: !!captain?.email
    });

    const payments = data?.pages?.flatMap((page, pageIndex) =>
        (page.payments ?? []).map((payment, itemIndex) => ({
            ...payment,
            _listKey: `${payment?._id ?? "noid"}-${pageIndex}-${itemIndex}`,
        }))
    ) ?? []

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

    const totalEarn = useMemo(() => {
        return payments
            .filter((p) => p?.status === "completed")
            .reduce((s, p) => s + (p.amount ?? 0), 0);
    }, [payments]);
    const totalRides = useMemo(() => {
        return payments.filter((p) => p?.status === "completed").length;
    }, [payments])

    return (
        <>
            <div className="bg-[#f6f7f8] pt-16 sm:pt-20 dark:bg-[#101922] font-display text-[#0d141b] dark:text-slate-100 min-h-screen">
                <div className="flex overflow-hidden">

                    {/* Main Content */}
                    <main className="flex-1 flex flex-col overflow-y-auto">
                        <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-6">
                            {/* Top Header */}
                            <header className="rounded-xl border border-slate-200 bg-white dark:bg-[#1a2632] dark:border-slate-800 shadow-sm overflow-hidden px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <h1 className="text-lg sm:text-xl font-bold">Earnings Dashboard</h1>
                                {/* Segmented Buttons Filter */}
                                <div className="flex flex-wrap bg-slate-100 dark:bg-slate-800 p-1 rounded-xl gap-1">
                                    {["All", "Today", "This Week", "This Month"].map((f, i) => (
                                        <div
                                            key={i}
                                            onClick={() => setActiveFilter(f)}
                                            className={`px-3 sm:px-4 py-1.5 text-[11px] sm:text-xs font-semibold rounded-lg cursor-pointer transition-all ${activeFilter === f
                                                ? "bg-white text-[#137fec] shadow-sm dark:bg-slate-700 dark:text-white"
                                                : "text-slate-500"
                                                }`}>
                                            {f}
                                        </div>
                                    ))}
                                </div>
                            </header>
                            {/* Hero Section: Total Balance */}
                            <section className="bg-white dark:bg-[#1a2632] rounded-xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 lg:p-8 shadow-sm overflow-hidden relative">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative z-10">
                                    <div>
                                        <p className="text-[#4c739a] font-medium text-xs sm:text-sm mb-1 uppercase tracking-wider">{activeFilter} Earnings</p>
                                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0d141b] dark:text-white tracking-tight">₹{totalEarn} </h2>
                                        <p className="text-[#4c739a] mt-2 flex items-center gap-2 text-xs sm:text-sm">
                                            <span className="material-symbols-outlined text-green-500 text-lg">check_circle</span>
                                            {totalRides} Trips Completed
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-start md:items-end gap-3 w-full md:w-auto">
                                        <button className="w-full md:w-auto bg-[#137fec] hover:bg-[#137fec]/90 text-white font-bold py-3 px-6 sm:px-8 rounded-xl shadow-lg shadow-[#137fec]/20 transition-all active:scale-[0.98]">
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
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                    <h3 className="font-bold text-base sm:text-lg">Recent Trips</h3>
                                    <button className="text-xs sm:text-sm font-semibold text-[#137fec] hover:underline">View All History</button>
                                </div>
                                {/* Trip Row 1 */}
                                {payments.length > 0 ? (
                                    payments.map((payment) => {
                                        return (
                                            <div key={payment._listKey} className="bg-white dark:bg-[#1a2632] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                                                <div className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                    <div className="flex items-start sm:items-center gap-4">
                                                        <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-lg text-slate-500">
                                                            <span className="material-symbols-outlined">schedule</span>
                                                        </div>
                                                        <div className='flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 max-w-full'>
                                                            <p className="font-bold text-sm wrap-break-word">Pick Up: {payment.pickupLocation}</p>
                                                            <span className="material-symbols-outlined hidden sm:inline-block">arrow_right_alt</span>
                                                            <p className="font-bold text-sm wrap-break-word"> Drop: {payment.dropLocation}</p>
                                                            <p className="text-xs text-[#4c739a] sm:ml-2">{new Date(payment.createdAt).toLocaleString("en-US")}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6">
                                                        <div className="text-left sm:text-right">
                                                            <p className="font-bold text-base">₹{payment.captainEarning}</p>
                                                            {payment.status == "completed" && (<p className="text-[10px] text-green-600 font-bold uppercase tracking-tight">
                                                                {payment.status}
                                                            </p>)}
                                                            {payment.status == "failed" && (<p className="text-[10px] text-red-600 font-bold uppercase tracking-tight">
                                                                {payment.status}
                                                            </p>)}
                                                        </div>
                                                        <span onClick={() => handleExpand(payment._id)} className={`material-symbols-outlined text-slate-400 transition-transform ${isActive === payment._id ? "rotate-180" : "rotate-0"}`}>expand_more</span>
                                                    </div>
                                                </div>
                                                {/* Breakdown Panel */}
                                                {isActive === payment._id && (<div className="px-4 sm:px-8 lg:px-16 bg-slate-50/50 dark:bg-slate-800/20 border-t border-slate-100 dark:border-slate-800 overflow-hidden transition-all duration-300 ease-in-out">
                                                    <div className="space-y-2 text-xs sm:text-sm">
                                                        <div className="flex justify-between">
                                                            <span className="text-[#4c739a]">Base Fare</span>
                                                            <span className="font-medium">₹{payment.amount}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-[#4c739a]">Tip</span>
                                                            <span className="font-medium">₹{payment.tip}</span>
                                                        </div>
                                                        <div className="flex justify-between text-orange-600">
                                                            <span className="font-medium">Surge Pricing (1.2x)</span>
                                                            <span className="font-bold">+₹0.00</span>
                                                        </div>
                                                        <div className="flex justify-between text-slate-400">
                                                            <span>Platform Fee</span>
                                                            <span>-₹{payment.platformFee}</span>
                                                        </div>
                                                        <div className="pt-2 mt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between font-bold text-[#0d141b] dark:text-white">
                                                            <span>Net Earnings</span>
                                                            <span>₹{payment.captainEarning}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                )}
                                            </div>
                                        );
                                    })

                                )
                                    :
                                    (<div className="px-4 py-2 text-slate-400 dark:text-slate-500 text-sm">No Payment found</div>)
                                }

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
                            </section>
                        </div>
                    </main>
                </div>
            </div>
        </>
    )
}

export default Page
