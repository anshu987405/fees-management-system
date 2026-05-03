import bcrypt from "bcryptjs";
import User from "../models/user.model.js";

// 🔐 LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // ✅ bcrypt compare
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({
        success: false,
        message: "Invalid email or password",
      });
    }

    res.json({
      success: true,
      message: "Login successful",
      user,
    });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// 🔁 RESET PASSWORD
export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // ✅ नया hash बनाओ
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// 👤 CURRENT USER
export const me = async (req, res) => {
  res.json({ success: true, user: req.user });
};

// 🚪 LOGOUT
export const logout = async (req, res) => {
  res.json({ success: true, message: "Logged out" });
};