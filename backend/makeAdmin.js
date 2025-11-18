import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

const makeAdmin = async (email) => {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.error("❌ User not found with email:", email);
      console.log("💡 Please sign up first on the website, then run this script again.");
      process.exit(1);
    }

    if (user.role === "admin") {
      console.log("ℹ️  User is already an admin:", user.email);
      process.exit(0);
    }

    user.role = "admin";
    await user.save();

    console.log("✅ User is now an admin!");
    console.log("📧 Email:", user.email);
    console.log("👤 Name:", user.name);
    console.log("🔑 Role:", user.role);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

const email = process.argv[2];

if (!email) {
  console.error("❌ Please provide an email address");
  console.log("Usage: node makeAdmin.js user@example.com");
  process.exit(1);
}

makeAdmin(email);
