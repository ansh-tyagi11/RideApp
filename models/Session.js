import mongoose from "mongoose";
import { Schema, model } from "mongoose";

const sessionSchema = new Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            unique: true,
            required: true,
        },
        sessionId: { type: String, required: true, unique: true, expiresAt: Date, },
    }, { timeStap: true, }
)

export default mongoose.models.Session || model('Session', sessionSchema);