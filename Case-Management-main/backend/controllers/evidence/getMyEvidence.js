// controllers/evidenceController.js
import Evidence from "../../models/Evidence.js";

export const getMyEvidence = async (req, res) => {
  try {
    // 1. Get the ID from the token (via protect middleware)
    const officerId = req.user.id;
    const role = req.user.role;

    // 2. Query Evidence where officerId matches the token ID
    // If user is a lawyer, let them view all evidence for the registered cases.
    const query = (role === 'lawyer' || role === 'admin') ? {} : { officerId: officerId };

    const evidences = await Evidence.find(query)
      .populate("caseId", "title")
      .sort({ createdAt: -1 }); // Show newest first

    // 3. Handle empty results
    if (!evidences || evidences.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No evidence found.",
        data: []
      });
    }

    res.status(200).json({
      success: true,
      count: evidences.length,
      data: evidences
    });
  } catch (error) {
    console.error("Fetch Evidence Error:", error);
    res.status(500).json({ message: "Server error while fetching evidence" });
  }
};