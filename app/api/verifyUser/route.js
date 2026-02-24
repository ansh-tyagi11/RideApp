import { cookies } from "next/headers";
import connectDB from "@/db/connectDB";
import User from "@/models/User";
import Session from "@/models/Session";
import crypto from "crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req) {
    await connectDB();

    let session = await getServerSession(authOptions);

    if (session) {
        const userEmail = session.user.email;
        const user = await User.findOne({ email: userEmail });
        if (!user) return new Response(JSON.stringify({ success: false, message: "User not found." }));

        let { name, email, phone, image, address, role } = user;
        let captain = user.captain || {};
        let vehicle = captain.vehicle || {};
        if (role === "user") {
            return new Response(JSON.stringify({ success: true, name, email, phone, image }));
        }
        return new Response(JSON.stringify({
            success: true,
            name,
            email,
            phone,
            address,
            image,
            role,
            isVerified: captain.isVerified ?? false,
            licenceNumber: captain.licenceNumber ?? "",
            rating: captain.rating ?? 0,
            totalRides: captain.totalRides ?? 0,
            vehicleColor: vehicle.vehicleColor ?? "",
            model: vehicle.model ?? "",
            seatingCapacity: vehicle.seatingCapacity ?? ""
        }));
    }
    const cookieStore = await cookies();
    let sessionId = cookieStore.get('sessionId');
    const sessionRecord = sessionId ? await Session.findOne({ sessionId: crypto.createHash("sha256").update(sessionId.value).digest("hex") }) : null;

    if (!sessionRecord) {
        return new Response(JSON.stringify({ success: false, message: "No active session found." }));
    }

    const user = await User.findOne({ _id: sessionRecord.userId });
    if (!user) {
        return new Response(JSON.stringify({ success: false, message: "User not found." }));
    }

    const { name, email, phone, image, address, role } = user;
    const captain = user.captain || {};
    const vehicle = captain.vehicle || {};

    if (role === "user") return new Response(JSON.stringify({ success: true, name, email, phone, image }));

    return new Response(JSON.stringify({
        success: true,
        name,
        email,
        phone,
        address,
        image,
        role,
        isVerified: captain.isVerified ?? false,
        licenceNumber: captain.licenceNumber ?? "",
        rating: captain.rating ?? 0,
        totalRides: captain.totalRides ?? 0,
        vehicleColor: vehicle.vehicleColor ?? "",
        model: vehicle.model ?? "",
        seatingCapacity: vehicle.seatingCapacity ?? ""
    }));
}
