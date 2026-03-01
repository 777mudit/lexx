import AWS from "aws-sdk";
import fs from "fs";
import mime from "mime-types"; // Import this
import Evidence from "../../models/Evidence.js";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_SECRET,
  region: process.env.AWS_REGION,
});

export const verifyEvidence = async (req, res) => {
  try {
    const { status } = req.body;
    const { evidenceId } = req.params;

    const evidence = await Evidence.findById(evidenceId);
    if (!evidence) return res.status(404).json({ message: "Evidence not found" });

    evidence.verificationStatus = status;
    evidence.verifiedBy = req.user._id;

    if (status === "Verified") {
      const localFilePath = evidence.localPath;
      const fileContent = fs.readFileSync(localFilePath);

      // 1. Detect the file type (e.g., image/jpeg, application/pdf)
      const contentType = mime.lookup(localFilePath) || "application/octet-stream";

      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `evidence/${Date.now()}-${localFilePath.split("/").pop()}`,
        Body: fileContent,
        ACL: "public-read", // 2. Makes it accessible to the browser
        ContentType: contentType, // 3. Prevents forced download
      };

      const uploadResult = await s3.upload(params).promise();

      evidence.fileUrl = uploadResult.Location;
      await evidence.save();

      // Clean up local file
      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
      }
    }

    await evidence.save();
    res.json({ message: `Evidence ${status}`, evidence });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};




// import Evidence from "../models/Evidence.js";

// // Manual verification by admin
// export const verifyEvidence = async (req, res) => {
//   try {
//     const { status } = req.body; // Expected: "Verified" or "Rejected"
//     const { evidenceId } = req.params;

//     if (!["Verified", "Rejected"].includes(status)) {
//       return res.status(400).json({ message: "Invalid status" });
//     }

//     const evidence = await Evidence.findById(evidenceId);
//     if (!evidence) return res.status(404).json({ message: "Evidence not found" });

//     // Update verification status and who verified
//     evidence.verificationStatus = status;
//     evidence.verifiedBy = req.user._id; // Admin ID
//     await evidence.save();

//     res.json({ message: `Evidence ${status}`, evidence });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };



// import { uploadToS3 } from "../../utils/s3Upload.js";
// import fs from "fs";

// export const verifyEvidence = async (req, res) => {
//   try {
//     const { status } = req.body;
//     const { evidenceId } = req.params;

//     const evidence = await Evidence.findById(evidenceId);
//     if (!evidence) return res.status(404).json({ message: "Evidence not found" });

//     evidence.verificationStatus = status;
//     evidence.verifiedBy = req.user._id;

//     if (status === "Verified") {
//       const localFilePath = evidence.fileUrl;
      
//       // Use the helper here
//       evidence.fileUrl = await uploadToS3(localFilePath, "evidence");

//       // Cleanup
//       if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
//     }

//     await evidence.save();
//     res.json({ message: `Evidence ${status}`, evidence });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };