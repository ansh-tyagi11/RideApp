"use client";
import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Message from '../../../../components/message';
import { forRiderInfo, forVerifyRideId } from '@/actions/useractions';
import { useRideId } from '@/hooks/rideId';
import socket from '@/lib/socket';
import { useQuery } from '@tanstack/react-query';

const rideSteps = ['accepted', 'arriving', 'ongoing', 'completed'];

const stepText = {
    accepted: 'Heading to Pickup',
    arriving: 'Arrived at Pickup',
    ongoing: 'Ride in Progress',
    completed: 'Trip Completed',
};

export default function CaptainDuringRide() {
    const [panelOpen, setPanelOpen] = useState(false);
    const [stepIdx, setStepIdx] = useState(0);
    const [chatOpen, setChatOpen] = useState(false);
    const router = useRouter();
    const rideId = useRideId();

    const stepKey = rideSteps[stepIdx];
    const tripDone = stepKey === 'completed';

    const verifyRide = useCallback(async (id) => {
        if (!id) {
            setStepIdx(0);
            return;
        }

        let verifyRes = await forVerifyRideId(id);
        if (!verifyRes.success) return router.push("/captain-home");

        const activeRideId = sessionStorage.getItem("activeRideId");
        if (!activeRideId) {
            sessionStorage.setItem("activeRideId", id);
        }

        let status = verifyRes.ride?.status;
        const idx = rideSteps.indexOf(status);

        if (idx !== -1) {
            setStepIdx((prev) => (prev === idx ? prev : idx));
        }
    }, [router]);

    useEffect(() => {
        verifyRide(rideId);
    }, [rideId, verifyRide]);

    const { data, isLoading, isError } = useQuery({
        queryKey: ["rider-info", rideId],
        queryFn: () => forRiderInfo(rideId),
        enabled: !!rideId,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        retry: 0,
        select: (res) => res?.data ?? null,
    })

    const rider = data;

    useEffect(() => {
        if (!rideId) return;

        if (!socket.connected) {
            socket.connect();
        }
        socket.emit("roomId", rideId);

        const handleStatus = (status) => {
            const idx = rideSteps.indexOf(status);
            if (idx === -1) return;
            setStepIdx((prev) => (prev === idx ? prev : idx));
        };

        socket.on("status", handleStatus);

        return () => {
            socket.off("status", handleStatus);
        };
    }, [rideId]);

    const advanceStep = () => {

        if (stepIdx >= rideSteps.length - 1) return;

        const nextStep = rideSteps[stepIdx + 1];

        socket.emit("rideStatus", {
            rideId,
            rideStatus: nextStep
        });
    };

    const primaryText = {
        accepted: 'Arrived at Pickup',
        arriving: 'Start Ride',
        ongoing: 'Complete Trip',
        completed: 'Trip Completed ✓',
    }[stepKey];

    const primarySymbol = {
        accepted: 'where_to_vote',
        arriving: 'play_arrow',
        ongoing: 'flag',
        completed: 'check_circle',
    }[stepKey];

    const etaInfo = {
        accepted: { label: 'Heading to rider', eta: 'ETA 8 mins', color: 'text-blue-500 dark:text-blue-400' },
        arriving: { label: 'Waiting for rider', eta: 'Arrived', color: 'text-yellow-500 dark:text-yellow-400' },
        ongoing: { label: 'Ride in progress', eta: 'ETA 14 mins', color: 'text-green-600 dark:text-green-400' },
        completed: { label: 'Trip complete', eta: 'Arrived', color: 'text-green-600 dark:text-green-400' },
    }[stepKey];

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center h-screen gap-3">
                <span className="material-symbols-outlined text-4xl text-red-500">error</span>
                <p className="text-red-500 font-semibold">Something went wrong</p>
            </div>
        );
    }

    const isRiderLoading = isLoading || !rider;

    const fmtTime = (time) => {
        const h = Math.floor(time / 60);
        const m = time % 60;
        if (h === 0) return `${m}min`;
        if (m === 0) return `${h}h`;
        return `${h}h ${m}min`;
    }

    return (
        <div className="bg-[#f6f7f8] dark:bg-[#101a22] text-[#111518] font-display h-screen w-screen md:overflow-hidden flex relative flex-col md:flex-row overflow-x-hidden">

            {/* Left Panel: Map */}
            <main className="flex-1 relative bg-gray-100 md:h-full w-full md:pt-0">

                {/* Map Background */}
                <div
                    className="absolute inset-0 w-full h-full bg-cover bg-center opacity-90"
                    style={{
                        backgroundImage:
                            'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD2WNcjeOBkQGWbDQz26fF_3qQb7ughAU1o6L4FW0O_YIaD_36p53RKtYdDnWPx16F-xPJmo2FMBTs7HR42qth7X9umD8oVdk_8s3Td4ZIzYw4MlqdF_d67OE0MLj9ZTZphh9eTqRji45HI8yqkVkbiHM0qlaD0--Pn4fer-0L6Ny1BQtYhB-ibqSEZxMqBHlw_z6IN8YJB5uuCmzJuUy6B90yons0WS6OLqhaSSWw8Y2CU1QOrUEBkCSQzd9Xhmesxv1ez-xNghUi2")',
                    }}
                />

                {/* SVG Route Overlay */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        className="drop-shadow-lg opacity-90"
                        d="M 200 800 Q 400 600 500 500 T 800 300"
                        fill="none"
                        stroke="#2b9dee"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="6"
                    />
                    <path
                        className="opacity-60"
                        d="M 800 300 L 900 250"
                        fill="none"
                        stroke="#94a3b8"
                        strokeDasharray="10, 10"
                        strokeLinecap="round"
                        strokeWidth="6"
                    />
                    <g transform="translate(500, 500)">
                        <circle className="pulse-ring" cx="0" cy="0" fill="#2b9dee" fillOpacity="0.2" r="40" />
                        <circle cx="0" cy="0" fill="#fff" r="16" stroke="#2b9dee" strokeWidth="3" />
                    </g>
                </svg>

                {/* Floating Top Banner */}
                <div className="pt-20 md:pt-0 absolute top-6 left-1/2 -translate-x-1/2 w-[90%] md:w-auto z-10">
                    <div className="flex items-center gap-4 bg-white/90 dark:bg-[#1A2632]/95 backdrop-blur-md rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-2 pr-6 border border-white/50 animate-fade-in-down">
                        <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-blue-500 dark:text-blue-400">navigation</span>
                        </div>
                        <div className="flex flex-col">
                            <h3 className="text-base font-bold text-[#111518] dark:text-white leading-tight">
                                {etaInfo.label}
                            </h3>
                            <p className={`text-sm font-medium ${etaInfo.color}`}>
                                {etaInfo.eta}{' '}
                                {stepKey === 'accepted' && (
                                    <span className="text-[#617989] font-normal">• 2.4 miles</span>
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Map Controls */}
                <div className="absolute bottom-8 right-8 flex flex-col gap-3 z-10">
                    <button className="bg-white dark:bg-[#1A2632] hover:bg-gray-50 text-[#111518] dark:text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-transform active:scale-95">
                        <span className="material-symbols-outlined">my_location</span>
                    </button>
                    <div className="flex flex-col bg-white dark:bg-[#1A2632] rounded-full shadow-lg overflow-hidden">
                        <button className="w-12 h-12 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-[#23303C] border-b border-gray-100 dark:border-[#2f3e4c]">
                            <span className="material-symbols-outlined">add</span>
                        </button>
                        <button className="w-12 h-12 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-[#23303C]">
                            <span className="material-symbols-outlined">remove</span>
                        </button>
                    </div>
                </div>
            </main>

            {/* Right Panel: Rider Info & Captain Controls */}
            <aside
                className={`w-full md:w-105 rounded-t-4xl md:rounded-t-none bg-white dark:bg-[#1A2632] absolute bottom-0 z-20 md:h-full flex flex-col shadow-xl md:relative shrink-0 overflow-y-auto ${panelOpen ? 'h-[75%]' : 'h-[28%]'
                    }`}
            >
                {/* Drag Handle */}
                <div
                    onClick={() => setPanelOpen(!panelOpen)}
                    className="p-6 pb-2 z-30 sticky top-0 bg-white dark:bg-[#1A2632] cursor-pointer"
                >
                    <div className="flex items-center justify-center mb-4">
                        <div className="w-20 h-1 rounded-full bg-gray-200 dark:bg-[#2f3e4c]" />
                    </div>

                    {/* Step Status Badge */}
                    <div className="flex items-center justify-between mb-1">
                        <span
                            className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${tripDone
                                ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-blue-100 text-[#2b9dee] dark:bg-blue-900/20'
                                }`}
                        >
                            {stepText[stepKey]}
                        </span>
                        <span className="text-xs text-[#617989] dark:text-gray-400 font-medium">
                            Trip #48291
                        </span>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 px-6 md:pt-4 flex flex-col gap-5 pb-8">

                    {/* Rider Card */}
                    <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm dark:bg-[#23303C] dark:border-[#2f3e4c]">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="relative">
                                <img className="bg-center bg-no-repeat bg-cover rounded-full w-16 h-16 shadow-inner" src={rider?.image} alt="image" />
                                <div className="absolute -bottom-1 -right-1 bg-white dark:bg-[#23303C] rounded-full p-0.5">
                                    <span
                                        className="material-symbols-outlined text-yellow-500 text-[20px] leading-none"
                                        style={{ fontVariationSettings: "'FILL' 1" }}
                                    >
                                        star
                                    </span>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-[#617989] dark:text-gray-400 uppercase tracking-wider font-medium mb-0.5">
                                    Your Rider
                                </p>
                                <h2 className="text-lg font-bold text-[#111518] dark:text-white leading-tight">
                                    {isRiderLoading ? (
                                        <span className="block h-5 w-28 rounded-md bg-gray-200 dark:bg-[#2f3e4c] animate-pulse" />
                                    ) : (
                                        rider?.riderUsername ?? "Rider"
                                    )}
                                </h2>
                            </div>
                            <div className="ml-auto flex gap-2">
                                {/* Chat Button */}
                                <button
                                    onClick={() => setChatOpen(!chatOpen)}
                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-[#f0f3f4] dark:bg-[#1A2632] text-[#111518] dark:text-white hover:bg-[#2b9dee]/20 hover:text-[#2b9dee] transition-all cursor-pointer"
                                >
                                    <span className="material-symbols-outlined text-[20px]">chat</span>
                                </button>
                                <a className="group w-10 h-10 flex items-center justify-center rounded-full bg-[#f0f3f4] dark:bg-[#1A2632] text-[#111518] dark:text-white hover:bg-[#2b9dee]/20 hover:text-[#2b9dee] transition-all" href={rider?.phone ? `tel:${rider.phone}` : "#"}>
                                    <span className="material-symbols-outlined text-[20px]">call</span>
                                </a>
                            </div>
                        </div>

                        <div className="h-px bg-gray-100 dark:bg-[#2f3e4c] w-full mb-4" />

                        {/* Trip Fare Info */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600">
                                    <span className="material-symbols-outlined text-[24px]">payments</span>
                                </div>
                                <div>
                                    <p className="text-[#111518] dark:text-white font-semibold text-sm">
                                        Trip Earnings
                                    </p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-green-600 dark:text-green-400 font-bold text-base">{isRiderLoading ? (
                                            <span className="block h-4 w-48 rounded-md bg-gray-200 dark:bg-[#2f3e4c] animate-pulse" />
                                        ) : (
                                            <span>₹{rider?.amount ?? "Amount"}</span>
                                        )}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-[#617989] dark:text-gray-400">Total Distance: {Math.floor(rider?.distance)}km</p>
                                <p className="text-xs text-[#617989] dark:text-gray-400 mt-0.5">
                                    Total Time: ~{fmtTime(rider?.duration)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Timeline / Route */}
                    <div className="relative pl-2 py-2">
                        <div className="absolute left-4.75 top-3 bottom-8 w-0.5 bg-gray-200 dark:bg-[#2f3e4c] -z-10" />

                        {/* Pickup */}
                        <div className="flex gap-4 mb-8">
                            <div className="flex flex-col items-center">
                                <div
                                    className={`w-4 h-4 rounded-full border-[3px] shrink-0 ${stepIdx >= 1
                                        ? 'bg-[#2b9dee] border-[#2b9dee]'
                                        : 'border-gray-300 bg-white dark:border-gray-600 dark:bg-[#1A2632]'
                                        }`}
                                />
                                <span className="text-[10px] text-gray-400 font-medium mt-1"><span className="text-[10px] text-[#2b9dee] font-medium mt-1">
                                    {isRiderLoading ? (
                                        <span className="block h-4 w-48 rounded-md bg-gray-200 dark:bg-[#2f3e4c] animate-pulse" />
                                    ) : rider?.pickupTime && !isNaN(new Date(rider.pickupTime)) ? (
                                        new Date(rider.pickupTime).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit"
                                        })
                                    ) : (
                                        "--:--"
                                    )}
                                </span></span>
                            </div>
                            <div className="flex flex-col -mt-1.5">
                                <p className="text-xs text-[#617989] dark:text-gray-400 font-medium uppercase tracking-wider mb-0.5">
                                    Pick-up
                                </p>
                                <p className="text-[#111518] dark:text-white text-sm font-semibold">
                                    {isRiderLoading ? (
                                        <span className="block h-4 w-48 rounded-md bg-gray-200 dark:bg-[#2f3e4c] animate-pulse" />
                                    ) : (
                                        rider?.pickupLocation ?? "Pickup location"
                                    )}
                                </p>
                            </div>
                        </div>

                        {/* Current Status */}
                        <div className="flex gap-4 mb-8">
                            <div className="flex flex-col items-center relative">
                                <div className="w-4 h-4 rounded-full bg-[#2b9dee] ring-4 ring-blue-100 dark:ring-blue-900/30 shrink-0 z-10" />
                            </div>
                            <div className="flex flex-col -mt-1.5 p-3 rounded-lg bg-[#2b9dee]/5 border border-[#2b9dee]/10 w-full">
                                <p className="text-xs text-[#2b9dee] font-bold uppercase tracking-wider mb-0.5">
                                    {stepText[stepKey]}
                                </p>
                                <p className="text-[#111518] dark:text-white text-sm font-medium">
                                    {stepKey === 'accepted' && '~8 mins to pickup'}
                                    {stepKey === 'arriving' && 'Waiting for rider to board'}
                                    {stepKey === 'ongoing' && '~14 mins to destination'}
                                    {stepKey === 'completed' && 'Dropped off successfully'}
                                </p>
                            </div>
                        </div>

                        {/* Dropoff */}
                        <div className="flex gap-4">
                            <div className="flex flex-col items-center">
                                <div
                                    className={`w-4 h-4 rounded-full border-[3px] shrink-0 ${tripDone
                                        ? 'bg-green-500 border-green-500'
                                        : 'border-[#2b9dee] bg-white dark:bg-[#1A2632]'
                                        }`}
                                />
                                <span className="text-[10px] text-[#2b9dee] font-medium mt-1">
                                    {isRiderLoading ? (
                                        <span className="block h-4 w-48 rounded-md bg-gray-200 dark:bg-[#2f3e4c] animate-pulse" />
                                    ) : rider?.dropTime && !isNaN(new Date(rider.pickupTime)) ? (
                                        new Date(rider.dropTime).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit"
                                        })
                                    ) : (
                                        "--:--"
                                    )}
                                </span>
                            </div>
                            <div className="flex flex-col -mt-1.5">
                                <p className="text-xs text-[#617989] dark:text-gray-400 font-medium uppercase tracking-wider mb-0.5">
                                    Drop-off
                                </p>
                                <p className="text-[#111518] dark:text-white text-sm font-semibold">
                                    {isRiderLoading ? (
                                        <span className="block h-4 w-48 rounded-md bg-gray-200 dark:bg-[#2f3e4c] animate-pulse" />
                                    ) : (
                                        rider?.dropLocation ?? "Drop location"
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-auto flex flex-col gap-3">
                        {/* Primary Action */}
                        <button
                            onClick={advanceStep}
                            disabled={tripDone}
                            className={`flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold transition-all shadow-lg text-white ${tripDone
                                ? 'bg-green-500 shadow-green-200 dark:shadow-none cursor-default'
                                : 'bg-[#2b9dee] hover:bg-blue-600 shadow-blue-200 dark:shadow-none active:scale-[0.98]'
                                }`}
                        >
                            <span className="material-symbols-outlined text-[20px]">{primarySymbol}</span>
                            <span>{primaryText}</span>
                        </button>

                        {/* Secondary Actions */}
                        <div className="grid grid-cols-3 gap-3">
                            <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-[#f0f3f4] dark:bg-[#23303C] hover:bg-gray-200 dark:hover:bg-[#2f3e4c] transition-colors group">
                                <span className="material-symbols-outlined text-[#111518] dark:text-white group-hover:scale-110 transition-transform">
                                    share_location
                                </span>
                                <span className="text-xs font-semibold text-[#111518] dark:text-white">Share</span>
                            </button>
                            <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-[#f0f3f4] dark:bg-[#23303C] hover:bg-gray-200 dark:hover:bg-[#2f3e4c] transition-colors group">
                                <span className="material-symbols-outlined text-[#111518] dark:text-white group-hover:scale-110 transition-transform">
                                    shield
                                </span>
                                <span className="text-xs font-semibold text-[#111518] dark:text-white">Safety</span>
                            </button>
                            <button
                                disabled={tripDone}
                                className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors group disabled:opacity-40"
                            >
                                <span className="material-symbols-outlined text-red-500 group-hover:scale-110 transition-transform">
                                    cancel
                                </span>
                                <span className="text-xs font-semibold text-red-500">Cancel</span>
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* ── Chat Popup Overlay ── */}
            {chatOpen && (
                <>
                    {/* Backdrop */}
                    <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
                        onClick={() => setChatOpen(false)} />

                    {/* Popup Container */}
                    <div className="fixed z-50 bottom-6 right-6 md:bottom-10 md:right-8 w-[calc(100vw-3rem)] max-w-sm shadow-2xl rounded-2xl overflow-hidden animate-popup-in">
                        {/* Close button sits above the Message component */}
                        <div className="relative">
                            <button onClick={() => setChatOpen(false)}
                                className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 text-[#191b25] transition-colors" >
                                <span className="material-symbols-outlined text-[18px]">close</span>
                            </button>
                            <Message role="captain" name={rider?.riderUsername} image={rider?.image} onClose={()=>setChatOpen(false)} rideId={rideId} />
                        </div>
                    </div>
                </>
            )}

            <style jsx>{`
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down { animation: fade-in-down 0.3s ease-out; }

        @keyframes popup-in {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
        .animate-popup-in { animation: popup-in 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) both; }

        .pulse-ring {
          animation: pulse-blue 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse-blue {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.5); }
        }
      `}</style>
        </div>
    );
}
