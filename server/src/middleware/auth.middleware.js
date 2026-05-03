import jwt from "jsonwebtoken";

// 🔐 PROTECT ROUTE
export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    const token =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 👉 IMPORTANT: match with controller
    req.admin = { id: decoded.id };

    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

// 🔐 AUTHORIZE (optional)
export const authorize = (...roles) => {
  return (req, res, next) => {
    next();
  };
};