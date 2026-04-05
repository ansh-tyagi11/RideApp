import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
        rideId: { type: mongoose.Schema.Types.ObjectId, ref: "Rides", required: true, },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, },
        captainId: { type: mongoose.Schema.Types.ObjectId, ref: "User", },
        amount: { type: Number, required: true, },
        tip: { type: Number, required: true },
        totalAmount: { type: Number, required: true },
        currency: { type: String, default: "INR", },
        method: {
            type: String,
            enum: ["card", "cash", "wallet", "upi"],
        },
        status: {
            type: String,
            enum: ["pending", "completed", "failed", "refunded"],
            default: "pending",
        },
        orderId: { type: String, required: true },
        transactionId: { type: String },
        paymentProvider: {
            type: String,
            enum: ["razorpay", "stripe", "cash"],
            default:"razorpay"
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