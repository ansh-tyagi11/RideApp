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
        if (!user) {
            return new Response(JSON.stringify({ success: false, message: "User not found." }));
        }
        
        let { name, email, phone, image, address } = user;
        let { isVerified, licenceNumber, rating, totalRides } = user.captain;
        let { vehicleColor, model, seatingCapacity } = user.captain.vehicle;
        return new Response(JSON.stringify({ success: true, name, email, phone, address, image, isVerified, licenceNumber, rating, totalRides, vehicleColor, model, seatingCapacity }));
    }
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