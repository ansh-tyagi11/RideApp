import Razorpay from "razorpay";
import Payment from "@/models/Payment";
import { NextResponse } from "next/server";
import connectDB from "@/db/connectDB";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils";

export const POST = async (req) => {
    await connectDB();

    let body = await req.formData();
    body = Object.fromEntries(body);

    let checkOrderId = await Payment({
        $match: {
            orderId: body.razorpay_order_id
        }
    })

    if (!checkOrderId) {
        return NextResponse.json({ success: false, message: "Order Id not found" })
    }

    let secret = process.env.NEXT_PUBLIC_RAZORPAY_KEY_SECRET

    let validatePayment = validatePaymentVerification({ "order_id": body.razorpay_order_id, "payment_id": body.razorpay_payment_id }, body.razorpay_signature, secret)

    if (validatePayment) {
        const updatePayment = await Payment.findOneAndUpdate({ orderId: body.razorpay_order_id }, { status: "completed" }, { new: true })

        return NextResponse.redirect(`http:localhost:3000/user-home/ride-completion?paymentdone=true`)
    }

    return NextResponse.json({ success: false, message: "Payment Verification Failed" })

}