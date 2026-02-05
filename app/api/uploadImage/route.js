import connectDB from "@/db/connectDB";
import User from "@/models/User";
import cloudinary from "@/lib/cloudinary";

export async function POST(req) {
    try {
        await connectDB();

        const formData = await req.formData();
        const email = formData.get("email");
        const file = formData.get("image");

        if (!file || typeof file.arrayBuffer !== "function") {
            return Response.json({ success: false, message: "Invalid image" }, { status: 400 });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return Response.json({ success: false, message: "User not found." }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    folder: "uploads",
                    resource_type: "image",
                    transformation: [
                        { width: 800, crop: "limit" },
                        { quality: "auto", fetch_format: "auto" }
                    ]
                },
                (error, result) => {
                    if (error) reject(error);
                    resolve(result);
                }
            ).end(buffer);
        });

        user.image = uploadResult.secure_url;
        await user.save();

        return Response.json({
            success: true,
            url: uploadResult.secure_url,
            public_id: uploadResult.public_id,
        });


    } catch (err) {
        console.error(err);
        return Response.json({ success: false, message: "Upload failed" }, { status: 500 });
    }
}
