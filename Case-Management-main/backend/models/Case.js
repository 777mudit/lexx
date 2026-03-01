import mongoose from "mongoose";

const CaseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    officer: { type: mongoose.Schema.Types.ObjectId, ref : "User", required: true }, // or link to User later
    status: { 
      type: String, 
      enum: ["Open", "Closed"], 
      default: "Open" 
    },
  },
  { timestamps: true }
);

export default mongoose.model("Case", CaseSchema);
