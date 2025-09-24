import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ncstcs";

export async function connectDB() {
  await mongoose.connect(MONGO_URI, {
    dbName: "ncstcsdb"
  });
  console.log("Connected to MongoDB");
}
