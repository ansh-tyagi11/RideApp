import User from "@/models/User";
import connectDB from "@/db/connectDB";
import Rides from "@/models/Rides";
import { NextResponse } from "next/server";
import { calculateFare } from "@/utils/pricing";
import mongoose from "mongoose";

export async function POST(req) {
    await connectDB()

    const { userEmail, type, pickup, drop } = await req.json();

    if (!userEmail || !type || !pickup || !drop) {
        return NextResponse.json({ success: false }, { status: 400 });
    }

    let user = await User.findOne({ email: userEmail });
    if (!user) {
        return NextResponse.json({ success: false, message: "User not found." }, { status: 400 })
    }
    const userId = user._id

    const mapplsKey =
        process.env.MAPPLS_API_KEY ||
        process.env.NEXT_PUBLIC_MAPPLS_API_KEY ||
        process.env.MAPPLS_ACCESS_TOKEN ||
        process.env.NEXT_PUBLIC_MAPPLS_ACCESS_TOKEN;

    const upstreamUrl =
        `https://apis.mappls.com/advancedmaps/v1/${mapplsKey}` +
        `/distance_matrix/driving/${pickup};${(drop)}` +
        `?region=IND`;

    const upstreamResponse = await fetch(upstreamUrl, { method: "GET" });
    const data = await upstreamResponse.json();

    const distance = data?.results?.distances[0][1];
    const duration = data?.results?.durations[0][1];
    const km = (distance / 1000).toFixed(2)
    const minutes = Math.round(duration / 60);

    let amount = calculateFare(type, km, minutes)
    let ride = await Rides.create({
        userId: userId,
        pickupLocation: pickup,
        dropLocation: drop,
        distance: km,
        duration: minutes,
        amount: amount
    })

    return NextResponse.json({ success: true, rideId: ride._id })
}

export async function GET(req) {
    const { searchParams } = new URL(req.url);

    const rideId = searchParams.get("rideId")
    const userEmail = searchParams.get("userEmail")
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(rideId)) {
        return NextResponse.json(
            { success: false, message: "Invalid Ride ID" },
            { status: 400 }
        );
    }
    const user = await User.findOne({ email: userEmail })
    if (!user) {
        return NextResponse.json({ success: false, message: "User not found" }, { status: 400 })
    }
    const ride = await Rides.findById({ _id: rideId, userId: user._id });
    console.log(ride.status)

    if (!ride) {
        return NextResponse.json({ success: false, message: "Ride not found" })
    }

    const { pickupLocation, dropLocation, amount, distance, duration } = ride;

    return NextResponse.json({ success: true, pickupLocation: pickupLocation, dropLocation: dropLocation, amount: amount, distance: distance, duration: duration });
}

export async function PUT(req) {
    const { searchParams } = new URL(req.url);

    const rideId = searchParams.get("rideId")
    await connectDB();
    await Rides.findOneAndUpdate({ _id: rideId, status: "searching" }, { status: "cancelled" })

    return NextResponse.json({ success: true })
}