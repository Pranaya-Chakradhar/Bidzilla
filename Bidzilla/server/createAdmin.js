import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/User.js";

dotenv.config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const existingAdmin = await User.findOne({ email: "admin@bidzilla.com" });
    if (existingAdmin) {
      console.log("Admin user already exists");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);
    const admin = new User({
      name: "Admin",
      email: "admin@bidzilla.com",
      password: hashedPassword,
      role: "admin",
    });

    await admin.save();
    console.log("Admin user created successfully");
    process.exit();
  } catch (error) {
    console.error("Error creating admin user:", error);
    process.exit(1);
  }
}

createAdmin();
