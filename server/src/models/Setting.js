import mongoose from "mongoose";

const settingSchema = new mongoose.Schema(
  {
    instituteName: { type: String, default: "FeesPro Academy" },
    institutePhone: { type: String, default: "" },
    instituteEmail: { type: String, default: "" },
    address: { type: String, default: "" },
    upiId: { type: String, default: () => process.env.DEFAULT_UPI_ID || "name@upi" },
    publicAppUrl: { type: String, default: () => process.env.PUBLIC_APP_URL || "" },
    autoWhatsappReminders: { type: Boolean, default: false },
    reminderOverdueDays: { type: Number, default: 30 }
  },
  { timestamps: true }
);

export const Setting = mongoose.model("Setting", settingSchema);
