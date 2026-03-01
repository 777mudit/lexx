import Case from "../../models/Case.js";
import Evidence from "../../models/Evidence.js";

// Get single Case with Evidence
export const getCaseById = async (req, res) => {
  try {
    const caseItem = await Case.findById(req.params.id)
      .populate("officer", "name email role");

    if (!caseItem) return res.status(404).json({ message: "Case not found" });

    const evidence = await Evidence.find({ caseId: caseItem._id })
    .populate("verifiedBy", "name")
    .sort({ createdAt: -1 });

    res.json({ case: caseItem, evidence });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};