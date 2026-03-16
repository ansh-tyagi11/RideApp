import mongoose from "mongoose";

const connectDB = async () => {
    if (mongoose.connections[0].readyState) {
        return mongoose.connections[0];
    }
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        return conn;
    } catch (error) {
        console.error("Failed to connect to MongoDB. Check MONGO_URI in .env.local.");
        console.error(error);
        throw error;
    }
}

export default connectDB;
