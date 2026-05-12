"use client";
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import useCaptain from '@/hooks/useCaptain';
import { toast } from 'react-toastify';

const captainNavbar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const isActive = (path) => pathname === path;
    const [isOpen, setIsOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef(null);

    const toggleSidebar = () => setIsOpen(!isOpen);
    const { user, loading } = useCaptain();
    const { data: session } = useSession();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const changeRole = async () => {
        let res = await fetch("/api/captainProfileUpdate", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: user.email })
        });

        let data = await res.json();
        toast.success(data.message);
        router.push("/user-home");
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
        data.success ? toast.success(data.message) : toast.error(data.message);
        router.push("/login");
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

                {/* Logo */}
                <div className="pointer-events-auto flex items-center gap-3 bg-white/80 backdrop-blur-md rounded-full px-5 py-2 shadow-sm border border-white/50">
                    <div className="p-1.5 bg-[#2b9dee] rounded-full text-white">
                        <span className="material-symbols-outlined text-[20px]">local_taxi</span>
                    </div>
                    <h2 className="text-slate-900 text-lg font-bold tracking-tight">RideApp</h2>
                </div>

                {/* Desktop Nav */}
                <div className="pointer-events-auto flex items-center gap-4">
                    <nav className="hidden md:flex bg-white/80 backdrop-blur-md rounded-full px-2 p-1.5 shadow-sm border border-white/50">
                        <Link
                            className={`px-5 py-2 text-sm ${isActive('/captain-home') ? 'font-semibold text-slate-800 bg-white rounded-full shadow-sm' : 'font-medium text-slate-600 hover:text-[#2b9dee] transition-colors'}`}
                            href="/captain-home">
                            Home
                        </Link>
                        <Link
                            className={`px-5 py-2 text-sm ${isActive('/captain-rides') ? 'font-semibold text-slate-800 bg-white rounded-full shadow-sm' : 'font-medium text-slate-600 hover:text-[#2b9dee] transition-colors'}`}
                            href="/captain-rides">
                            Rides
                        </Link>
                        <Link
                            className={`px-5 py-2 text-sm ${isActive('/captain-payment') ? 'font-semibold text-slate-800 bg-white rounded-full shadow-sm' : 'font-medium text-slate-600 hover:text-[#2b9dee] transition-colors'}`}
                            href="/captain-payment">
                            Payment
                        </Link>
                        <Link
                            className={`px-5 py-2 text-sm ${isActive('/captain-profile') ? 'font-semibold text-slate-800 bg-white rounded-full shadow-sm' : 'font-medium text-slate-600 hover:text-[#2b9dee] transition-colors'}`}
                            href="/captain-profile">
                            Profile
                        </Link>
                    </nav>

                    {/* Desktop: Notification + Profile */}
                    <span className="md:block hidden">
                        <div className="flex items-center gap-3">

                            {/* Notification Bell */}
                            <button className="flex items-center justify-center w-11 h-11 bg-white/90 backdrop-blur rounded-full text-slate-700 hover:bg-white hover:text-[#2b9dee] shadow-sm transition-all">
                                <span className="material-symbols-outlined">notifications</span>
                            </button>

                            {/* Profile Dropdown */}
                            <div className="relative" ref={profileRef}>
                                <img
                                    onClick={() => setProfileOpen((prev) => !prev)}
                                    className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm cursor-pointer"
                                    src={user.image || `https://ui-avatars.com/api/?name=${user.name}`}
                                    alt={user.name}
                                />

                                {profileOpen && (
                                    <div className="absolute top-14 right-0 bg-[#f6f7f8] rounded-2xl p-4 shadow-lg w-64 z-60">
                                        <div className="text-sm font-semibold text-slate-800 bg-white mb-2 w-full p-3 rounded-xl shadow-sm">
                                            Hi, {user.name}
                                        </div>
                                        <div className="text-sm font-semibold text-slate-800 bg-white mb-2 w-full p-3 rounded-xl shadow-sm">
                                            {user.email}
                                        </div>
                                        <button
                                            onClick={changeRole}
                                            className="cursor-pointer border text-sm font-semibold bg-white text-slate-800 mb-2 w-full p-3 rounded-xl shadow-sm hover:bg-[#2b9dee] hover:text-white transition-colors">
                                            Switch To Ride
                                        </button>
                                        <button
                                            onClick={handleLogout}
                                            className="bg-white cursor-pointer flex items-center justify-center text-sm font-semibold text-slate-800 w-full p-3 rounded-xl shadow-sm hover:bg-[#2b9dee] hover:text-white transition-colors">
                                            Log Out
                                            <span className="material-symbols-outlined ml-1">logout</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </span>
                </div>

                {/* Mobile Hamburger */}
                <div className="md:hidden block pointer-events-auto">
                    <span
                        onClick={toggleSidebar}
                        className="fixed top-7 right-11 cursor-pointer z-60">
                        <img
                            src={user.image || `https://ui-avatars.com/api/?name=${user.name}`}
                            alt="captain-profile"
                            className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm cursor-pointer"
                        />
                    </span>

                    {/* Backdrop */}
                    {isOpen && (
                        <div className="h-screen fixed inset-0 bg-black/50 z-40" onClick={toggleSidebar} />
                    )}

                    {/* Sidebar */}
                    <aside className={`fixed top-0 right-0 h-screen justify-between w-64 flex bg-white flex-col shadow-xl pt-14 p-6 z-50 transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
                        {/* User info at top of sidebar */}
                        <div className="flex items-center gap-3 mb-4">
                            <img
                                src={user.image || `https://ui-avatars.com/api/?name=${user.name}`}
                                alt={user.name}
                                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                            />
                            <div>
                                <p className="text-sm font-semibold text-slate-800">{user.name}</p>
                                <p className="text-xs text-slate-500 truncate max-w-35">{user.email}</p>
                            </div>
                        </div>

                        <nav className="flex flex-col gap-3 pt-4">
                            <Link onClick={toggleSidebar} className={`px-5 py-2 text-sm ${isActive('/captain-home') ? 'font-semibold bg-blue-500 text-white rounded-full shadow-sm' : 'font-medium text-slate-600 hover:text-[#2b9dee] transition-colors'}`} href="/captain-home">
                                Home
                            </Link>
                            <Link onClick={toggleSidebar} className={`px-5 py-2 text-sm ${isActive('/captain-rides') ? 'font-semibold text-white bg-blue-500 rounded-full shadow-sm' : 'font-medium text-slate-600 hover:text-[#2b9dee] transition-colors'}`} href="/captain-rides">
                                Rides
                            </Link>
                            <Link onClick={toggleSidebar} className={`px-5 py-2 text-sm ${isActive('/captain-payment') ? 'font-semibold text-white bg-blue-500 rounded-full shadow-sm' : 'font-medium text-slate-600 hover:text-[#2b9dee] transition-colors'}`} href="/captain-payment">
                                Payment
                            </Link>
                            <Link onClick={toggleSidebar} className={`px-5 py-2 text-sm ${isActive('/captain-profile') ? 'font-semibold text-white bg-blue-500 rounded-full shadow-sm' : 'font-medium text-slate-600 hover:text-[#2b9dee] transition-colors'}`} href="/captain-profile">
                                Profile
                            </Link>
                        </nav>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={changeRole}
                                className="flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-blue-500 text-white text-sm font-bold hover:bg-blue-600 transition-colors">
                                Switch To Ride
                            </button>
                            <button
                                onClick={handleLogout}
                                className="flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-blue-500 text-white text-sm font-bold hover:bg-blue-600 transition-colors">
                                Log Out
                                <span className="material-symbols-outlined">logout</span>
                            </button>
                        </div>
                    </aside>
                </div>

            </header>
        </>
    );
}

export default captainNavbar;