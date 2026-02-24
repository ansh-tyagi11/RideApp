"use client"
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, redirect } from 'next/navigation';
import { toast } from 'react-toastify';
import verifyOtpId from '@/actions/useractions';
import { verifyOtp, resendSignupOtp } from '@/actions/useractions';
import { useRouter } from 'next/navigation';

export default function OTPVerification() {
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [resendTimer, setResendTimer] = useState(25);
    const inputRefs = useRef([]);
    const searchParams = useSearchParams();
    const email = searchParams.get("email");
    const otpId = decodeURIComponent(searchParams.get("id"));
    const router = useRouter();

    useEffect(() => {
        verifySession();
    }, [])

    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    const handleChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        } else if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        } else if (e.key === 'ArrowRight' && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleSubmit = async () => {
        let fullOtp = otp.join('');
        let verificationOtp = await verifyOtp(email, fullOtp)
        if (verificationOtp.success) {
            redirect("/user-home");
            return toast.success(verificationOtp.message)
        }
    };

    const handleResend = async () => {
        if (resendTimer === 0) {
            setResendTimer(25);
        }

        let resendOtp = await resendSignupOtp(email);

        if (resendOtp?.error) return toast.error(resendOtp.error);

        if (resendOtp.success) return toast.success(resendOtp.message)
    };


    const verifySession = async () => {
        let verification = await verifyOtpId(email, otpId);

        if (!verification.success) {
            toast("No such session found.")
            return router.push("/signup")
        }

    }

    return (
        <div className="bg-gray-50 dark:bg-[#101622] text-slate-900 dark:text-white min-h-screen flex flex-col antialiased">
            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center p-4 md:p-6 lg:p-8">
                <div className="w-full max-w-5xl bg-white dark:bg-[#1A202C] rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-150 border border-gray-100 dark:border-gray-800">
                    {/* Left Side - Visual */}
                    <div className="hidden md:flex w-full md:w-1/2 bg-slate-50 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCfMnfxlEzj0a1_ZhA9hQR_adAHRZsZVy7ZAfikLN2zNaJdTxtK4Yjqc5Eas0B6yoincxMT7gcWHwXMignZRaDQHNSxQnIFHL6yc7hMlnkLW4674pYQaREIFguyqxiDq3YR2rvXPkogGrlk2B5IYwZ8PFcQER91XEcuUuQ5qnfag-8Jgvp20k9MpBffhdw58WYpWgq2iz_oY8I3Y_ADC1f5I_emKGN4wHlAlio8Jt_i_pL7NM-tuyayMc3J57o6pfN805R4SXUAlXI')" }}
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
                        <div className="relative z-10 mt-auto p-10 text-white">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="material-symbols-outlined text-primary fill-current">verified_user</span>
                                <span className="text-sm font-medium tracking-wide uppercase opacity-90">Secure Verification</span>
                            </div>
                            <h3 className="text-2xl font-bold leading-tight mb-2">Your safety is our priority</h3>
                            <p className="text-white/80 leading-relaxed max-w-sm">
                                We use two-factor authentication to ensure your ride history and payment details stay secure.
                            </p>
                        </div>
                    </div>

                    {/* Right Side - Form */}
                    <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-12 lg:p-16">
                        <div className="max-w-md mx-auto w-full flex flex-col gap-8">
                            {/* Header */}
                            <div className="space-y-3 text-center md:text-left">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 mb-2 md:hidden">
                                    <span className="material-symbols-outlined">lock_open</span>
                                </div>
                                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                    Verify it's you
                                </h1>
                                <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed">
                                    We've sent a 6-digit code to{' '}
                                    <span className="font-semibold text-slate-700 dark:text-slate-200">{email}</span>.
                                    <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-semibold ml-1 inline-flex items-center gap-0.5 text-sm transition-colors">
                                        Edit
                                        <span className="material-symbols-outlined text-[16px]">edit</span>
                                    </Link>
                                </p>
                            </div>

                            {/* OTP Input */}
                            <div className="flex flex-col gap-8">
                                <div className="flex justify-center md:justify-start">
                                    <div className="flex gap-2 sm:gap-3">
                                        {otp.map((digit, index) => (
                                            <div key={index} className="flex items-center">
                                                {index === 3 && (
                                                    <div className="flex items-center justify-center text-gray-300 dark:text-gray-600 mx-1">-</div>
                                                )}
                                                <input
                                                    ref={(el) => (inputRefs.current[index] = el)}
                                                    type="text"
                                                    inputMode="numeric"
                                                    maxLength={1}
                                                    value={digit}
                                                    onChange={(e) => handleChange(index, e.target.value)}
                                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                                    autoFocus={index === 0}
                                                    className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-bold rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-slate-900 dark:text-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Buttons */}
                                <div className="flex flex-col gap-4">
                                    <button
                                        onClick={handleSubmit}
                                        className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all transform active:scale-[0.98] shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                                    >
                                        <span>Verify Account</span>
                                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                    </button>
                                    <div className="flex items-center justify-between text-sm mt-2">
                                        <span className="text-slate-500 dark:text-slate-400">Didn't receive code?</span>
                                        <button
                                            onClick={handleResend}
                                            disabled={resendTimer > 0}
                                            className="text-blue-600 font-semibold hover:text-blue-700 disabled:text-slate-400 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-[16px]">refresh</span>
                                            <span>Resend {resendTimer > 0 ? `in 00:${resendTimer.toString().padStart(2, '0')}` : ''}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="border-t border-gray-100 dark:border-gray-700 pt-6 mt-2">
                                <div className="flex gap-4 justify-center md:justify-start">
                                    <Link href="#" className="text-xs text-slate-400 hover:text-blue-600 transition-colors">Terms of Service</Link>
                                    <Link href="/privacy-policy" className="text-xs text-slate-400 hover:text-blue-600 transition-colors">Privacy Policy</Link>
                                    <Link href="/contact" className="text-xs text-slate-400 hover:text-blue-600 transition-colors">Contact Support</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}