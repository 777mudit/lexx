import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import caseRoutes from "./routes/caseRoutes.js";
import evidenceRoutes from "./routes/evidenceRoutes.js";
import { initCleanupCron } from "./config/cleanup.js";

dotenv.config();
connectDB();
initCleanupCron();

const app = express();

// Security Middleware
app.use(helmet());

// Enable CORS
app.use(cors({
  origin: true,
  credentials: true
}));

// Body Parser
app.use(express.json());
// This makes the 'uploads' folder public
app.use("/uploads", express.json(), express.static(path.join(process.cwd(), "uploads")));
app.use(express.urlencoded({ extended: false }));

// Logging
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/cases", caseRoutes);
app.use("/api/evidence", evidenceRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  res.status(500).json({
    message: err.message || "Server Error"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});