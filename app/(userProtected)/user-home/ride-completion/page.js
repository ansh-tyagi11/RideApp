"use client";
import React, { useEffect, useState } from 'react';
import Script from 'next/script';
import { useRideId } from '@/hooks/rideId';
import { initiate, amount } from '@/actions/useractions';
import { redirect, useSearchParams } from 'next/navigation';

export default function RideCompletion() {
    const rideId = useRideId();
    const searchParams = useSearchParams();
    const [tip, setTip] = useState(3);
    const [fareAmount, setFareAmount] = useState(null);
    const [custom, setCustom] = useState(false);
    const [input, setInput] = useState(0);
    const [name, setName] = useState(null);
    const [image, setImage] = useState(null);
    const paymentDone = searchParams.get("paymentdone") === "true";
    const paymentId = searchParams.get("paymentId");

    useEffect(() => {
        if (!rideId) return;
        fetchAmount()
    }, [rideId])

    const fetchAmount = async () => {
        let response = await amount(rideId);
        if (!response?.success || !response?.data) return;

        setFareAmount(response.data.amount);
        setName(response.data.captainUsername)
        setImage(response.data.image)
    }

    const totalAmount = (amount, tip) => {
        return amount + tip;
    }

    const formatInr = (value) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(Number(value) || 0);
    }

    const computedTotal = totalAmount(fareAmount ?? 0, tip);

    const handleCustom = () => {
        setCustom((prev) => !prev);
        if (!custom) {
            return setTip(0)
        }
        return setTip(3);
    }

    const openRazorpay = async (tip) => {
        let a = await initiate(rideId, tip);
        let orderId = a.paymentOptions.id;
        var options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: a.totalAmount,
            currency: "INR",
            name: "RideApp",
            description: "Test Transaction",
            // image: `${image}`,
            order_id: orderId,
            callback_url: "http://localhost:3000/api/razorpay",
            prefill: {
                name: "User",
                email: "user@example.com",
                contact: "9999999999",
            },
            notes: {
                address: "Razorpay Corporate Office",
            },
            theme: {
                color: "#3399cc",
            },
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.open();
    };

    const afterPayment = () => {
        let activeRideId = sessionStorage.getItem("activeRideId");
        let rideData = sessionStorage.getItem("rideData");

        if (activeRideId) {
            sessionStorage.removeItem("activeRideId");
        }
        if (rideData) {
            sessionStorage.removeItem("rideData");
        }
        redirect('/user-home');
    }   

    if (paymentDone) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="relative bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg shadow-md" role="alert">
                    <button onClick={() => afterPayment()} className="absolute right-0 top-0 material-symbols-outlined m-0.5 bg-green-500 hover:bg-green-600 text-white p-1 rounded-full shadow-md transition duration-200">
                        close
                    </button>
                    <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-green-600 mt-0.5">verified</span>
                        <div>
                            <p className="font-bold">Payment completed successfully</p>
                            <p className="text-xs font-medium mt-2">Show this confirmation to your captain for verification.</p>
                            <p className="text-lg font-bold">Total Amount Paid: {formatInr(computedTotal)}</p>
                            {paymentId && (
                                <p className="text-[11px] font-semibold mt-1">Payment ID: {paymentId}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />
            <div className="font-display bg-[#f6f7f8] dark:bg-[#101a22] min-h-screen flex flex-col antialiased">
                {/* Main Content Area */}
                <main className="flex-1 flex items-center justify-center p-4 lg:p-8">
                    {/* Completion Card */}
                    <div className="w-full max-w-120 bg-white dark:bg-[#1e293b] rounded-4xl shadow-[0_20px_40px_-10px_rgba(43,157,238,0.15)] overflow-hidden flex flex-col relative">
                        {/* Confetti / Map Header */}
                        <div className="relative h-40 bg-blue-50 w-full overflow-hidden">
                            {/* Map Background */}
                            <div className="absolute inset-0 bg-cover bg-center opacity-60 mix-blend-multiply"
                                data-alt="Map view of city streets with route line" data-location="New York City"
                                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCe6euYTth3ysGKj6jCb1tZqQCMBQvZwm74O9tS6ax2D4aTSDM1kKsl7612H55cJVXcVpiTfanNINJ3i4otxy45nOV3LE5zd-MnU3JhKo67dCM11IR7NKlTpnX5IcR-CTiwcNH4w6WGXLa-QV3hOyxE6A8unbXribcwGY0Na3ReU3C3oK3v1NY28IzZCYjXdDWQheHKLHlzy-OKOZpwqjyQVsWq72_mfd79bnv6oyXg51WAiHmYf9arOIXinZCbqr6ax-YVS1w2id2d")' }}>
                            </div>
                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-linear-to-b from-transparent to-white/90 dark:to-[#1e293b]"></div>
                            {/* Status Badge */}
                            <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                                <span className="material-symbols-outlined text-green-500 text-xl filled">check_circle</span>
                                <span className="text-sm font-bold text-gray-800 dark:text-white">Ride Completed</span>
                            </div>
                        </div>
                        {/* Profile & Rating Section */}
                        <div className="px-6 pb-8 -mt-12 relative flex flex-col items-center">
                            {/* Driver Avatar */}
                            <div className="relative mb-4">
                                <img className="size-24 rounded-full border-4 border-white dark:border-[#1e293b] bg-cover bg-center shadow-lg" src={image} alt='image'>
                                </img>
                                <div className="absolute bottom-0 right-0 bg-white dark:bg-gray-800 rounded-full p-1 shadow-md border border-gray-100 dark:border-gray-700">
                                    <span className="material-symbols-outlined text-yellow-400 text-sm">star</span>
                                </div>
                            </div>
                            {/* Titles */}
                            <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white text-center mb-1">You've arrived! 🎉</h1>
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-6 text-center">How was your ride with {name}?</p>
                            {/* Rating Stars */}
                            <div className="flex gap-3 mb-8 group">
                                <button className="transition-transform hover:scale-110 focus:outline-none">
                                    <span className="material-symbols-outlined text-4xl text-gray-300 hover:text-yellow-400 cursor-pointer filled"
                                        style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                </button>
                                <button className="transition-transform hover:scale-110 focus:outline-none">
                                    <span className="material-symbols-outlined text-4xl text-gray-300 hover:text-yellow-400 cursor-pointer filled"
                                        style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                </button>
                                <button className="transition-transform hover:scale-110 focus:outline-none">
                                    <span className="material-symbols-outlined text-4xl text-gray-300 hover:text-yellow-400 cursor-pointer filled"
                                        style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                </button>
                                <button className="transition-transform hover:scale-110 focus:outline-none">
                                    <span className="material-symbols-outlined text-4xl text-gray-300 hover:text-yellow-400 cursor-pointer filled"
                                        style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                </button>
                                <button className="transition-transform hover:scale-110 focus:outline-none">
                                    <span className="material-symbols-outlined text-4xl text-gray-300 hover:text-yellow-400 cursor-pointer"
                                        style={{ fontVariationSettings: "'FILL' 0" }}>star</span>
                                </button>
                            </div>
                            {/* Feedback Chips */}
                            <div className="w-full mb-8">
                                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 text-center">Give a
                                    compliment</p>
                                <div className="flex flex-wrap justify-center gap-3">
                                    <button className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-teal-50 hover:bg-teal-100 text-teal-700 transition-colors border border-teal-100">
                                        <span className="material-symbols-outlined text-lg">cleaning_services</span>
                                        <span className="text-sm font-semibold">Clean Car</span>
                                    </button>
                                    <button className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-700 transition-colors border border-amber-100">
                                        <span className="material-symbols-outlined text-lg">chat_bubble</span>
                                        <span className="text-sm font-semibold">Great Chat</span>
                                    </button>
                                    <button className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors border border-indigo-100">
                                        <span className="material-symbols-outlined text-lg">music_note</span>
                                        <span className="text-sm font-semibold">Good Music</span>
                                    </button>
                                    <button className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors border border-emerald-100">
                                        <span className="material-symbols-outlined text-lg">security</span>
                                        <span className="text-sm font-semibold">Safe Driving</span>
                                    </button>
                                </div>
                            </div>
                            {/* Divider */}
                            <div className="w-full h-px bg-gray-100 dark:bg-gray-700 mb-6"></div>
                            {/* Tipping Section */}
                            <div className="w-full mb-6">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-sm font-bold text-gray-900 dark:text-white">Add a tip</span>
                                    <span className="text-xs text-gray-500">100% goes to {name}</span>
                                </div>
                                <div className="grid grid-cols-4 gap-3">
                                    {[1, 3, 5].map((amount) => (
                                        <button
                                            key={amount}
                                            onClick={() => { setTip(amount), setCustom(false) }}
                                            className={`h-12 rounded-xl font-bold text-sm transition-all border
                                                    ${tip === amount ? 'bg-[#2b9dee] text-white shadow-lg shadow-blue-500/30 border-[#2b9dee]'
                                                    : 'border-gray-200 dark:border-gray-600 hover:border-[#2b9dee] hover:bg-[#2b9dee]/5 hover:text-[#2b9dee] text-gray-700 dark:text-gray-300'
                                                }`}>
                                            &#8377;{amount}
                                        </button>
                                    ))}

                                    <button onClick={() => handleCustom()} className={`h-12 rounded-xl font-bold text-sm transition-all border
                                                    ${custom ? 'bg-[#2b9dee] text-white shadow-lg shadow-blue-500/30 border-[#2b9dee]'
                                            : 'border-gray-200 dark:border-gray-600 hover:border-[#2b9dee] hover:bg-[#2b9dee]/5 hover:text-[#2b9dee] text-gray-700 dark:text-gray-300'
                                        }`}>
                                        Custom
                                    </button>
                                </div>
                                {custom && (
                                    <div className='grid grid-cols-2 gap-3 pt-3'>
                                        <input
                                            className="h-12 rounded-xl border dark:border-gray-600 border-[#2b9dee] bg-[#2b9dee]/5 text-[#2b9dee] transition-all font-bold dark:text-gray-300 text-sm p-2 outline-0 appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                            type="Number"
                                            placeholder='Enter Amount'
                                            min="0"
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                        />

                                        <button onClick={() => setTip(Number.parseInt(input))} className="h-12 rounded-xl border dark:border-gray-600 border-[#2b9dee] bg-[#2b9dee]/5 text-[#2b9dee] transition-all font-bold dark:text-gray-300 text-sm">
                                            Add
                                        </button>
                                    </div>
                                )}
                            </div>
                            {/* Fare Summary */}
                            <div className="w-full bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 mb-8">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Ride Fare</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">{formatInr(fareAmount)}</span>
                                </div>
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Tip</span>
                                    <span className="text-sm font-medium text-green-600">+{formatInr(tip)}</span>
                                </div>
                                <div className="w-full h-px bg-gray-200 dark:bg-gray-700 mb-3"></div>
                                <div className="flex justify-between items-center">
                                    <span className="text-base font-bold text-gray-900 dark:text-white">Total</span>
                                    <span className="text-lg font-bold text-gray-900 dark:text-white">{formatInr(computedTotal)}</span>
                                </div>
                            </div>
                            {/* Actions */}
                            <div className="w-full flex flex-col gap-3">
                                <button onClick={() => openRazorpay(tip)} className="w-full h-12 bg-[#2b9dee] hover:bg-blue-500 text-white font-bold rounded-full shadow-lg shadow-blue-500/20 transition-all active:scale-95 flex items-center justify-center gap-2">
                                    <span>Pay</span>
                                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                </button>
                                <button className="w-full h-10 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 font-semibold text-sm rounded-full transition-colors">
                                    Report an issue
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    )
};
