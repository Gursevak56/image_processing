import mongoose from "mongoose";

// Connect to MongoDB

export function mongoConnect() {
    mongoose.connect('mongodb://localhost:27017/image_processing')
    .then(() => console.log("Connected to MongoDB"))
    .catch((err: any) => console.error("MongoDB connection error:", err));
}