"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import imageCompression from "browser-image-compression";

export default function UserProfileSettings() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting }
  } = useForm();

  const currentPassword = watch("currentPassword");
  const newPassword = watch("newPassword");

  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (data) => {
    if (Object.values(data).every(value => value === "")) return toast.error("Please fill at least one field to update.");
    let res = await fetch("/api/userProfileUpdate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "at9773@srmist.edu.in", data })
    });
    if (res.ok) {
      toast.success("Profile updated successfully!");
    } else {
      toast.error(res.error || "An error occurred while updating the profile.");
    }
    reset()
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

  const uploadImage = async () => {
    if (!file) {
      toast.error("Please select an image first.");
      return;
    }

    setSubmitting(true);

    const compressedFile = await imageCompression(file, {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1024,
      useWebWorker: true,
    });

    const formData = new FormData();
    formData.append("image", compressedFile);
    formData.append("email", "at9773@srmist.edu.in");

    const response = await fetch("/api/uploadImage", {
      method: "POST",
      body: formData,
    });

    const res = await response.json();

    if (response.ok && res?.success) {
      toast.success("Image uploaded successfully.");
    } else {
      toast.error(res?.message || "Upload failed.");
    }
    setSubmitting(false);
  }

  return (
    <>
      <div className="bg-[#f6f7f8] dark:bg-[#101922] pt-16 min-h-screen flex flex-col font-display text-slate-900 dark:text-slate-100 transition-colors duration-200">
        {/* Main Content */}
        <main className="flex-1 py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center rounded-2xl justify-between gap-6 bg-[#ffffff] dark:bg-[#1a2430] shadow-sm border border-slate-200 dark:border-slate-800 p-6 mb-8">
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <form className="bg-center bg-no-repeat aspect-square bg-cover bg-gray-200 rounded-full h-32 w-32 border-4 border-white shadow-[0_0_10px_rgba(0,0,0,0.35)]">
                    <input
                      id="fileInput"
                      type="file"
                      accept="image/*"
                      onChange={handleImage}
                      hidden
                    />
                    {preview && <img src={preview} className="w-32 h-32 rounded-full object-cover" />}
                    <label htmlFor="fileInput" className="absolute bottom-0 right-0 bg-[#1c486e] text-white px-2.5 py-2 pb-1 rounded-full shadow-lg border-2 border-white">
                      <span className="material-symbols-outlined text-sm">photo_camera</span>
                    </label>
                  </form>
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold tracking-tight">Jonathan Miller</h2>
                </div>
              </div>
              <button disabled={submitting} onClick={uploadImage} className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg border border-[#d3dce4] bg-white dark:bg-gray-800 dark:border-gray-700 text-sm font-bold hover:bg-gray-50 transition-all ${submitting ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:bg-gray-50"}`}>
                {submitting ? (
                  <>
                    <span className="animate-spin material-symbols-outlined text-[18px]">
                      progress_activity
                    </span>
                    Uploading...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                    Upload Image
                  </>
                )}
              </button>
            </div>
            <div>
              {/* Main Form Area */}
              <div className="lg:col-span-8 xl:col-span-9">
                <div className="rounded-2xl bg-[#ffffff] dark:bg-[#1a2430] shadow-sm border border-slate-200 dark:border-slate-800 p-6 md:p-8">
                  <div className="mb-8 flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">My Profile</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Update your photo and personal details here.
                      </p>
                    </div>
                    <div className="hidden sm:block rounded-full bg-blue-50 dark:bg-blue-900/20 p-3">
                      <span className="material-symbols-outlined text-[#137fec] text-2xl">manage_accounts</span>
                    </div>
                  </div>
                  <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
                    {/* Personal Info Section */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="col-span-1 md:col-span-2">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2" >Full Name</label>
                        <div className="relative">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <span className="material-symbols-outlined text-slate-400 text-[20px]">person</span>
                          </div>
                          <input
                            className="block w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white py-2.5 pl-10 focus:border-[#137fec] focus:ring-2 focus:ring-blue-500 focus:outline-none sm:text-sm shadow-sm transition-shadow"
                            name="full-name"
                            type="text"
                            value="John Doe"
                            readOnly
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                        <div className="relative">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <span className="material-symbols-outlined text-slate-400 text-[20px]">mail</span>
                          </div>
                          <input
                            className="block w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white py-2.5 pl-10 focus:border-[#137fec] focus:ring-2 focus:ring-blue-500 focus:outline-none sm:text-sm shadow-sm transition-shadow"
                            name="email"
                            type="email"
                            value="john.doe@example.com"
                            readOnly
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Phone Number</label>
                        <div className="relative">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <span className="material-symbols-outlined text-slate-400 text-[20px]">call</span>
                          </div>
                          <input
                            className="block w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white py-2.5 pl-10 focus:border-[#137fec] focus:ring-2 focus:ring-blue-500 focus:outline-none sm:text-sm shadow-sm transition-shadow"
                            placeholder="Phone Number"
                            name="phone"
                            type="tel"
                            autoComplete="tel"
                            {...register("tel", {
                              pattern: { value: /^\d{10}$/, message: "Phone Number must be exactly 10 digits and only numbers." }
                            })}
                          />
                          {errors.tel && <div className="text-xs text-red-500 dark:text-red-500">{errors.tel.message}</div>}
                        </div>
                      </div>
                    </div>
                    <hr className="border-slate-200 dark:border-slate-700" />
                    {/* Password Section */}
                    <div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white mb-4">Security</h4>
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Current Password</label>
                          <input
                            className="block w-full rounded-xl border border-slate-300 pl-3 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white py-2.5 focus:border-[#137fec] focus:ring-2 focus:ring-blue-500 focus:outline-none sm:text-sm shadow-sm"
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
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">New Password</label>
                          <input
                            className="block w-full pl-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white py-2.5 focus:border-[#137fec] focus:ring-2 focus:ring-blue-500 focus:outline-none sm:text-sm shadow-sm"
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
                        </div>
                      </div>
                    </div>
                    <hr className="border-slate-200 dark:border-slate-700" />
                    {/* Preferences Section */}
                    <div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white mb-4">Preferences</h4>
                      <div className="space-y-4">
                        {/* Language Dropdown */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center size-10 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                              <span className="material-symbols-outlined">language</span>
                            </div>
                            <div>
                              <p className="font-medium text-slate-900 dark:text-white">Language</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                Select your preferred language</p>
                            </div>
                          </div>
                          <select className="block w-full sm:w-48 rounded-xl border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white py-2 focus:border-[#137fec] focus:ring-2 focus:ring-blue-500 focus:outline-none sm:text-sm shadow-sm">
                            <option>English (US)</option>
                            <option>Spanish</option>
                            <option>French</option>
                          </select>
                        </div>
                        {/* Notifications Toggle */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center size-10 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                              <span className="material-symbols-outlined">notifications_active</span>
                            </div>
                            <div>
                              <p className="font-medium text-slate-900 dark:text-white">
                                Email Notifications
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                Receive updates about your rides
                              </p>
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input checked="" className="sr-only peer" type="checkbox" readOnly />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#137fec]">
                            </div>
                          </label>
                        </div>
                        {/* Dark Mode Toggle */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center size-10 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                              <span className="material-symbols-outlined">dark_mode</span>
                            </div>
                            <div>
                              <p className="font-medium text-slate-900 dark:text-white">Dark Mode</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">Adjust the appearance of the app</p>
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input className="sr-only peer" type="checkbox" readOnly />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#137fec]">
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-4 pt-4">
                      <button className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        type="button">Cancel</button>
                      <button disabled={isSubmitting} className={`mt-2 flex items-center justify-center overflow-hidden h-12 hover:bg-[#256af4]/90 leading-normal tracking-[0.015em] duration-200 px-6 py-2.5 rounded-xl bg-[#137fec] text-white text-sm font-bold shadow-md shadow-blue-500/30 transition-all hover:-translate-y-0.5" ${isSubmitting ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                        type="submit" value="submit">Save Changes</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}