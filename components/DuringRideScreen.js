'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Message from '@/components/message';
import { forVerifyRideId } from '@/actions/useractions';

export default function DuringRide() {
  const [isActive, setIsActive] = useState(false)
  const [rideId, setRideId] = useState(null);
  const [open, setOpen] = useState(false);
  const search = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    let rideId = search.get("rideId");
    if (!rideId) {
      setStep(0);
    } else {
      setRideId(rideId);
      console.log("Current Ride ID:", rideId);
    }
    verify(rideId);
  }, [])

  const verify = async (rideId) => {
    let response = await forVerifyRideId(rideId);
    if (!response.success) return router.push("/ride-selection");
  }

  const handleChange = () => {
    setIsActive(!isActive)
  }

  return (
    <div className="bg-[#f6f7f8] dark:bg-[#101a22] text-[#111518] font-display h-screen w-screen md:overflow-hidden flex relative flex-col md:flex-row overflow-x-hidden">

      {/* Left Panel: Map & Floating UI */}
      <main className="flex-1 relative bg-gray-100 md:h-full w-full md:pt-0">
        {/* Map Background */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center opacity-90"
          style={{
            backgroundImage:
              'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD2WNcjeOBkQGWbDQz26fF_3qQb7ughAU1o6L4FW0O_YIaD_36p53RKtYdDnWPx16F-xPJmo2FMBTs7HR42qth7X9umD8oVdk_8s3Td4ZIzYw4MlqdF_d67OE0MLj9ZTZphh9eTqRji45HI8yqkVkbiHM0qlaD0--Pn4fer-0L6Ny1BQtYhB-ibqSEZxMqBHlw_z6IN8YJB5uuCmzJuUy6B90yons0WS6OLqhaSSWw8Y2CU1QOrUEBkCSQzd9Xhmesxv1ez-xNghUi2")',
          }}
        />

        {/* SVG Route Overlay (Decorative Simulation) */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Simulated path */}
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
          {/* Car Icon Marker moving on map */}
          <g transform="translate(500, 500)">
            <circle
              className="pulse-ring"
              cx="0"
              cy="0"
              fill="#2b9dee"
              fillOpacity="0.2"
              r="40"
            />
            <circle
              cx="0"
              cy="0"
              fill="#fff"
              r="16"
              stroke="#2b9dee"
              strokeWidth="3"
            />
          </g>
        </svg>

        {/* Floating Top Banner */}
        <div className="pt-20 md:pt-0 absolute top-6 left-1/2 -translate-x-1/2 w-[90%] md:w-auto z-10">
          <div className="flex items-center gap-4 bg-white/90 dark:bg-[#1A2632]/95 backdrop-blur-md rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-2 pr-6 border border-white/50 animate-fade-in-down">
            <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-green-600 dark:text-green-400">
                schedule
              </span>
            </div>
            <div className="flex flex-col">
              <h3 className="text-base font-bold text-[#111518] dark:text-white leading-tight">
                Ride in progress
              </h3>
              <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                ETA 14 mins{' '}
                <span className="text-[#617989] font-normal">• On time</span>
              </p>
            </div>
          </div>
        </div>

        {/* Floating Map Controls */}
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

        {/* Map Marker: Start Point */}
        <div className="absolute top-75 left-200 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-0">
          <div className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center border-2 border-[#111518]">
            <span className="material-symbols-outlined text-sm font-bold">
              location_on
            </span>
          </div>
        </div>
      </main>

      {/* Right Panel: Ride Information & Controls */}
      <aside className={`w-full md:w-105 rounded-t-4xl md:rounded-t-none bg-white dark:bg-[#1A2632] absolute bottom-0 z-20 md:h-full flex flex-col shadow-xl md:relative shrink-0 overflow-y-auto ${isActive ? 'h-[60%]' : 'h-[25%]'}`}>
        {/* Header */}
        <div onClick={handleChange} className="p-6 pb-2 z-30 sticky top-0 bg-white">
          <div className="flex items-center justify-center gap-3 mb-6">
            <button className="flex items-center justify-center w-20 h-1 rounded-full bg-gray-200 dark:bg-[#101a22] text-[#111518] hover:bg-gray-200 transition-colors"></button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 px-6 md:pt-10 flex flex-col gap-6 pb-8">
          {/* Driver Card */}
          <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm dark:bg-[#23303C] dark:border-[#2f3e4c]">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                <div
                  className="bg-center bg-no-repeat bg-cover rounded-full w-16 h-16 shadow-inner"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDjXMW-0VSQCPdblnTO-LFGAMcuGqEU9bMGJ2m2tHkhwplMQvLvOhKtnlKtLx0EbsMKfMJ58p8iCKoXVTwCDO6dZAPGmE5g5JBJtUdJPRQNmmcSAbqj5z3urYzvp3ajqtyoPyA5g9vm8c9sqKH4zCPIzzfX-5_ejAoFZgNzzkIBkrN1c6y152iCQ80ZH_tX05UziqWyYn3dTS1G3J8D2UUkJJsh5XkRnyHh5Rl6dUWf2UZBMioKTS5U5e-4iPGVpVqXlW0Kid-AId3J")',
                  }}
                />
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
                <h2 className="text-lg font-bold text-[#111518] dark:text-white leading-tight">
                  Sarah Jenkins
                </h2>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-yellow-500 font-bold text-sm">4.9</span>
                  <span className="text-gray-400 text-xs">•</span>
                  <span className="text-[#617989] dark:text-gray-400 text-sm font-medium">
                    500+ rides
                  </span>
                </div>
              </div>
              <div className="ml-auto flex gap-2">
                <button onClick={() => setOpen(!open)} className="w-10 h-10 flex items-center justify-center rounded-full bg-[#f0f3f4] dark:bg-[#1A2632] text-[#111518] dark:text-white hover:bg-[#2b9dee]/20 hover:text-[#2b9dee] transition-all">
                  <span className="material-symbols-outlined text-[20px]">chat</span>
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#f0f3f4] dark:bg-[#1A2632] text-[#111518] dark:text-white hover:bg-[#2b9dee]/20 hover:text-[#2b9dee] transition-all">
                  <span className="material-symbols-outlined text-[20px]">call</span>
                </button>
              </div>
            </div>
            <div className="h-px bg-gray-100 dark:bg-[#2f3e4c] w-full mb-4" />

            {/* Car Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-[#2b9dee]">
                  <span className="material-symbols-outlined text-[24px]">
                    directions_car
                  </span>
                </div>
                <div>
                  <p className="text-[#111518] dark:text-white font-semibold text-sm">
                    White Toyota Prius
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="bg-gray-100 dark:bg-[#1A2632] text-[#617989] dark:text-gray-300 text-xs font-bold px-1.5 py-0.5 rounded uppercase tracking-wide">
                      ABC-1234
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-[#617989] dark:text-gray-400">Comfort</p>
              </div>
            </div>
          </div>

          {/* Timeline / Route */}
          <div className="relative pl-2 py-2">
            {/* Vertical Line */}
            <div className="absolute left-4.75 top-3 bottom-8 w-0.5 bg-gray-200 dark:bg-[#2f3e4c] -z-10" />

            {/* Pickup */}
            <div className="flex gap-4 mb-8 group">
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 rounded-full border-[3px] border-gray-300 bg-white dark:border-gray-600 dark:bg-[#1A2632] shrink-0" />
                <span className="text-[10px] text-gray-400 font-medium mt-1">10:00</span>
              </div>
              <div className="flex flex-col -mt-1.5">
                <p className="text-xs text-[#617989] dark:text-gray-400 font-medium uppercase tracking-wider mb-0.5">
                  Pick-up
                </p>
                <p className="text-[#111518] dark:text-white text-sm font-semibold">
                  123 Maple Street, Downtown
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
                  On the way
                </p>
                <p className="text-[#111518] dark:text-white text-sm font-medium">
                  ~14 mins remaining
                </p>
              </div>
            </div>

            {/* Dropoff */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 rounded-full border-[3px] border-[#2b9dee] bg-white dark:bg-[#1A2632] shrink-0" />
                <span className="text-[10px] text-[#2b9dee] font-medium mt-1">10:14</span>
              </div>
              <div className="flex flex-col -mt-1.5">
                <p className="text-xs text-[#617989] dark:text-gray-400 font-medium uppercase tracking-wider mb-0.5">
                  Drop-off
                </p>
                <p className="text-[#111518] dark:text-white text-sm font-semibold">
                  456 Tech Park Ave, Suite 200
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <button className="group flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 transition-all hover:bg-slate-50 hover:border-slate-300 dark:bg-transparent dark:border-slate-600 dark:hover:bg-slate-800">
              <span className="material-symbols-outlined text-slate-600 dark:text-slate-300 transition-colors group-hover:text-red-500">
                close
              </span>
              <span className="text-sm font-bold text-slate-700 dark:text-slate-200 transition-colors group-hover:text-red-600">
                Cancel Ride
              </span>
            </button>
          </div>

          {/* Action Cluster */}
          <div className="mt-auto">
            <p className="text-sm font-medium text-[#617989] mb-3 px-1">
              Safety &amp; Options
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button className="col-span-2 flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-[#2b9dee] hover:bg-blue-600 text-white font-bold transition-all shadow-lg shadow-blue-200 dark:shadow-none">
                <span className="material-symbols-outlined text-[20px]">
                  share_location
                </span>
                <span>Share Trip Status</span>
              </button>
              <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-[#f0f3f4] dark:bg-[#23303C] hover:bg-gray-200 dark:hover:bg-[#2f3e4c] transition-colors group">
                <span className="material-symbols-outlined text-[#111518] dark:text-white group-hover:scale-110 transition-transform">
                  shield
                </span>
                <span className="text-xs font-semibold text-[#111518] dark:text-white">
                  Safety
                </span>
              </button>
              <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-[#f0f3f4] dark:bg-[#23303C] hover:bg-gray-200 dark:hover:bg-[#2f3e4c] transition-colors group">
                <span className="material-symbols-outlined text-[#111518] dark:text-white group-hover:scale-110 transition-transform">
                  support_agent
                </span>
                <span className="text-xs font-semibold text-[#111518] dark:text-white">
                  Support
                </span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
            onClick={() => setOpen(false)} />

          {/* Popup Container */}
          <div className="fixed z-50 bottom-6 right-6 md:bottom-10 md:right-8 w-[calc(100vw-3rem)] max-w-sm shadow-2xl rounded-2xl overflow-hidden animate-popup-in">
            {/* Close button sits above the Message component */}
            <div className="relative">
              <button onClick={() => setOpen(false)}
                className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 text-[#191b25] transition-colors" >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
              <Message role="user" rideId={rideId} />
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-down {
          animation: fade-in-down 0.3s ease-out;
        }

        .pulse-ring {
          animation: pulse-blue 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse-blue {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.5);
          }
        }
      `}</style>
    </div>
  );
}