import "dotenv/config";
import fs from "fs";
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import { connectDB } from "./config/db.js";
import apiRoutes from "./routes/index.js";
import { errorHandler, notFound } from "./middleware/error.middleware.js";
import { Admin } from "./models/Admin.js";
import { Setting } from "./models/Setting.js";

const app = express();
const port = process.env.PORT || 5000;

// Upload path
const uploadPath = path.resolve(process.cwd(), process.env.UPLOAD_DIR || "uploads");

// Frontend dist path detect
const clientDistCandidates = [
  path.resolve(process.cwd(), "../client/dist"),
  path.resolve(process.cwd(), "client/dist"),
];
const clientDist = clientDistCandidates.find((candidate) =>
  fs.existsSync(path.join(candidate, "index.html"))
);

// Allowed origins
const allowedOrigins = [
  ...(process.env.CLIENT_URL || "http://localhost:5173").split(","),
  ...(process.env.PUBLIC_APP_URL ? [process.env.PUBLIC_APP_URL] : [])
].map((origin) => origin.trim()).filter(Boolean);

function corsOrigin(origin, callback) {
  if (!origin) return callback(null, true);

  try {
    const url = new URL(origin);
    const host = url.hostname;

    const isLocal =
      host === "localhost" ||
      host === "127.0.0.1" ||
      host === "::1";

    const isPrivateLan = /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[0-1])\.)/.test(host);
    const isRender = host.endsWith(".onrender.com");

    if (allowedOrigins.includes(origin) || isLocal || isPrivateLan || isRender) {
      return callback(null, true);
    }
  } catch {
    return callback(null, false);
  }

  return callback(null, false);
}

// Middleware
app.set("trust proxy", 1);
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({ origin: corsOrigin, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// Static uploads
app.use("/uploads", express.static(uploadPath));

/* ============================
   ✅ ADD THIS FIXED ROUTE
============================ */
app.get("/api", (req, res) => {
  res.send("API is working 🚀");
});

/* ============================
   API ROUTES
============================ */
app.use("/api", apiRoutes);

/* ============================
   FRONTEND SERVE (if exists)
============================ */
if (clientDist) {
  app.use(express.static(clientDist));

  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api") || req.path.startsWith("/uploads")) {
      return next();
    }
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

/* ============================
   ERROR HANDLING
============================ */
app.use(notFound);
app.use(errorHandler);

/* ============================
   START SERVER
============================ */
async function ensureDefaultData() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@feespro.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "anshu@#8923";

  const admin = await Admin.findOne({ email: adminEmail });
  if (!admin) {
    await Admin.create({
      name: process.env.ADMIN_NAME || "System Admin",
      email: adminEmail,
      password: adminPassword,
      role: "owner",
      isActive: true
    });
    console.log(`Default admin created: ${adminEmail}`);
  }

  const settings = await Setting.findOne();
  if (!settings) {
    await Setting.create({
      instituteName: "FeesPro Academy",
      institutePhone: "",
      instituteEmail: adminEmail,
      address: "",
      upiId: process.env.DEFAULT_UPI_ID || "name@upi",
      publicAppUrl: process.env.PUBLIC_APP_URL || ""
    });
    console.log("Default settings created");
  }
}

connectDB()
  .then(ensureDefaultData)
  .then(() => {
    app.listen(port, () => {
      console.log(`API running on http://localhost:${port}/api`);
    });
  })
  .catch((error) => {
    console.error("Failed to start API", error);
    process.exit(1);
  });

export default app;
