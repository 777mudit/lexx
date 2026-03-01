import Evidence from "../../models/Evidence.js";

export const getPendingEvidence = async (req, res) => {
  try {
    const pendingEvidence = await Evidence.find({
      verificationStatus: "Pending",
    })
      .populate({
        path: "caseId",
        populate: {
          path: "officer",
          select: "name email",
        },
      })
      .sort({ createdAt: -1 });

    res.json(pendingEvidence);
  } catch (error) {
    console.error(error);+
    res.status(500).json({ message: error.message });
  }
};
