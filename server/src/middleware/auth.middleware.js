import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiError.js";
import { Admin } from "../models/Admin.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : req.cookies?.token;

  if (!token) {
    throw new ApiError(401, "Authentication required");
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const admin = await Admin.findById(decoded.id).select("-password");

  if (!admin || !admin.isActive) {
    throw new ApiError(401, "Invalid or inactive admin account");
  }

  req.admin = admin;
  next();
});

export const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.admin.role)) {
    throw new ApiError(403, "You do not have permission for this action");
  }
  next();
};
