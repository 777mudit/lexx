// controllers/caseController.js
import Case from "../../models/Case.js";

export const getUserCases = async (req, res) => {
  try {
    // The ID comes directly from the decoded token via middleware
    const userId = req.user.id;

    // Fetch cases where the 'officer' field matches the ID from the token
    const cases = await Case.find({ officer: userId });

    res.status(200).json({
      success: true,
      count: cases.length,
      data: cases
    });
  } catch (error) {
    console.error("Fetch Cases Error:", error);
    res.status(500).json({ message: "Server error while fetching cases" });
  }
};