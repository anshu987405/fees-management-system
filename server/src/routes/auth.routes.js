import bcrypt from "bcryptjs";
import User from "../models/user.model.js";

// 🔐 LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // user find
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    // ✅ bcrypt compare (MOST IMPORTANT)
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
    res.json({
      success: false,
      message: err.message,
    });
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

// 🆕 REGISTER ADMIN (optional)
export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exist = await User.findOne({ email });

    if (exist) {
      return res.json({
        success: false,
        message: "User already exists",
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      role: "admin",
    });

    res.json({
      success: true,
      message: "Admin created",
      user,
    });
  } catch (err) {
    res.json({
      success: false,
      message: err.message,
    });
  }
};