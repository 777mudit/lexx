import express from "express";
import { uploadEvidence } from "../controllers/evidence/geminiEvidenceController.js";
import { verifyEvidence } from "../controllers/evidence/verifyEvidenceController.js";
import { getMyEvidence } from "../controllers/evidence/getMyEvidence.js";
import { getPendingEvidence } from "../controllers/evidence/getPendingEvidenceController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Upload evidence (officers and lawyers)
router.post("/upload", protect, authorize("officer", "admin", "lawyer"), upload.single("file"), uploadEvidence);

// Manual verification (admins only)
router.patch("/verify/:evidenceId", protect, authorize("admin"), verifyEvidence);

// Get pending evidence for verification (admins only)
router.get("/pending", protect, authorize("admin"), getPendingEvidence);

// Get evidence uploaded by the logged-in user
router.get("/my-evidence", protect, authorize("officer", "lawyer"), getMyEvidence);

export default router;  