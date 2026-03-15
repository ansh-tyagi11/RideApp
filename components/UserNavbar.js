"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import useUser from '@/hooks/useUser';
import { toast } from 'react-toastify';

const userNavbar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const isActive = (path) => pathname === path;
    const [isOpen, setIsOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    const toggleSidebar = () => setIsOpen(!isOpen);
    const { user, loading } = useUser();
    const { data: session } = useSession();

    const changeRole = async () => {
        let res = await fetch("/api/userProfileUpdate", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: user.email })
        });

        let data = await res.json();
        toast.success(data.message);
        router.push("/captain-home");
    }

    const handleLogout = async () => {
        if (session) {
            signOut({ callbackUrl: "/login" });
            return toast.success("Logged out successfully.");
        }

        let res = await fetch("/api/userProfileUpdate", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        });
        let data = await res.json();
        data.success ? toast.success(data.message) : toast.error(data.message);
        router.push("/login");
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <span className="animate-spin material-symbols-outlined text-4xl text-[#137fec]">
                    progress_activity
                </span>
            </div>
        );
    }

    if (!user) return null;

    return (
        <>
            {/* Top Navigation */}
            <header className="md:absolute fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 pointer-events-auto">

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
                            className={`px-5 py-2 text-sm ${isActive('/user-home') ? 'font-semibold text-slate-800 bg-white rounded-full shadow-sm' : 'font-medium text-slate-600 hover:text-[#2b9dee] transition-colors'}`}
                            href="/user-home">
                            Home
                        </Link>
                        <Link
                            className={`px-5 py-2 text-sm ${isActive('/user-rides') ? 'font-semibold text-slate-800 bg-white rounded-full shadow-sm' : 'font-medium text-slate-600 hover:text-[#2b9dee] transition-colors'}`}
                            href="/user-rides">
                            Rides
                        </Link>
                        <Link
                            className={`px-5 py-2 text-sm ${isActive('/user-payment') ? 'font-semibold text-slate-800 bg-white rounded-full shadow-sm' : 'font-medium text-slate-600 hover:text-[#2b9dee] transition-colors'}`}
                            href="/user-payment">
                            Payment
                        </Link>
                        <Link
                            className={`px-5 py-2 text-sm ${isActive('/user-profile') ? 'font-semibold text-slate-800 bg-white rounded-full shadow-sm' : 'font-medium text-slate-600 hover:text-[#2b9dee] transition-colors'}`}
                            href="/user-profile">
                            Profile
                        </Link>
                    </nav>

                    {/* Desktop: Notification + Profile */}
                    <span className="md:block hidden">
                        <div className="flex items-center gap-3">

                            {/* Notification Bell */}
                            <div className="relative">
                                <button
                                    onClick={() => {
                                        setNotifOpen((prev) => !prev);
                                        setProfileOpen(false);
                                    }}
                                    className="flex items-center justify-center w-11 h-11 bg-white/90 backdrop-blur rounded-full text-slate-700 hover:bg-white hover:text-[#2b9dee] shadow-sm transition-all">
                                    <span className="material-symbols-outlined">notifications</span>
                                </button>

                                {notifOpen && (
                                    <div className="absolute top-14 right-0 w-96 bg-white rounded-3xl shadow-xl border border-gray-100 p-6 z-60">
                                        {/* Header */}
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-xl font-bold tracking-tight text-[#191b25]">
                                                Messages
                                            </h3>
                                            <span className="text-xs font-semibold text-[#003ec7] bg-[#003ec7]/10 px-3 py-1 rounded-full">
                                                2 New
                                            </span>
                                        </div>

                                        {/* Messages List */}
                                        <div className="space-y-4">
                                            {/* Chat Entry: Captain Ahmed */}
                                            <div className="p-4 rounded-2xl bg-[#f3f2ff] border border-transparent hover:border-[#003ec7]/20 transition-all">
                                                <div className="flex gap-4 items-start">
                                                    <div className="relative shrink-0">
                                                        <img
                                                            alt="Captain Ahmed"
                                                            className="w-12 h-12 rounded-full object-cover"
                                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfpHuOHEW-yAv2ncpMaiZh04WyUgzZu-P65qsXp9g1KgAhZjzfTuyiistguGps6shOZHDghEqtiTVHeyhmuRkBgiUbjWrrorV7KASqk3qCmsGGMRuUzTE6UsLZnrIAxQr2Lvd3gh5nxUmqMgVXj1whfyaNiGCu1Rj-e9-CFjHU4jMyqoBU7vStMC3pjjDfLC77BjSX-LgIYBrAq4kL1rRgfnPeTNFB_zIW_QVXBHqHvljGSX6Ln9vr5Wi9AOL01N7uAJzYKZq_yrU"
                                                        />
                                                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <span className="font-bold text-[#191b25] truncate">Captain Ahmed</span>
                                                            <span className="text-[10px] text-[#737688] uppercase font-bold tracking-wider">Just Now</span>
                                                        </div>
                                                        <p className="text-sm text-[#434656] line-clamp-1 mb-4 italic">
                                                            "I'm here in 2 minutes"
                                                        </p>
                                                        <button className="w-full py-2.5 px-4 bg-linear-to-br from-[#003ec7] to-[#0052ff] text-white text-sm font-bold rounded-full transition-transform active:scale-[0.98] flex items-center justify-center gap-2">
                                                            <span className="material-symbols-outlined text-sm">chat_bubble</span>
                                                            Open Chat
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Secondary Entry: Support Team */}
                                            <div className="p-4 rounded-2xl bg-white hover:bg-[#f3f2ff] transition-all cursor-pointer">
                                                <div className="flex gap-4 items-start opacity-60">
                                                    <div className="w-12 h-12 rounded-full bg-[#e7e7f5] flex items-center justify-center shrink-0">
                                                        <span className="material-symbols-outlined text-[#737688]">support_agent</span>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <span className="font-bold text-[#191b25]">Support Team</span>
                                                            <span className="text-[10px] text-[#737688] font-bold">2h ago</span>
                                                        </div>
                                                        <p className="text-sm text-[#434656] truncate">Your ride summary is ready.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Footer */}
                                        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                                            <button className="text-sm font-bold text-[#003ec7] hover:underline">
                                                View all notifications
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Profile Avatar */}
                            <div className="relative">
                                <button
                                    onClick={() => {
                                        setProfileOpen((prev) => !prev);
                                        setNotifOpen(false);
                                    }}>
                                    <img
                                        className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm cursor-pointer"
                                        src={user.image || `https://ui-avatars.com/api/?name=${user.name}`}
                                        alt={user.name}
                                    />
                                </button>

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
                                            Switch To Captain
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
                    <span onClick={toggleSidebar} className="fixed top-7 right-11 cursor-pointer z-60">
                        <img
                            src={user.image || `https://ui-avatars.com/api/?name=${user.name}`}
                            alt="Menu"
                            className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm"
                        />
                    </span>

                    {isOpen && (
                        <div className="h-screen fixed inset-0 bg-black/50 z-40" onClick={toggleSidebar} />
                    )}

                    <aside className={`fixed top-0 right-0 h-screen justify-between w-64 flex bg-white flex-col shadow-xl pt-14 p-6 z-50 transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
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
                            <Link onClick={toggleSidebar} className={`px-5 py-2 text-sm ${isActive('/user-home') ? 'font-semibold bg-blue-500 text-white rounded-full shadow-sm' : 'font-medium text-slate-600 hover:text-[#2b9dee] transition-colors'}`} href="/user-home">
                                Home
                            </Link>
                            <Link onClick={toggleSidebar} className={`px-5 py-2 text-sm ${isActive('/user-rides') ? 'font-semibold text-white bg-blue-500 rounded-full shadow-sm' : 'font-medium text-slate-600 hover:text-[#2b9dee] transition-colors'}`} href="/user-rides">
                                Rides
                            </Link>
                            <Link onClick={toggleSidebar} className={`px-5 py-2 text-sm ${isActive('/user-payment') ? 'font-semibold text-white bg-blue-500 rounded-full shadow-sm' : 'font-medium text-slate-600 hover:text-[#2b9dee] transition-colors'}`} href="/user-payment">
                                Payment
                            </Link>
                            <Link onClick={toggleSidebar} className={`px-5 py-2 text-sm ${isActive('/user-profile') ? 'font-semibold text-white bg-blue-500 rounded-full shadow-sm' : 'font-medium text-slate-600 hover:text-[#2b9dee] transition-colors'}`} href="/user-profile">
                                Profile
                            </Link>
                        </nav>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={changeRole}
                                className="flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-blue-500 text-white text-sm font-bold hover:bg-blue-600 transition-colors">
                                Switch To Captain
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

export default userNavbar;