"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

const captainNavbar = () => {
    const pathname = usePathname();
    const isActive = (path) => pathname === path;
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => setIsOpen(!isOpen);

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
                            <div
                                className="w-11 h-11 rounded-full bg-cover bg-center border-2 border-white shadow-sm cursor-pointer"
                                style={{
                                    backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBnWnXhqt2gJ1xjCWWALJmhPrDL_NhFbZ8lhBrwuOhzPnwJzg9Fsllee_IriCz6reqTw3czUCYd7XfsqQjcC6QR9zMNeMjEtdQ9WZqqSfuc38YTETwTw9a0i6qioDrwBmC03OgPP6snFDmmxB8lFu_5chKZT98nY__47e5GhAk--SX1EWd5Lhkqn_RDQaqFQjEi5D_uL48qu3PdZPuZWzgBgyHMKP3133XGmsRO_XXY7Zh_zwL5OZaTc5-msl0MxgBRb65QNZPA-UHT')"
                                }}
                            />
                        </div>
                    </span>
                </div>
                <div className='md:hidden block pointer-events-auto'>
                    <span onClick={toggleSidebar} className="fixed top-7 right-11 material-symbols-outlined cursor-pointer z-60"><img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnWnXhqt2gJ1xjCWWALJmhPrDL_NhFbZ8lhBrwuOhzPnwJzg9Fsllee_IriCz6reqTw3czUCYd7XfsqQjcC6QR9zMNeMjEtdQ9WZqqSfuc38YTETwTw9a0i6qioDrwBmC03OgPP6snFDmmxB8lFu_5chKZT98nY__47e5GhAk--SX1EWd5Lhkqn_RDQaqFQjEi5D_uL48qu3PdZPuZWzgBgyHMKP3133XGmsRO_XXY7Zh_zwL5OZaTc5-msl0MxgBRb65QNZPA-UHT"
                        alt="Menu"
                        className="w-11 h-11 rounded-full bg-cover bg-center border-2 border-white shadow-sm cursor-pointer"
                    /></span>
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
