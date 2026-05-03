import { ApiError } from "../utils/apiError.js";

export function notFound(req, res, next) {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
}

export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const isProduction = process.env.NODE_ENV === "production";

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server error",
    details: err.details || undefined,
    stack: isProduction ? undefined : err.stack
  });
}
