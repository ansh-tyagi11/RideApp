"use client";
import { forContact } from "@/actions/useractions";
import React, { useState } from "react";
import { toast } from "react-toastify";

export default function Contact() {
    const [form, setForm] = useState({ name: "", email: "", topic: "", message: "" });
    const [isSubmitting, setIsSubmitting] = useState(null)

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const contact = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            let response = await forContact(form);

            if (response.success) {
                setForm({ name: "", email: "", topic: "", message: "" });
                toast.success(response.message);
            } else {
                toast.error(response.message || "Something went wrong. Please try again.");
            }
        } catch (error) {
            toast.error("An unexpected error occurred. Please try again.");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <>
            <div className="bg-[#f6f6f8] dark:bg-[#111621] font-display min-h-screen flex flex-col overflow-x-hidden text-[#111318] dark:text-white antialiased">
                {/* Main Content */}
                <main className="grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                    <div className="w-full max-w-300 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        {/* Left Column: Image */}
                        <div className="relative w-full h-100 lg:h-175 rounded-2xl overflow-hidden shadow-2xl group">
                            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent z-10"></div>
                            <div className="absolute bottom-0 left-0 p-8 z-20">
                                <div className="flex items-center gap-2 text-white mb-2">
                                    <span className="material-symbols-outlined text-yellow-400">star</span>
                                    <span className="font-bold text-sm uppercase tracking-wider">Top Rated Support</span>
                                </div>
                                <p className="text-white text-3xl font-bold leading-tight">Here for you, <br />every mile of the way.
                                </p>
                            </div>
                            {/* Image */}
                            <div className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                data-alt="Friendly driver in a car smiling at the camera from the drivers seat in a city setting"
                                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD_6TOaG_EzqHPPByEvUpQVq3VCqH7jiyLcBq8XUHsmIBrys2ZteTOk1exzsA0h1zza34np280Bafne_pDRDjPzx8q9HZHrGNHBS-yiEMPnxtSP8ROTWpP-gQN7yq1wWhmYhduvaJ22-Pi5xmVvZXGRcQEs83v5RyOYI6Vziqp1WrAUx199jzyz3usYGue5qgI-D1GWuc-0w5TtfsN7h0_Wz_96KTlgFFkJt8SkObs9Pi_T0MOao9HkPKCVykzLrcapcCMNGjTmxpQ')" }}>
                            </div>
                        </div>
                        {/* Right Column: Form */}
                        <div className="flex flex-col justify-center">
                            <div className="mb-8">
                                <h1 className="text-4xl sm:text-5xl font-extrabold text-[#111318] dark:text-white tracking-tight mb-3">
                                    Get in touch</h1>
                                <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed">
                                    Have a question about a trip or need help with your account? Our support team usually responds
                                    within 2 hours.
                                </p>
                            </div>
                            <form className="space-y-6">
                                {/* Name & Email Row */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-semibold text-[#111318] dark:text-gray-200">
                                            Full Name
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined text-[20px]">person</span>
                                            <input
                                                className="w-full pl-11 pr-4 py-3.5 rounded-lg border border-[#dcdfe5] dark:border-gray-700 bg-white dark:bg-gray-800 text-[#111318] dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-[#195de6]/20 focus:border-[#195de6] outline-none transition-all"
                                                autoComplete="name"
                                                name="name"
                                                value={form.name}
                                                placeholder="Jane Doe"
                                                type="text"
                                                required
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-semibold text-[#111318] dark:text-gray-200">
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined text-[20px]">mail</span>
                                            <input
                                                className="w-full pl-11 pr-4 py-3.5 rounded-lg border border-[#dcdfe5] dark:border-gray-700 bg-white dark:bg-gray-800 text-[#111318] dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-[#195de6]/20 focus:border-[#195de6] outline-none transition-all"
                                                placeholder="name@example.com"
                                                name="email"
                                                type="email"
                                                value={form.email}
                                                autoComplete="email"
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                {/* Topic Select */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-[#111318] dark:text-gray-200" htmlFor="topic">Topic</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined text-[20px]">help</span>
                                        <select
                                            className="w-full pl-11 pr-10 py-3.5 rounded-lg border border-[#dcdfe5] dark:border-gray-700 bg-white dark:bg-gray-800 text-[#111318] dark:text-white focus:ring-2 focus:ring-[#195de6]/20 focus:border-[#195de6] outline-none appearance-none transition-all cursor-pointer"
                                            id="topic"
                                            name="topic"
                                            value={form.topic}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option disabled value="">Select a topic</option>
                                            <option value="trip">Issue with a trip</option>
                                            <option value="account">Account &amp; Payment</option>
                                            <option value="driver">Driver Feedback</option>
                                            <option value="lost">Lost Item</option>
                                            <option value="other">Other</option>
                                        </select>
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none material-symbols-outlined">expand_more</span>
                                    </div>
                                </div>
                                {/* Message Textarea */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-[#111318] dark:text-gray-200">
                                        Message
                                    </label>
                                    <textarea
                                        className="w-full p-4 rounded-lg border border-[#dcdfe5] dark:border-gray-700 bg-white dark:bg-gray-800 text-[#111318] dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-[#195de6]/20 focus:border-[#195de6] outline-none resize-none transition-all"
                                        placeholder="Tell us more about how we can help..."
                                        rows="4"
                                        type="text"
                                        name="message"
                                        value={form.message}
                                        onChange={handleChange}
                                        required
                                    >
                                    </textarea>
                                </div>
                                {/* Submit Button */}
                                <button disabled={isSubmitting} onSubmit={contact}
                                    className={`w-full h-12 bg-[#195de6] hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg shadow-[#195de6]/30 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0 ${isSubmitting ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                                    type="submit">
                                    <span>Send Message</span>
                                    <span className="material-symbols-outlined text-[20px]">send</span>
                                </button>
                            </form>
                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}
