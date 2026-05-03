import { Admin } from "../models/Admin.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { cookieOptions, signToken } from "../services/token.service.js";

function adminResponse(admin) {
  return {
    id: admin._id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
    avatarUrl: admin.avatarUrl
  };
}

export const login = asyncHandler(async (req, res) => {
  const admin = await Admin.findOne({ email: req.body.email }).select("+password");

  if (!admin || !(await admin.comparePassword(req.body.password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  if (!admin.isActive) {
    throw new ApiError(403, "Admin account is inactive");
  }

  admin.lastLoginAt = new Date();
  await admin.save();

  const token = signToken(admin);
  res.cookie("token", token, cookieOptions()).json({
    success: true,
    token,
    admin: adminResponse(admin)
  });
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token", cookieOptions()).json({ success: true });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ success: true, admin: adminResponse(req.admin) });
});
