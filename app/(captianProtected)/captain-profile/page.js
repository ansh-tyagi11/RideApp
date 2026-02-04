"use client";
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { forUploadImage } from '@/actions/useractions';

const page = () => {
    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors, isSubmitting }
    } = useForm();
    const [preview, setPreview] = useState(null);
    const [file, setFile] = useState(null);

    const currentPassword = watch("currentPassword");
    const newPassword = watch("newPassword");

    const formatPlate = (value) => {
        if (!value) return "";

        value = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
        let result = "";
        if (value.length > 0) result += value.substring(0, 2);
        if (value.length >= 3) result += "-" + value.substring(2, 4);
        if (value.length >= 5) result += "-" + value.substring(4, 6);
        if (value.length >= 7) result += "-" + value.substring(6, 10);
        return result;
    };

    const onSubmit = async (data) => {
        if (Object.values(data).every(value => value === "")) return toast.error("Please fill at least one field to update.");
        let res = await fetch("/api/captainProfileUpdate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "at9773@srmist.edu.in", data })
        });
        if (res.ok) {
            toast.success(res.message || "Profile updated successfully.");
        } else {
            toast.error(res.error || res.message || "Failed to update profile.");
        }
        reset();
    }

    const handleImage = async (e) => {
        const img = e.target.files[0];

        if (!img) return;

        if (!img.type.startsWith("image/")) {
            toast.error("Only images allowed");
            return;
        }

        if (img.size > 2 * 1024 * 1024) {
            toast.error("Max 2MB allowed");
            return;
        }

        setFile(img);
        setPreview(URL.createObjectURL(img));
    };

    const uploadImage = async (e) => {
        e.preventDefault();
        console.log(file)
        let res = await forUploadImage(file);

        console.log(res)
    }

    return (
        <>
            <div className="bg-[#f7f7f8] pt-20 dark:bg-[#17191c] min-h-screen text-[#101519] dark:text-gray-100">
                <main className="max-w-240 mx-auto px-4 py-8">
                    {/* Profile Header Section */}
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-[#e9edf1] dark:border-gray-800 p-6 mb-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-center gap-6">
                                <div className="relative group">
                                    <form className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-32 w-32 border-4 border-white shadow-md">
                                        <input
                                            id="fileInput"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImage}
                                            hidden
                                        />
                                        {preview && <img src={preview} className="w-32 h-32 rounded-full object-cover" />}
                                        <label htmlFor="fileInput" className="absolute bottom-0 right-0 bg-[#1c486e] text-white p-2 rounded-full shadow-lg border-2 border-white">
                                            <span className="material-symbols-outlined text-sm">photo_camera</span>
                                        </label>
                                        <button onSubmit={uploadImage}>Submit</button>
                                    </form>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-extrabold tracking-tight">Jonathan Miller</h2>
                                    <div className="flex flex-col gap-1 mt-1">
                                        <p className="text-[#57758e] dark:text-gray-400 font-medium flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-sm">verified_user</span> Professional
                                            Captain
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <span className="bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-500 px-2 py-0.5 rounded text-sm font-bold flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[16px] fill-current">star</span> 4.95
                                            </span>
                                            <span className="text-xs text-[#57758e]">(1,240 trips)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg border border-[#d3dce4] bg-white dark:bg-gray-800 dark:border-gray-700 text-sm font-bold hover:bg-gray-50 transition-all">
                                <span className="material-symbols-outlined text-[18px]">edit</span>
                                Edit Profile
                            </button>
                        </div>
                    </div>
                    {/* Two Column Layout for Forms */}
                    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-8">
                        {/* Section 1: Personal Information */}
                        <section className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-[#e9edf1] dark:border-gray-800 overflow-hidden">
                            <div className="px-6 py-4 border-b border-[#e9edf1] dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
                                <h3 className="text-lg font-bold">Personal Information</h3>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <label className="flex flex-col gap-2">
                                        <span className="text-sm font-semibold text-[#57758e] dark:text-gray-400">Full Name</span>
                                        <input
                                            className="rounded-lg border border-[#d3dce4] dark:border-gray-700 dark:bg-gray-800 focus:ring-[#1c486e] focus:border-[#1c486e] px-4 py-3"
                                            type="text"
                                            value="Name"
                                            readOnly
                                        />
                                    </label>
                                    <label className="flex flex-col gap-2">
                                        <span className="text-sm font-semibold text-[#57758e] dark:text-gray-400">Email Address</span>
                                        <input
                                            className="rounded-lg border border-[#d3dce4] dark:border-gray-700 dark:bg-gray-800 focus:ring-[#1c486e] focus:border-[#1c486e] px-4 py-3"
                                            type="email"
                                            value="xyz@gmail.com"
                                            readOnly
                                        />
                                    </label>
                                    <label className="flex flex-col gap-2">
                                        <span className="text-sm font-semibold text-[#57758e] dark:text-gray-400">Phone Number</span>
                                        <input
                                            className="rounded-lg border border-[#d3dce4] dark:border-gray-700 dark:bg-gray-800 focus:ring-[#1c486e] focus:border-[#1c486e] px-4 py-3"
                                            placeholder="Phone Number"
                                            name="phone"
                                            type="tel"
                                            autoComplete="tel"
                                            {...register("tel", {
                                                required: { pattern: { value: /^\d{10}$/, message: "Phone Number must be exactly 10 digits and only numbers." } },
                                            })}
                                        />
                                        {errors.tel && <div className="text-xs text-red-500 dark:text-red-500">{errors.tel.message}</div>}
                                    </label>
                                    <label className="flex flex-col gap-2">
                                        <span className="text-sm font-semibold text-[#57758e] dark:text-gray-400">
                                            Residential Address
                                        </span>
                                        <input
                                            className="rounded-lg border border-[#d3dce4] dark:border-gray-700 dark:bg-gray-800 focus:ring-[#1c486e] focus:border-[#1c486e] px-4 py-3"
                                            type="text"
                                            placeholder="Residential Address"
                                            name="address"
                                            {...register("address")}
                                        />
                                        {errors.address && <div className="text-xs text-red-500 dark:text-red-500">{errors.address.message}</div>}
                                    </label>
                                </div>
                            </div>
                        </section>
                        {/* Section 2: Vehicle Details */}
                        <section className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-[#e9edf1] dark:border-gray-800 overflow-hidden">
                            <div className="px-6 py-4 border-b border-[#e9edf1] dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 flex items-center justify-between">
                                <h3 className="text-lg font-bold">Vehicle Details</h3>
                                <span className="text-xs font-bold uppercase tracking-widest text-[#1c486e] bg-[#1c486e]/10 px-2 py-1 rounded">
                                    Active Unit
                                </span>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <label className="flex flex-col gap-2">
                                        <span className="text-sm font-semibold text-[#57758e] dark:text-gray-400">Vehicle Model and Year</span>
                                        <div className="relative">
                                            <input
                                                className="w-full rounded-lg border border-[#d3dce4] dark:border-gray-700 dark:bg-gray-800 focus:ring-[#1c486e] focus:border-[#1c486e] px-4 py-3 pr-10"
                                                type="text"
                                                name="vehicleModel"
                                                placeholder="Vehicle Model and Year"
                                                {...register("vehicleModel")}
                                            />
                                            {errors.vehicleModel && <div className="text-xs text-red-500 dark:text-red-500">{errors.vehicleModel.message}</div>}
                                            <span className="material-symbols-outlined absolute right-3 top-3 text-gray-400">directions_car</span>
                                        </div>
                                    </label>
                                    <label className="flex flex-col gap-2">
                                        <span className="text-sm font-semibold text-[#57758e] dark:text-gray-400">
                                            License Plate Number
                                        </span>
                                        <input
                                            className="w-full rounded-lg border border-[#d3dce4] dark:border-gray-700 dark:bg-gray-800 focus:ring-[#1c486e] focus:border-[#1c486e] px-4 py-3 pr-10 font-mono uppercase"
                                            type="text"
                                            placeholder="License Plate Number"
                                            name="licencePlateNumber"
                                            {...register("licencePlateNumber", {
                                                required: {
                                                    validate: (v) =>
                                                        /^[A-Z]{2}-\d{2}-[A-Z]{2}-\d{4}$/.test(v) ||
                                                        "Format must be DL-01-AB-1234",
                                                }
                                            })}
                                            onChange={(e) => {
                                                e.target.value = formatPlate(e.target.value);
                                            }}
                                            maxLength={13}
                                        />
                                        {errors.licencePlateNumber && (<p className="text-xs text-red-500 dark:text-red-500">{errors.licencePlateNumber.message}</p>)}
                                    </label>
                                    <label className="flex flex-col gap-2">
                                        <span className="text-sm font-semibold text-[#57758e] dark:text-gray-400">Vehicle Color</span>
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 rounded-full border border-gray-200 shadow-inner bg-gray-400"></div>
                                            <input
                                                className="w-full rounded-lg border border-[#d3dce4] dark:border-gray-700 dark:bg-gray-800 focus:ring-[#1c486e] focus:border-[#1c486e] px-4 py-3 pr-10"
                                                type="text"
                                                placeholder="Vehicle Color"
                                                name="vehicleColor"
                                                {...register("vehicleColor")}
                                            />
                                            {errors.vehicleColor && (<p className="text-red-500 text-sm mt-1">{errors.vehicleColor.message}</p>)}
                                        </div>
                                    </label>
                                    <label className="flex flex-col gap-2">
                                        <span className="text-sm font-semibold text-[#57758e] dark:text-gray-400">
                                            Seating Capacity
                                        </span>
                                        <select
                                            className="w-full rounded-lg border border-[#d3dce4] dark:border-gray-700 dark:bg-gray-800 focus:ring-[#1c486e] focus:border-[#1c486e] px-4 py-3 pr-10"
                                            {...register("seatingCapacity")}
                                        >
                                            <option value="2">2 Seats</option>
                                            <option value="4">4 Seats</option>
                                            <option value="6">6 Seats (XL)</option>
                                        </select>
                                    </label>
                                </div>
                            </div>
                        </section>
                        {/* Section 2: Security */}
                        <section className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-[#e9edf1] dark:border-gray-800 overflow-hidden">
                            <div className="px-6 py-4 border-b border-[#e9edf1] dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 flex items-center justify-between">
                                <h3 className="text-lg font-bold">Security</h3>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <label className="flex flex-col gap-2">
                                        <span className="text-sm font-semibold text-[#57758e] dark:text-gray-400">Current Password</span>
                                        <div className="relative">
                                            <input
                                                className="w-full rounded-lg border border-[#d3dce4] dark:border-gray-700 dark:bg-gray-800 focus:ring-[#1c486e] focus:border-[#1c486e] px-4 py-3 pr-10"
                                                name="currentPassword"
                                                placeholder="Current Password"
                                                type="password"
                                                {...register("currentPassword", {
                                                    validate: value => {
                                                        if (newPassword && !value) {
                                                            return "Current password is required to set a new password";
                                                        }
                                                        return true;
                                                    },
                                                    minLength: {
                                                        value: 8,
                                                        message: "Password must be at least 8 characters",
                                                    },
                                                    pattern: {
                                                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+\-])[A-Za-z\d@$!%*?&#^()_+\-]{8,}$/,
                                                        message: "Password must contain A-Z, a-z, number, symbol & no spaces.",
                                                    },
                                                })}
                                            />
                                            {errors.currentPassword && <div className="text-xs text-red-500 dark:text-red-500">{errors.currentPassword.message}</div>}
                                        </div>
                                    </label>
                                    <label className="flex flex-col gap-2">
                                        <span className="text-sm font-semibold text-[#57758e] dark:text-gray-400">
                                            New Password
                                        </span>
                                        <input
                                            className="w-full rounded-lg border border-[#d3dce4] dark:border-gray-700 dark:bg-gray-800 focus:ring-[#1c486e] focus:border-[#1c486e] px-4 py-3 pr-10 font-mono"
                                            name="newPassword"
                                            type="password"
                                            autoComplete="password"
                                            placeholder="New Password"
                                            {...register("newPassword", {
                                                validate: value => {
                                                    if (currentPassword && !value) {
                                                        return "New password is required";
                                                    }
                                                    if (value && value === currentPassword) {
                                                        return "New password must be different from current password";
                                                    }
                                                    return true;
                                                },
                                                minLength: {
                                                    value: 8,
                                                    message: "Password must be at least 8 characters",
                                                },
                                                pattern: {
                                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+\-])[A-Za-z\d@$!%*?&#^()_+\-]{8,}$/,
                                                    message: "Password must contain A-Z, a-z, number, symbol & no spaces.",
                                                },
                                            })}
                                        />
                                        {errors.newPassword && <div className="text-xs text-red-500 dark:text-red-500">{errors.newPassword.message}</div>}
                                    </label>
                                </div>
                            </div>
                        </section>
                        {/* Document Center Section */}
                        <section className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-[#e9edf1] dark:border-gray-800 overflow-hidden">
                            <div className="px-6 py-4 border-b border-[#e9edf1] dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
                                <h3 className="text-lg font-bold">Document Center</h3>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Doc 1 */}
                                    <div className="border border-[#e9edf1] dark:border-gray-800 rounded-lg p-4 flex flex-col gap-4">
                                        <div className="flex justify-between items-start">
                                            <div className="p-2 bg-[#1c486e]/10 rounded-lg text-[#1c486e]">
                                                <span className="material-symbols-outlined">badge</span>
                                            </div>
                                            <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-500 text-[11px] font-bold px-2 py-0.5 rounded-full uppercase">
                                                <span className="material-symbols-outlined text-[14px]">check_circle</span> Verified
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold">Driving License</p>
                                            <p className="text-[12px] text-[#57758e] mt-1">Expires: 12 Nov 2026</p>
                                        </div>
                                        <button className="w-full py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-xs font-bold hover:bg-gray-100 transition-colors">
                                            Update File
                                        </button>
                                    </div>
                                    {/* Doc 2 */}
                                    <div className="border border-[#e9edf1] dark:border-gray-800 rounded-lg p-4 flex flex-col gap-4">
                                        <div className="flex justify-between items-start">
                                            <div className="p-2 bg-[#1c486e]/10 rounded-lg text-[#1c486e]">
                                                <span className="material-symbols-outlined">description</span>
                                            </div>
                                            <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-500 text-[11px] font-bold px-2 py-0.5 rounded-full uppercase">
                                                <span className="material-symbols-outlined text-[14px]">warning</span> Expiring Soon
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold">Vehicle Insurance</p>
                                            <p className="text-[12px] text-[#57758e] mt-1">Expires: 15 Oct 2024</p>
                                        </div>
                                        <button className="w-full py-2 bg-[#1c486e] text-white rounded-md text-xs font-bold hover:bg-[#1c486e]/90 transition-colors">
                                            Renew Now
                                        </button>
                                    </div>
                                    {/* Doc 3 */}
                                    <div className="border border-dashed border-[#d3dce4] dark:border-gray-700 rounded-lg p-4 flex flex-col gap-4 bg-gray-50/50 dark:bg-gray-800/20">
                                        <div className="flex justify-between items-start">
                                            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-400">
                                                <span className="material-symbols-outlined">sticky_note_2</span>
                                            </div>
                                            <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 text-[11px] font-bold px-2 py-0.5 rounded-full uppercase">
                                                Required
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold">Registration (RC)</p>
                                            <p className="text-[12px] text-[#57758e] mt-1">Not uploaded yet</p>
                                        </div>
                                        <button className="w-full py-2 border-2 border-dashed border-[#1c486e]/40 text-[#1c486e] rounded-md text-xs font-bold hover:bg-[#1c486e]/5 transition-colors flex items-center justify-center gap-2">
                                            <span className="material-symbols-outlined text-[16px]">upload</span> Upload
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>
                        {/* Bottom Actions */}
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 pb-12">
                            <p className="text-sm text-[#57758e] max-w-sm text-center md:text-left">
                                Your updates will be reviewed by the admin team before they reflect on your public profile.
                            </p>
                            <div className="flex items-center gap-4 w-full md:w-auto">
                                <button className="flex-1 md:flex-none px-8 py-3 rounded-lg text-sm font-bold text-[#101519] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                    Discard Changes
                                </button>
                                <button disabled={isSubmitting} className={`mt-2 flex items-center justify-center overflow-hidden h-12 hover:bg-[#256af4]/90 leading-normal tracking-[0.015em] duration-200 px-6 py-2.5 rounded-xl bg-[#137fec] text-white text-sm font-bold shadow-md shadow-blue-500/30 transition-all hover:-translate-y-0.5" ${isSubmitting ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                                    type="submit" value="submit">Save Changes</button>
                            </div>
                        </div>
                    </form>
                </main>

            </div>
        </>
    )
}

export default page
