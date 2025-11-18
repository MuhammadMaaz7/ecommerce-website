import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import User from "../models/User.js";
import connectDB from "../config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from backend directory
dotenv.config({ path: join(__dirname, '../.env') });
connectDB();

const makeAdmin = async (email) => {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.error("❌ User not found with email:", email);
      process.exit(1);
    }

    user.role = "admin";
    await user.save();

    console.log("✅ User is now an admin:", user.email);
    process.exit();
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

const email = process.argv[2];

if (!email) {
  console.error("❌ Please provide an email address");
  console.log("Usage: node scripts/makeAdmin.js user@example.com");
  process.exit(1);
}

makeAdmin(email);
