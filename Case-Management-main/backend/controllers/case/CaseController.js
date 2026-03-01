import Case from "../../models/Case.js";
import Evidence from "../../models/Evidence.js";
import fs from "fs"; // For deleting local files

// 1. GET ALL CASES (With Evidence Details)
export const getAllCases = async (req, res) => {
  try {
    // Fetch all cases
    const cases = await Case.find().populate("officer", "name email");

    // Manually attach evidence to each case
    const casesWithDetails = await Promise.all(
      cases.map(async (c) => {
        const evidence = await Evidence.find({ caseId: c._id });
        return {
          ...c._doc,
          evidenceList: evidence
        };
      })
    );

    res.status(200).json(casesWithDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. CLOSE A CASE
export const closeCase = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Check if ID exists in request
    if (!id) {
      return res.status(400).json({ message: "Case ID is required" });
    }

    // 2. Attempt the update
    const updatedCase = await Case.findByIdAndUpdate(
      id,
      { status: "Closed" },
      { new: true }
    );

    // 3. If no case was found with that ID, return 404
    if (!updatedCase) {
      return res.status(404).json({ message: "No case found with this ID" });
    }

    res.status(200).json(updatedCase);
  } catch (error) {
    // If the ID is not a valid MongoDB ObjectId format, it throws a CastError
    res.status(500).json({ message: error.message });
  }
};

// 3. DELETE EVIDENCE (And its local file)
export const deleteEvidence = async (req, res) => {
  try {
    const evidence = await Evidence.findById(req.params.evidenceId);
    if (!evidence) return res.status(404).json({ message: "Evidence not found" });

    // Optional: Delete the physical file from server if localPath exists
    if (evidence.localPath && fs.existsSync(evidence.localPath)) {
      fs.unlinkSync(evidence.localPath);
    }

    await Evidence.findByIdAndDelete(req.params.evidenceId);
    res.status(200).json({ message: "Evidence deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};