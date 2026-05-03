import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import { Admin } from "./models/Admin.js";
import { Setting } from "./models/Setting.js";

async function bootstrap() {
  await connectDB();

  const adminEmail = process.env.ADMIN_EMAIL || "admin@feespro.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "anshu@#8923";
  const admin = await Admin.findOne({ email: adminEmail });
  if (!admin) {
    await Admin.create({
      name: process.env.ADMIN_NAME || "System Admin",
      email: adminEmail,
      password: adminPassword,
      role: "owner"
    });
    console.log(`Default admin created: ${adminEmail}`);
  } else {
    console.log("Default admin already exists. No admin records changed.");
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
