"use server";
import connectDB from "@/db/connectDB";
import Rides from "@/models/Rides";
import User from "@/models/User";
import mongoose from "mongoose";

export async function findRide(id) {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return { success: false, error: "Invalid ride id" };
    }

    const ride = await Rides.findById(id).lean();
    if (!ride) return { error: "Ride not found" };

    // Serialize to remove ObjectId, Date, and other non-plain types
    return { success: true, ride: JSON.parse(JSON.stringify(ride)) };
}

export async function findCaptainId(email) {
    await connectDB();

    return await User.findOne({ email: email }).lean();
}