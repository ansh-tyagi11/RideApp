"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { redirect, usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import useCaptain from '@/hooks/useCaptain';
import { toast } from 'react-toastify';

const captainNavbar = () => {
    const pathname = usePathname();
    const isActive = (path) => pathname === path;
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => setIsOpen(!isOpen);
    const { user, loading } = useCaptain();
    const { data: session } = useSession();

    const changeRole = async () => {
        let res = await fetch("/api/captainProfileUpdate", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: user.email })
        });

        let data = await res.json();
        toast.success(data.message)
        redirect("/user-home");
    }

    const handleLogout = async () => {
        if (session) {
            signOut({ callbackUrl: "/login" });
            toast.success("Logged out successfully.");
            return;
        }

        let res = await fetch("/api/captainProfileUpdate", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) {
            toast.error("Logout failed");
            return;
        }

        const data = await res.json();

        if (data.success) {
            toast.success(data.message);
            router.push("/login");
        } else {
            toast.error(data.message);
        }
        redirect("/login");
    }

    if (loading || !user) {
        return (
            <div className="flex items-center justify-center h-screen">
                <span className="animate-spin material-symbols-outlined text-4xl text-[#137fec]">
                    progress_activity
                </span>
            </div>
        );
    }

    return (
        <>
            {/* Top Navigation */}
            <header className="fixed md:absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 pointer-events-none">
                <div className="pointer-events-auto flex items-center gap-3 bg-white/80 backdrop-blur-md rounded-full px-5 py-2 shadow-sm border border-white/50">
                    <div className="p-1.5 bg-[#2b9dee] rounded-full text-white">
                        <span className="material-symbols-outlined text-[20px]">local_taxi</span>
                    </div>
                    <h2 className="text-slate-900 text-lg font-bold tracking-tight">RideApp</h2>
                </div>
                <div className="pointer-events-auto flex items-center gap-4">
                    <nav className="hidden md:flex bg-white/80 backdrop-blur-md rounded-full px-2 p-1.5 shadow-sm border border-white/50">
                        <Link className={`px-5 py-2 text-sm  ${isActive('/captain-home') ? 'font-semibold text-slate-800 bg-white rounded-full shadow-sm' : 'font-medium text-slate-600 hover:text-[#2b9dee] transition-colors'} `}
                            href="/captain-home">
                            Home
                        </Link>
                        <Link className={`px-5 py-2 text-sm  ${isActive('/captain-rides') ? 'font-semibold text-slate-800 bg-white rounded-full shadow-sm' : 'font-medium text-slate-600 hover:text-[#2b9dee] transition-colors'} `} href="/captain-rides">
                            Rides
                        </Link>
                        <Link className={`px-5 py-2 text-sm  ${isActive('/captain-payment') ? 'font-semibold text-slate-800 bg-white rounded-full shadow-sm' : 'font-medium text-slate-600 hover:text-[#2b9dee] transition-colors'} `} href="/captain-payment">
                            Payment
                        </Link>
                        <Link className={`px-5 py-2 text-sm  ${isActive('/captain-profile') ? 'font-semibold text-slate-800 bg-white rounded-full shadow-sm' : 'font-medium text-slate-600 hover:text-[#2b9dee] transition-colors'} `} href="/captain-profile">
                            Profile
                        </Link>
                    </nav>
                    <span className='md:block hidden'>
                        <div className="group flex items-center gap-3">
                            <button className="flex items-center justify-center w-11 h-11 bg-white/90 backdrop-blur rounded-full text-slate-700 hover:bg-white hover:text-[#2b9dee] shadow-sm transition-all">
                                <span className="material-symbols-outlined">notifications</span>
                            </button>
                            <img
                                className="w-11 h-11 rounded-full bg-cover bg-center border-2 border-white shadow-sm cursor-pointer"
                                src={user.image || `https://ui-avatars.com/api/?name=${user.name}`}
                            />
                            <div className='group-hover:block hover:block hidden absolute top-18 right-11 bg-[#f6f7f8] rounded-2xl p-4 shadow-lg w-62.5'>
                                <button onClick={changeRole} className="cursor-pointer border text-sm font-semibold bg-white text-slate-800 m-2 ml-0 w-full p-3 rounded-xl shadow-sm">
                                    Switch To Ride
                                </button>
                                <div className="text-sm font-semibold text-slate-800 bg-white m-2 ml-0 w-full p-3 rounded-xl shadow-sm">
                                    Hi, {user.name}
                                </div>
                                <div className="text-sm font-semibold text-slate-800 bg-white m-2 mt-4 ml-0 w-full p-3 rounded-xl shadow-sm">
                                    {user.email}
                                </div>
                                <button onClick={handleLogout} className="bg-white cursor-pointer flex items-center justify-center text-sm font-semibold text-slate-800 m-2 mt-4 ml-0 w-full p-3 rounded-xl shadow-sm hover:bg-[#2b9dee] hover:text-white transition-colors">
                                    Log Out
                                    <span className='material-symbols-outlined'>logout</span>
                                </button>
                            </div>
                        </div>
                    </span>
                </div>
                <div className='md:hidden block pointer-events-auto'>
                    <span onClick={toggleSidebar} className="fixed top-7 right-11 cursor-pointer z-60">
                        <span className='flex items-center justify-between'>
                            <span className='flex-col w-38'>
                                <div className={`${isOpen ? 'flex text-sm font-semibold m-2 w-full h-5 text-slate-600 border' : 'hidden'}`}>
                                    Hi, {user.name}
                                </div>
                                <div className={`${isOpen ? 'block text-sm font-semibold w0 h-5 text-slate-600 break-normal border m-2' : 'hidden'}`}>{user.email}</div>
                            </span>
                            <img
                                src={user.image || `https://ui-avatars.com/api/?name=${user.name}`}
                                alt="captain-profile"
                                className="w-11 h-11 rounded-full bg-cover bg-center border-2 border-white shadow-sm cursor-pointer"
                            />
                        </span>
                    </span>
                    {isOpen && (<div className="h-screen fixed inset-0 bg-black/50 z-40" onClick={toggleSidebar} />)}
                    <aside className={`fixed top-0 right-0 h-screen justify-between w-64 flex bg-white flex-col shadow-xl pt-14 p-6 z-50 transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
                        <nav className="flex flex-col gap-3 pt-10">
                            <Link onClick={toggleSidebar} className={`px-5 py-2 text-sm  ${isActive('/captain-home') ? 'font-semibold bg-blue-500 text-white rounded-full shadow-sm' : 'font-medium text-slate-600 hover:text-[#2b9dee] transition-colors'}`}
                                href="/captain-home">
                                Home
                            </Link>
                            <Link onClick={toggleSidebar} className={`px-5 py-2 text-sm  ${isActive('/captain-rides') ? 'font-semibold text-white bg-blue-500 rounded-full shadow-sm' : 'font-medium text-slate-600 hover:text-[#2b9dee] transition-colors'}`} href="/captain-rides">
                                Rides
                            </Link>
                            <Link onClick={toggleSidebar} className={`px-5 py-2 text-sm  ${isActive('/captain-payment') ? 'font-semibold text-white bg-blue-500 rounded-full shadow-sm' : 'font-medium text-slate-600 hover:text-[#2b9dee] transition-colors'}`} href="/captain-payment">
                                Payment
                            </Link>
                            <Link onClick={toggleSidebar} className={`px-5 py-2 text-sm  ${isActive('/captain-profile') ? 'font-semibold text-white bg-blue-500 rounded-full shadow-sm' : 'font-medium text-slate-600 hover:text-[#2b9dee] transition-colors'}`} href="/captain-profile">
                                Profile
                            </Link>
                        </nav>
                        <button onClick={changeRole} className="flex items-center justify-center gap-2 rounded-lg h-10 py-0.5 px-4 bg-blue-500 text-white text-sm font-bold hover:bg-blue-600 transition-colors">
                            Switch To Ride
                        </button>
                        <button onClick={handleLogout} className="flex items-center justify-center gap-2 rounded-lg h-10 py-0.5 px-4 bg-blue-500 text-white text-sm font-bold hover:bg-blue-600 transition-colors">
                            Log Out
                            <span className='material-symbols-outlined'>logout</span>
                        </button>
                    </aside>
                </div>
            </header >
        </>
    )
}

export default captainNavbar
