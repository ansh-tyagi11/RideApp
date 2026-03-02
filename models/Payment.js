import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
        rideId: { type: mongoose.Schema.Types.ObjectId, ref: "Rides", required: true, },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, },
        captainId: { type: mongoose.Schema.Types.ObjectId, ref: "User", },
        amount: { type: Number, required: true, },
        currency: { type: String, default: "INR", },
        method: {
            type: String,
            enum: ["card", "cash", "wallet", "upi"],
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "completed", "failed", "refunded"],
            default: "pending",
        },
        transactionId: { type: String, required: true },
        paymentProvider: {
            type: String,
            enum: ["razorpay", "stripe", "cash"],
        },
        platformFee: { type: Number, required: true },
        captainEarning: { type: Number, required: true },
        refundStatus: {
            type: String,
            enum: ["none", "requested", "processed"],
            default: "none",
        },
        refundAmount: { type: String },
        paidAt: { type: Date },
    },
    { timestamps: true }
);

export default mongoose.models.Payment || mongoose.model("Payment", paymentSchema);