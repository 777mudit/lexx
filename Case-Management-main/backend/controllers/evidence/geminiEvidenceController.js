import Evidence from "../../models/Evidence.js";
import Case from "../../models/Case.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import mongoose from "mongoose";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const uploadEvidence = async (req, res) => {
  let filePath;

  try {
    const { caseId, title } = req.body;

    // ---------------------------
    // 1️⃣ Validate caseId format
    // ---------------------------
    if (!mongoose.Types.ObjectId.isValid(caseId)) {
      return res.status(400).json({ message: "Invalid Case ID" });
    }

    // ---------------------------
    // 2️⃣ Check file existence
    // ---------------------------
    if (!req.file) {
      return res.status(400).json({ message: "File is required" });
    }

    filePath = req.file.path;
    const mimeType = req.file.mimetype;
    const officerId = req.user._id;

    // ---------------------------
    // 3️⃣ Check if case exists
    // ---------------------------
    const existingCase = await Case.findById(caseId);

    if (!existingCase) {
      return res.status(404).json({ message: "Case not found" });
    }

    // ---------------------------
    // 4️⃣ Ensure case is still open
    // ---------------------------
    if (existingCase.status !== "Open") {
      return res.status(400).json({ message: "Cannot upload evidence to a closed case" });
    }

    // ---------------------------
    // 5️⃣ Optional: Ensure officer owns the case (Lawyers and Admins bypass this)
    // ---------------------------
    if (existingCase.officer.toString() !== officerId.toString()) {
      if (req.user.role !== 'lawyer' && req.user.role !== 'admin') {
        return res.status(403).json({ message: "You are not assigned to this case" });
      }
    }

    // ---------------------------
    // 6️⃣ Read file asynchronously
    // ---------------------------
    const fileBuffer = await fs.promises.readFile(filePath);

    const fileData = {
      inlineData: {
        data: fileBuffer.toString("base64"),
        mimeType: mimeType,
      },
    };

    // ---------------------------
    // 7️⃣ Structured AI Prompt
    // ---------------------------
    const prompt = `
You are a forensic AI assistant.

Analyze this evidence for authenticity.

Return ONLY valid JSON in this exact format:
{
  "report": "detailed forensic analysis",
  "confidence": number between 0 and 1
}
`;

    // ---------------------------
    // 8️⃣ Call Gemini
    // ---------------------------
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" } // Forces pure JSON
    });
    const result = await model.generateContent([prompt, fileData]);
    const response = await result.response;
    const aiText = response.text();

    let parsedAI;

    try {
      const cleanedText = aiText.replace(/```json|```/g, "").trim();
      parsedAI = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("AI JSON Parse Error:", parseError);
      parsedAI = {
        report: aiText,
        confidence: 0,
      };
    }

    // When uploading evidence
    const localFilePath = req.file.path; // e.g., uploads/xxx.jpg
    const publicUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    // ---------------------------
    // 9️⃣ Save Evidence
    // ---------------------------
    const newEvidence = await Evidence.create({
      caseId,
      title,
      officerId,
      fileUrl: publicUrl,   // for frontend links
      localPath: localFilePath,  // for backend processing/S3 upload
      aiAnalysis: {
        report: parsedAI.report,
        confidence: parsedAI.confidence,
        generatedAt: new Date(),
      },
      verificationStatus: "Pending",
    });

    res.status(201).json(newEvidence);

  } catch (error) {
    console.error("Upload Evidence Error:", error);

    // Cleanup file if something fails
    if (filePath && fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }

    res.status(500).json({
      message: "Evidence upload or AI analysis failed",
      error: error.message,
    });
  }
};