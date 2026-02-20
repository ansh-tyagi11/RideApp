import { cookies } from "next/headers";
import connectDB from "@/db/connectDB";
import User from "@/models/User";
import Session from "@/models/Session";
import crypto from "crypto";

export async function GET(req) {
    await connectDB();
    const cookieStore = await cookies();
    let sessionId = cookieStore.get('sessionId');
    const sessionRecord = sessionId ? await Session.findOne({ sessionId: crypto.createHash("sha256").update(sessionId.value).digest("hex") }) : null;

    if (!sessionRecord) {
        return new Response(JSON.stringify({ success: false, message: "No active session found." }));
    }

    const user = await User.findOne({ _id: sessionRecord.userId });
    
    const { name, email, phone, image, address } = user;
    const { isVerified, licenceNumber, rating, totalRides } = user.captain;
    const { vehicleColor, model, seatingCapacity } = user.captain.vehicle;

    if (!user) {
        return new Response(JSON.stringify({ success: false, message: "User not found." }));
    }

    return new Response(JSON.stringify({ success: true, name, email, phone, address, image, isVerified, licenceNumber, rating, totalRides, vehicleColor, model, seatingCapacity }));
}