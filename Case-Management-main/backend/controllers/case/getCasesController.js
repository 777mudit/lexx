import Case from "../../models/Case.js";
import Evidence from "../../models/Evidence.js";

// Get all Cases (populate officer details)
export const getCases = async (req, res) => {
  try {
    const cases = await Case.find()
      .populate("officer", "name email role") // only select these fields
      .sort({ createdAt: -1 });

    // Filter to show ONLY cases specifically registered by an officer (removing dummy/admin cases)
    const officerCases = cases.filter(c => c.officer && c.officer.role === 'officer');

    res.json(officerCases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};