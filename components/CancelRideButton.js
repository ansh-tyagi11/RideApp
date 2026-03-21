import React from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function CancelRideButton({ rideId }) {
    const router = useRouter();

    const cancelRide = async () => {
        await fetch(`/api/mappls/rides?rideId=${rideId}`, {
            method: "PUT"
        })
        toast.success("Ride cancelled successfully.")
        router.push("/user-home/ride-selection")
    }
    return (
        <>
            <div className="mt-6 flex flex-col gap-3">
                <button onClick={cancelRide} className="group flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 transition-all hover:bg-slate-50 hover:border-slate-300 dark:bg-transparent dark:border-slate-600 dark:hover:bg-slate-800">
                    <span className="material-symbols-outlined text-slate-600 dark:text-slate-300 transition-colors group-hover:text-red-500">
                        close
                    </span>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200 transition-colors group-hover:text-red-600">
                        Cancel Ride
                    </span>
                </button>
            </div>
        </>
    )
}