import Razorpay from "razorpay";
import Payment from "@/models/Payment";
import { NextResponse } from "next/server";
import connectDB from "@/db/connectDB";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils";

export const POST = async (req) => {
    await connectDB();

    let body = await req.formData();
    body = Object.fromEntries(body);

    const checkOrderId = await Payment.findOne({ orderId: body.razorpay_order_id });

    if (!checkOrderId) {
        return NextResponse.json({ success: false, message: "Order Id not found" }, { status: 404 });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET || process.env.NEXT_PUBLIC_RAZORPAY_KEY_SECRET;

    const validatePayment = validatePaymentVerification(
        { order_id: body.razorpay_order_id, payment_id: body.razorpay_payment_id },
        body.razorpay_signature,
        secret
    );

    if (validatePayment) {
        const updatedPayment = await Payment.findOneAndUpdate(
            { orderId: body.razorpay_order_id },
            { status: "completed", transactionId: body.razorpay_payment_id, paidAt: new Date() },
            { new: true }
        );

        const redirectUrl = new URL('/user-home/ride-completion', req.url);
        redirectUrl.searchParams.set("paymentdone", "true");
        redirectUrl.searchParams.set("rideId", String(updatedPayment?.rideId || checkOrderId.rideId));
        redirectUrl.searchParams.set("paymentId", body.razorpay_payment_id);

        return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.json({ success: false, message: "Payment Verification Failed" }, { status: 400 });

}
