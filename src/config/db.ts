import mongoose from "mongoose";

// Connect to MongoDB

export async function mongoConnect() {
    try {
        await mongoose.connect('mongodb+srv://master:master123@project.x5nddwe.mongodb.net/image_processing?retryWrites=true&w=majority');
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("MongoDB connection error:", err);
    }
}
