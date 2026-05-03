import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import { Admin } from "./models/Admin.js";
import { Setting } from "./models/Setting.js";

async function bootstrap() {
  await connectDB();

  const adminCount = await Admin.countDocuments();
  if (adminCount === 0) {
    await Admin.create({
      name: "System Admin",
      email: "admin@feespro.local",
      password: "Admin@12345",
      role: "owner"
    });
    console.log("Default admin created: admin@feespro.local / Admin@12345");
  } else {
    console.log("Admin already exists. No admin records changed.");
  }

  const settings = await Setting.findOne();
  if (!settings) {
    await Setting.create({
      instituteName: "FeesPro Academy",
      institutePhone: "+91 98765 43210",
      instituteEmail: "accounts@feespro.local",
      address: "Main Road, New Delhi",
      publicAppUrl: process.env.PUBLIC_APP_URL || "",
      upiId: process.env.DEFAULT_UPI_ID || "name@upi"
    });
    console.log("Default settings created.");
  } else {
    console.log("Settings already exist. No settings changed.");
  }

  await mongoose.disconnect();
}

bootstrap().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
