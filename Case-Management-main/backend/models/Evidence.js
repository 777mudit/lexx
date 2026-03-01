  import mongoose from "mongoose";

  const EvidenceSchema = new mongoose.Schema(
    {
      title: { type: String, required: true },
      caseId: { type: mongoose.Schema.Types.ObjectId, ref: "Case", required: true, index: true },
      officerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
      fileUrl: { type: String, required: true },
      localPath: { type: String }, // This stores the server file path
      aiAnalysis: {
        report: { type: String }, 
        confidence: { type: Number },
        generatedAt: { type: Date, default: Date.now }
      },
      verificationStatus: {
        type: String,
        enum: ["Pending", "Verified", "Rejected"],
        default: "Pending"
      },
      verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    },
    { timestamps: true }
  );

  export default mongoose.model("Evidence", EvidenceSchema);