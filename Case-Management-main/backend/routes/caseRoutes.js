import express from "express";
import { createCase } from "../controllers/case/createCaseController.js";
import { getCases } from "../controllers/case/getCasesController.js";
import { getCaseById } from "../controllers/case/getCaseByIdController.js";
import { getUserCases } from "../controllers/case/getUserCases.js";
import {getAllCases, closeCase, deleteEvidence} from "../controllers/case/CaseController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/allCases", protect, authorize("judge"), getAllCases);

// Only logged-in users can create cases
router.post("/", protect, authorize("officer", "admin", "judge"), createCase);

// Officers/admins can see all cases
router.get("/", protect, getCases);

// Get cases created by the logged-in user
router.get("/my-cases", protect, getUserCases);

// Get specific case with evidence
router.get("/:id", protect, getCaseById);

// these are only for judges
router.patch("/:id/close", protect, authorize("judge"), closeCase);
router.delete("/evidence/:evidenceId", protect, authorize("judge"), deleteEvidence);





export default router;