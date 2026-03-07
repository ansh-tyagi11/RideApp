'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import useUser from '@/hooks/useUser';

export default function CaptainSearchingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const rideId = searchParams.get("rideId");
  const [pickup, setPickup] = useState("")
  const [drop, setDrop] = useState("")
  const [amount, setAmount] = useState("")
  const { user, loading } = useUser();

  useEffect(() => {
    if (loading) return;
    console.log(user.email)

    if (!rideId) {
      toast.error("No such ride is found.")
      return router.push("/user-home/ride-selection")
    }
    searchRide()
  }, [loading, user])

  const searchRide = async () => {
    const response = await fetch(`/api/mappls/rides?rideId=${rideId}&userEmail=${user?.email}`);
    const data = await response.json();

    if (!data.success) {
      toast.error(data.message || "Failed to fetch ride details.");
      router.push("/user-home/ride-selection");
      return;
    }

    setPickup(data.pickupLocation);
    setDrop(data.dropLocation);
    setAmount(data.amount);

    if (data.status === "accepted") {
      router.push(`/user-home/ride?rideId=${rideId}`);
    }

    if (data.status === "cancelled") {
      router.push("/user-home/ride-selection");
    }
  };

  const cancelRide = async () => {
    await fetch(`/api/mappls/rides?rideId=${rideId}`, {
      method: "PUT"
    })
    toast.success("Ride cancelled successfully.")
    router.push("/user-home/ride-selection")
  }

  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex items-center gap-3 rounded-full bg-[#2b9dee]/10 px-4 py-2">
          <span className="material-symbols-outlined text-[#2b9dee] animate-spin">
            hourglass_top
          </span>
          <span className="text-sm font-medium text-[#2b9dee]">
            Loading ride details...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-screen w-full flex-col overflow-x-auto">
      {/* Main Content Wrapper */}
      <main className="relative flex grow flex-col items-center justify-center p-4">
        {/* Map Background with Soft Overlay */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD2WNcjeOBkQGWbDQz26fF_3qQb7ughAU1o6L4FW0O_YIaD_36p53RKtYdDnWPx16F-xPJmo2FMBTs7HR42qth7X9umD8oVdk_8s3Td4ZIzYw4MlqdF_d67OE0MLj9ZTZphh9eTqRji45HI8yqkVkbiHM0qlaD0--Pn4fer-0L6Ny1BQtYhB-ibqSEZxMqBHlw_z6IN8YJB5uuCmzJuUy6B90yons0WS6OLqhaSSWw8Y2CU1QOrUEBkCSQzd9Xhmesxv1ez-xNghUi2")',
            }}
          />
          {/* Gradients to fade map for readability */}
          <div className="absolute inset-0 bg-linear-to-b from-white/60 via-white/80 to-white/90 dark:from-[#101a22]/60 dark:via-[#101a22]/80 dark:to-[#101a22]/95 backdrop-blur-[2px]" />
        </div>

        {/* Central Card Container */}
        <div className="mt-22 z-10 w-full max-w-110 flex flex-col gap-0 bg-white dark:bg-[#1a2632] rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-hidden border border-slate-100 dark:border-gray-700">
          {/* Radar Animation Area */}
          <div className="relative flex flex-col items-center justify-center pt-10 pb-6 bg-linear-to-b from-white to-slate-50 dark:from-[#1a2632] dark:to-[#151f28]">
            {/* Pulsing Radar Visual */}
            <div className="relative flex items-center justify-center size-48">
              {/* Outer Rings */}
              <div className="absolute size-48 rounded-full bg-[#2b9dee]/5 animate-pulse-slow" />
              <div className="absolute size-36 rounded-full bg-[#2b9dee]/10 animate-[pulse_2s_ease-in-out_infinite]" />
              <div className="absolute size-24 rounded-full bg-[#2b9dee]/20" />

              {/* Center Core */}
              <div className="relative flex size-14 items-center justify-center rounded-full bg-[#2b9dee] text-white shadow-lg shadow-[#2b9dee]/30 z-10">
                <span className="material-symbols-outlined text-3xl animate-spin"
                  style={{ animationDuration: '3s' }}>
                  radar
                </span>
              </div>

              {/* Floating Dots (Decorative) */}
              <div className="absolute top-4 right-10 size-2 rounded-full bg-teal-400 animate-bounce"
                style={{ animationDelay: '0.1s' }}
              />
              <div className="absolute bottom-6 left-8 size-2 rounded-full bg-yellow-400 animate-bounce"
                style={{ animationDelay: '0.3s' }}
              />
              <div className="absolute top-1/2 left-2 size-1.5 rounded-full bg-[#2b9dee] animate-bounce"
                style={{ animationDelay: '0.5s' }}
              />
            </div>

            {/* Status Text */}
            <div className="flex flex-col items-center gap-2 mt-2 px-6 text-center">
              <h1 className="text-2xl font-bold text-[#111518] dark:text-white tracking-tight">
                Looking for nearby drivers...
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                Hang tight, we're connecting you to the best ride.
              </p>
              <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#e0f2fe] px-3 py-1 dark:bg-[#2b9dee]/20">
                <span className="material-symbols-outlined text-[#2b9dee] text-sm">
                  schedule
                </span>
                <span className="text-[#2b9dee] text-xs font-bold uppercase tracking-wide">
                  Est. wait: 3 min
                </span>
              </div>
            </div>
          </div>

          {/* Trip Details Section */}
          <div className="px-6 pb-6 pt-2 bg-white dark:bg-[#1a2632]">
            <div className="flex flex-col gap-4 rounded-xl bg-slate-50 p-5 dark:bg-[#131d26]">
              {/* Location Timeline */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center pt-1 gap-1">
                  <div className="size-3 rounded-full border-[3px] border-[#2b9dee] bg-white dark:bg-transparent" />
                  <div className="w-0.5 grow bg-slate-200 rounded-full dark:bg-slate-700" />
                  <div className="size-3 rounded-full bg-[#2b9dee] shadow-sm" />
                </div>
                <div className="flex flex-col gap-5 flex-1 pb-1">
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
                      Pick up
                    </p>
                    <p className="text-[#111518] dark:text-white font-semibold text-sm leading-tight">
                      {pickup}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
                      Drop off
                    </p>
                    <p className="text-[#111518] dark:text-white font-semibold text-sm leading-tight">
                      {drop}
                    </p>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px w-full bg-slate-200 dark:bg-slate-700" />

              {/* Payment Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-8 items-center justify-center rounded-full bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                    <span className="material-symbols-outlined text-lg">payments</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#111518] dark:text-white">
                      Visa •••• 4242
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Personal</p>
                  </div>
                </div>
                <p className="text-base font-bold text-[#111518] dark:text-white">₹ {amount}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-col gap-3">
              <button onClick={cancelRide} className="group flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3.5 transition-all hover:bg-slate-50 hover:border-slate-300 dark:bg-transparent dark:border-slate-600 dark:hover:bg-slate-800">
                <span className="material-symbols-outlined text-slate-600 dark:text-slate-300 transition-colors group-hover:text-red-500">
                  close
                </span>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200 transition-colors group-hover:text-red-600">
                  Cancel Ride
                </span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
