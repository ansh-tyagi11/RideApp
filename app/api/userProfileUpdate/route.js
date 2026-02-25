import connectDB from "@/db/connectDB";
import User from "@/models/User";
import { verifyPassword, hashedPassword } from "@/utils/generateOtp";
import { cookies } from "next/headers";

export async function POST(req) {
    const { email, data } = await req.json();
    await connectDB();

    const { tel, currentPassword, newPassword } = data;

    let user = await User.findOne({ email });
    if (!user) return new Response(JSON.stringify({ success: false, message: "User not found." }));

    await User.updateOne(
        { email },
        { $set: { phone: tel } }
    )

    if (newPassword) {
        let storedPasswordHash = user.signUp?.password;

        if (!storedPasswordHash) return new Response(JSON.stringify({ success: false, error: "User has no password. Please use social login or reset password." }));

        let isCurrentPasswordValid = await verifyPassword(storedPasswordHash, currentPassword);

        if (!isCurrentPasswordValid) return new Response(JSON.stringify({ success: false, error: "Incorrect current password." }));

        const newHashedPassword = await hashedPassword(newPassword);

        await User.updateOne(
            { email },
            { $set: { "signUp.password": newHashedPassword } }
        )
    }

    return new Response(JSON.stringify({ success: true, message: "Profile updated successfully." }));
}

export async function PUT(req) {
    const { email } = await req.json();
    await connectDB();

    const user = await User.findOneAndUpdate({ email: email }, { $set: { role: "captain" } }, { new: true });
    return new Response(JSON.stringify({ success: true, message: "Role updated successfully." }));
}

export async function DELETE(req) {
    const cookieStore = await cookies();
    try {
        cookieStore.delete("sessionId");
    } catch (err) {
        return new Response(JSON.stringify({ success: false, message: "Unable to log out. Please try again." }));
    }

    return new Response(JSON.stringify({ success: true, message: "Logged out successfully.", redirect: "/login" }));
}