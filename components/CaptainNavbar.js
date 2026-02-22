"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import useCaptain from '@/hooks/useCaptain';

const captainNavbar = () => {
    const pathname = usePathname();
    const isActive = (path) => pathname === path;
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => setIsOpen(!isOpen);
    const { user, loading } = useCaptain();

    if (loading) {
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
                        <div className="flex items-center gap-3">
                            <button className="flex items-center justify-center w-11 h-11 bg-white/90 backdrop-blur rounded-full text-slate-700 hover:bg-white hover:text-[#2b9dee] shadow-sm transition-all">
                                <span className="material-symbols-outlined">notifications</span>
                            </button>
                            <img
                                className="w-11 h-11 rounded-full bg-cover bg-center border-2 border-white shadow-sm cursor-pointer"
                                src={user.image || `https://ui-avatars.com/api/?name=${user.name}`}
                            />
                        </div>
                    </span>
                </div>
                <div className='md:hidden block pointer-events-auto'>
                    <span onClick={toggleSidebar} className="fixed top-7 right-11 material-symbols-outlined cursor-pointer z-60">
                        <span className='flex items-center justify-between gap-2'>
                            <span className='fle justify-center items-center'>
                                <div className={`${isOpen ? 'block text-xs w-full h-5' : 'hidden'}`}>
                                    {user.name.toLowerCase()}
                                </div>
                                <div className={`${isOpen ? 'block text-xs w-full h-5 lowercase' : 'hidden'}`}>
                                    {user.email.toLowerCase()}
                                </div>
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
                        <button onClick={() => signOut({ callbackUrl: "/login" })} className="flex items-center justify-center gap-2 rounded-lg h-10 py-0.5 px-4 bg-blue-500 text-white text-sm font-bold hover:bg-blue-600 transition-colors">
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
