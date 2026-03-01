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

export async function forLatitudeLongitude(lat,lng) {


}