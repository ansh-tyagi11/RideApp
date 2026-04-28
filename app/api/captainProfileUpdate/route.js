import connectDB from "@/db/connectDB";
import User from "@/models/User";
import { verifyPassword, hashedPassword } from "@/utils/generateOtp";
import { cookies } from "next/headers";

export async function POST(req) {
    const { email, data } = await req.json();
    await connectDB();

    const { tel, address, vehicleModel, licencePlateNumber, vehicleColor, seatingCapacity, currentPassword, newPassword, status } = data;
    
    let user = await User.findOne({ email });
    if (!user) return new Response(JSON.stringify({ success: false, message: "User not found." }));

    const updateQuery = {
        $set: { role: "captain", }
    };

    if (tel) updateQuery.$set.phone = tel;
    if (address) updateQuery.$set.address = address;
    if (licencePlateNumber) updateQuery.$set["captain.licenceNumber"] = licencePlateNumber;
    if (vehicleModel) updateQuery.$set["captain.vehicle.model"] = vehicleModel;
    if (vehicleColor) updateQuery.$set["captain.vehicle.vehicleColor"] = vehicleColor;
    if (seatingCapacity) updateQuery.$set["captain.vehicle.seatingCapacity"] = seatingCapacity;
    if (status === "active" || status === "inactive") updateQuery.$set["captain.status"] = status;

    if (newPassword) {
        let storedPasswordHash = user.signUp?.password;

        if (!storedPasswordHash) return new Response(JSON.stringify({ success: false, error: "User has no password. Please use social login or reset password." }));

        let isCurrentPasswordValid = await verifyPassword(storedPasswordHash, currentPassword);

        if (!isCurrentPasswordValid) return new Response(JSON.stringify({ success: false, error: "Incorrect current password." }));

        updateQuery.$set["signUp.password"] = await hashedPassword(newPassword);
    }

    if (Object.keys(updateQuery.$set).length > 1) {
        await User.updateOne(
            { email },
            updateQuery
        );
    }

    return new Response(JSON.stringify({ success: true, message: "Captain profile updated successfully." }));

}

export async function PUT(req) {
    const { email } = await req.json();
    await connectDB();

    const user = await User.findOneAndUpdate({ email: email }, { $set: { role: "user" } }, { new: true });
    return new Response(JSON.stringify({ success: true, message: "Role updated successfully." }));
}

export async function DELETE(req) {
    const cookieStore = await cookies();
    try {
        cookieStore.delete("sessionId");
    } catch (err) {
        return new Response(JSON.stringify({ success: false, message: "Unable to log out. Please try again." }));
    }

    return new Response(JSON.stringify({ success: true, message: "Logged out successfully.", redirect: "/login" }));
}
