import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import { Admin } from "./models/Admin.js";

async function resetAdmin() {
  await connectDB();

  const email = process.env.ADMIN_EMAIL || "admin@feespro.com";
  const password = process.env.ADMIN_PASSWORD || "anshu@#8923";
  let admin = await Admin.findOne({ email }).select("+password");

  if (!admin) {
    admin = new Admin({
      name: "System Admin",
      email,
      role: "owner",
      password,
      isActive: true
    });
  } else {
    admin.password = password;
    admin.isActive = true;
  }

  await admin.save();
  console.log("Login reset complete:");
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);

  await mongoose.disconnect();
}

resetAdmin().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
