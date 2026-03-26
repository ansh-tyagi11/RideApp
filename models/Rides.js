import mongoose from "mongoose";
import { Schema, model } from "mongoose";

const RidesSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, },
        captainId: { type: mongoose.Schema.Types.ObjectId, ref: "User", },
        pickupLocation: { type: String, required: true, },
        dropLocation: { type: String, required: true, },
        distance: { type: Number, },
        duration: { type: Number, },
        amount: { type: Number, required: true, },
        pickupTime: { type: Number },
        dropTime: { type: Number },
        status: {
            type: String, enum: [
                "searching",
                "accepted",
                "arriving",
                "ongoing",
                "completed",
                "cancelled"
            ],
            default: "searching",
        },
        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed"],
            default: "pending",
        },
        paymentMethod: {
            type: String,
            enum: ["cash", "card", "upi"],
        }
    }, { timestamps: true }
);

export default mongoose.models.Rides || model('Rides', RidesSchema)