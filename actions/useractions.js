"use server";
import connectDB from "@/db/connectDB";
import User from "@/models/User";
import { otpEmail } from "@/lib/otpEmail";
import { generateOtp, hashedPassword, generateOtpId, verifyPassword } from "@/utils/generateOtp";
import otpStore from "@/models/otpStore";
import { sendEmail } from "@/lib/mailer";
import passwordReset from "@/models/passwordReset";
import crypto from "crypto";
import { sendEmailContact } from "@/lib/mailerContact";
import cloudinary from "@/lib/cloudinary";
import Session from "@/models/Session";
import { cookies } from "next/headers";
import { findUserId, findRide } from "@/services/userServices";
import Rides from "@/models/Rides";
import Payment from "@/models/Payment";
import mongoose from "mongoose";

export const createUser = async (data) => {

    await connectDB();

    let name = data.username;
    let email = data.email;
    let confirmPassword = data.confirmPassword;

    let existingUser = await User.findOne({ email });

    if (existingUser) return { error: "User already exists. Please login instead." };

    const otp = generateOtp();
    const password = await hashedPassword(confirmPassword);
    const otpId = generateOtpId();

    const alreadyOtp = await otpStore.findOne({ email })
    if (alreadyOtp) {
        let otpId = alreadyOtp.otpId;
        alreadyOtp.otp = otp;
        await alreadyOtp.save();

        await otpEmail(email, name, otp);

        return { success: true, email, otpId }
    }

    await otpStore.create({
        otpId,
        email,
        name,
        password,
        otp,
        expiresAt: Date.now() + 5 * 60 * 1000,
    });

    await otpEmail(email, name, otp);

    return { success: true, email, otpId }
}

export default async function verifyOtpId(email, otpId) {
    await connectDB();

    let findEmail = await otpStore.findOne({ email, otpId });
    if (findEmail) return { success: true }

    return { success: false, message: "Session not found." }
}

export const verifyOtp = async (email, otp) => {
    await connectDB();

    const cookieStore = await cookies();
    const sessionId = crypto.randomBytes(32).toString("hex");
    const sessionIdDb = crypto.createHash("sha256").update(sessionId).digest("hex");
    let isNewUser = false;

    let otpRecord = await otpStore.findOne({ email, otp })

    if (!otpRecord) return { error: "Invalid OTP" };

    if (otpRecord.expiresAt < Date.now()) return { error: "OTP expired." };

    let existingUser = await User.findOne({ email });

    if (!existingUser) {
        isNewUser = true;
        existingUser = await User.create({
            email: otpRecord.email,
            name: otpRecord.name,
            signUp: {
                password: otpRecord.password,
                name: otpRecord.name,
                email: otpRecord.email
            },
        });

        await otpStore.deleteMany({ email });
    }

    await Session.findOneAndUpdate(
        { userId: existingUser._id },
        {
            sessionId: sessionIdDb,
            expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
        },
        { upsert: true }
    )

    cookieStore.set('sessionId', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
    })

    await otpStore.deleteMany({ email });
    return { success: true, message: isNewUser ? "OTP verified successfully! Your account is now active." : "Login successfull." }
}

export async function login(data) {
    await connectDB();

    let email = data.email;
    let password = data.password;

    let existingUser = await User.findOne({ email });

    if (!existingUser) return { success: false, message: "User not found. Please sign up first." }

    let storedPasswordHash = existingUser.signUp?.password;
    let userName = existingUser.signUp?.name || existingUser.name;

    if (!storedPasswordHash) return { success: false, error: "User has no password. Please use social login or reset password." };

    let userPasswordVerify = await verifyPassword(storedPasswordHash, password)
    if (!userPasswordVerify) return { success: false, error: "Incorrect password." };

    let otp = generateOtp();
    let otpId = generateOtpId();

    await otpStore.create({
        otpId,
        email,
        name: userName,
        password: storedPasswordHash,
        otp,
        expiresAt: Date.now() + 5 * 60 * 1000,
    });

    await otpEmail(email, userName, otp);

    return { success: true, email, otpId }
}

export async function resendSignupOtp(email) {
    await connectDB();
    let alreadyOtp = await otpStore.findOne({ email });
    if (!alreadyOtp) return { error: "We couldn't find an active signup session for this email. Please sign up again." };

    let newOtp = generateOtp();
    alreadyOtp.otp = newOtp;
    await alreadyOtp.save();

    await otpEmail(email, alreadyOtp.name, newOtp);

    return { success: true, message: "A new verification code has been sent to your email." };
}

export const forResetPassword = async (email) => {
    await connectDB();

    let user = await User.findOne({ email });

    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    await passwordReset.findOneAndUpdate(
        { userId: user._id },
        {
            userId: user._id,
            token: hashedToken,
            expiresAt: Date.now() + 1000 * 60 * 15, // 15 minutes
        },
        { upsert: true }
    );

    const resetLink = `http://localhost:3000/forgot-password?token=${token}&id=${user._id}`;

    await sendEmail(user.email, "Reset your Password", resetLink);

    return { success: true, message: "Reset link sent (if email is valid)" };
}

export const forCheckToken = async (token) => {
    await connectDB();

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const record = await passwordReset.findOne({
        token: hashedToken,
        expiresAt: { $gt: Date.now() },
    });

    if (!record) {
        return { success: false, message: "Invalid or expired reset link" }
    }

    return { success: true };
}

export const forUpdatePassword = async (password, token, userId) => {
    await connectDB();

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const record = await passwordReset.findOne({
        userId,
        token: hashedToken,
        expiresAt: { $gt: Date.now() },
    });

    if (!record) {
        return { success: false, message: "Invalid or expired reset link" }
    }

    const newHashedPassword = await hashedPassword(password)

    await User.findByIdAndUpdate(userId, { "signUp.password": newHashedPassword })

    await passwordReset.deleteMany({ userId })

    return { success: true, message: "Password Change Successfully. Kindly Login." }
}

export async function forContact(form) {

    const { name, email, topic, message } = form;

    let result = await sendEmailContact(name, email, topic, `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Topic:</strong> ${topic}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
    ` );

    if (!result) return { success: false, message: "Sorry, we couldn't send your message. Please try again later." }

    return { success: true, message: "Thank you for contacting us! Your message has been sent successfully. We will get back to you soon." }
}

export async function forUploadImage(formData) {
    try {
        const file = formData.get("image");

        if (!file || typeof file.arrayBuffer !== "function") {
            return { success: false, message: "Invalid image" };
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    folder: "uploads",
                    resource_type: "image",
                },
                (error, result) => {
                    if (error) reject(error);
                    resolve(result);
                }
            ).end(buffer);
        });

        return {
            success: true,
            url: uploadResult.secure_url,
            public_id: uploadResult.public_id,
        };

    } catch (err) {
        console.error(err);
        return { success: false, message: "Upload failed" };
    }
}


export async function forVerifyRideId(id) {

    await connectDB();
    let ride = await findRide(id);
    if (ride.success) {
        return { success: true, ...ride }
    }

    return { success: false }
}

export async function forAllCaptainRides(email, status = "all", page = 1, limit = 10) {
    if (!email) return { success: false, rides: [], nextPage: null };
    await connectDB();

    let captain = await findUserId(email);

    const { _id } = captain;

    let query = { captainId: _id }

    if (status != "all") {
        query.status = status
    }

    if (status === "active") {
        query.status = { $in: ["ongoing", "arriving", "accepted"] };
    }

    let skip = (page - 1) * limit;

    let rides = await Rides.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean();

    const total = await Rides.countDocuments(query);

    return { success: true, rides: JSON.parse(JSON.stringify(rides)), nextPage: skip + limit < total ? page + 1 : null }
}

export async function forAllRiderRides(email, status = "all", page = 1, limit = 10) {
    if (!email) return { success: false, rides: [], nextPage: null };

    await connectDB();

    let rider = await findUserId(email);

    const { _id } = rider;

    let query = { userId: _id };

    if (status != "all") {
        query.status = status
    }

    if (status == "active") {
        query.status = { $in: ["accepted", "arriving", "ongoing"] }
    }

    let skip = (page - 1) * limit;

    let rides = await Rides.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);

    const total = await Rides.countDocuments(query);

    return { success: true, rides: JSON.parse(JSON.stringify(rides)), nextPage: skip + limit < total ? page + 1 : null }
}

export async function forAllRiderPayments(email, status = "all payments", page = 1, limit = 10) {
    if (!email) return { success: false, payments: [], nextPage: null };
    await connectDB();

    const rider = await findUserId(email);
    if (!rider) return { success: false, payments: [], nextPage: null };
    const { _id } = rider;

    const matchStage = { userId: _id };

    const normalizedStatus = String(status ?? "all payments").toLowerCase();
    if (normalizedStatus !== "all payments" && normalizedStatus !== "all") {
        matchStage.status = normalizedStatus === "cancelled" ? "canceled" : normalizedStatus;
    }

    const skip = (page - 1) * limit;

    const payments = await Payment.aggregate([
        { $match: matchStage },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
        {
            $lookup: {
                from: "rides",
                let: { rideId: "$rideId" },
                pipeline: [{
                    $match: {
                        $expr: { $eq: ["$_id", "$$rideId"] }
                    }
                },
                {
                    $project: {
                        pickupLocation: 1,
                        dropLocation: 1,
                        distance: 1,
                        duration: 1
                    }
                }
                ],
                as: "ride"
            }
        }, {
            $unwind: {
                path: "$ride",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: "users",
                let: { userId: "$userId" },
                pipeline: [{
                    $match: {
                        $expr: { $eq: ["$_id", "$$userId"] }
                    }
                },
                {
                    $project: {
                        username: 1,
                        vehicle: "$captain.vehicle.model",
                    }
                }
                ],
                as: "user"
            }
        },
        {
            $unwind: {
                path: "$user",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $project: {
                _id: 1,
                amount: 1,
                status: 1,
                createdAt: 1,
                transactionId: 1,
                captainUsername: "$user.username",
                vehicle: "$user.vehicle",
                pickupLocation: "$ride.pickupLocation",
                dropLocation: "$ride.dropLocation",
                distance: "$ride.distance",
                duration: "$ride.duration"
            }
        }
    ]);

    const total = await Payment.countDocuments(matchStage)

    return { success: true, payments: JSON.parse(JSON.stringify(payments)), nextPage: skip + limit < total ? page + 1 : null };
}

export async function forAllCaptainPayment(email, filter = "All", page = 1, limit = 10) {
    if (!email) return { success: false, payments: [], nextPage: null };

    await connectDB();
    let captain = await findUserId(email);
    if (!captain) return { success: false, payments: [], nextPage: null };

    const { _id } = captain;

    const now = new Date();
    let dateFilter = {};

    if (filter === "Today") {
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        dateFilter = { createdAt: { $gte: startOfDay, $lt: endOfDay } };

    } else if (filter === "This Month") {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        dateFilter = { createdAt: { $gte: startOfMonth, $lt: endOfMonth } };

    } else if (filter === "This Week") {
        const dayOfWeek = now.getDay();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - dayOfWeek);
        startOfWeek.setHours(0, 0, 0, 0);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 7);
        dateFilter = { createdAt: { $gte: startOfWeek, $lt: endOfWeek } };
    }

    const matchStage = ({ captainId: _id, ...dateFilter });

    let skip = (page - 1) * limit;

    let payments = await Payment.aggregate([
        { $match: matchStage },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
        {
            $lookup: {
                from: "rides",
                let: { rideId: "$rideId" },
                pipeline: [{
                    $match: {
                        $expr: { $eq: ["$_id", "$$rideId"] }
                    }
                },
                {
                    $project: {
                        pickupLocation: 1,
                        dropLocation: 1,
                        distance: 1,
                    },
                }
                ],
                as: "ride"
            },
        },
        {
            $unwind: {
                path: "$ride",
                preserveNullAndEmptyArrays: true
            },
        },
        {
            $lookup: {
                from: "users",
                let: { userId: "$userId" },
                pipeline: [{
                    $match: {
                        $expr: { $eq: ["$_id", "$$userId"] }
                    }
                },
                {
                    $project: {
                        username: 1,
                        name: 1
                    }
                }
                ],
                as: "user"
            }
        },
        {
            $unwind: {
                path: "$user",
                preserveNullAndEmptyArrays: true
            }
        }, {
            $project: {
                _id: 1,
                amount: 1,
                status: 1,
                createdAt: 1,
                transactionId: 1,
                distance: "$ride.distance",
                captainUsername: {
                    $ifNull: ["$user.username", "$user.name"]
                },
                pickupLocation: "$ride.pickupLocation",
                dropLocation: "$ride.dropLocation"
            }
        }
    ])

    const total = await Payment.countDocuments(matchStage)

    return { success: true, payments: JSON.parse(JSON.stringify(payments)), nextPage: skip + limit < total ? page + 1 : null }
}

export async function forRiderInfo(rideId) {
    await connectDB();

    const user = await Rides.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(rideId) } },
        {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "rider"
            }
        },
        {
            $unwind: {
                path: "$rider",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $project: {
                pickupLocation: 1,
                dropLocation: 1,
                distance: 1,
                amount: 1,
                duration: 1,
                image: "$rider.image",
                pickupTime: 1,
                dropTime: 1,
                riderUsername: {
                    $ifNull: ["$rider.username", "$rider.name"]
                },
                phone: "$rider.phone"
            }
        }
    ]);

    return {
        success: true,
        data: JSON.parse(JSON.stringify(user[0])) || null
    };
}

export async function forCaptainInfo(rideId) {
    await connectDB();

    let captain = await Rides.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(rideId) } },
        {
            $lookup: {
                from: "users",
                localField: "captainId",
                foreignField: "_id",
                as: "captain"
            }
        }, {
            $unwind: {
                path: "$captain",
                preserveNullAndEmptyArrays: true,
            }
        }, {
            $project: {
                pickupLocation: 1,
                dropLocation: 1,
                pickupTime: 1,
                dropTime: 1,
                dropLocation: 1,
                image: "$captain.image",
                captainUsername: {
                    $ifNull: ["$captain.username", "$captain.name"]
                },
                phone: "$captain.phone",
                vehicleNumber: "$captain.captain.licenceNumber",
                vehicleModel: "$captain.captain.vehicle.model",
                totalRides: "$captain.captain.totalRides"
            }
        }
    ])

    return {
        success: true,
        data: JSON.parse(JSON.stringify(captain[0])) || null
    };
}
