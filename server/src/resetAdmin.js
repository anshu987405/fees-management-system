import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import { Admin } from "./models/Admin.js";

async function resetAdmin() {
  await connectDB();

  const email = "admin@feespro.local";
  let admin = await Admin.findOne({ email }).select("+password");

  if (!admin) {
    admin = new Admin({
      name: "System Admin",
      email,
      role: "owner",
      password: "Admin@12345",
      isActive: true
    });
  } else {
    admin.password = "Admin@12345";
    admin.isActive = true;
  }

  await admin.save();
  console.log("Login reset complete:");
  console.log("Email: admin@feespro.local");
  console.log("Password: Admin@12345");

  await mongoose.disconnect();
}

resetAdmin().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
