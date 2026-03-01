import AWS from "aws-sdk";
import fs from "fs";
import mime from "mime-types";
import dotenv from "dotenv";
dotenv.config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_SECRET,
  region: process.env.AWS_REGION,
});


/**
 * Deletes a file from S3
 * @param {string} fileUrl - The full S3 URL of the file
 */
export const deleteFromS3 = async (fileUrl) => {
  try {
    // Extract the Key from the URL (everything after the bucket name/domain)
    // Example: https://my-bucket.s3.region.amazonaws.com/evidence/123.jpg 
    // Key becomes: evidence/123.jpg
    const fileKey = fileUrl.split('.com/')[1];

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: decodeURIComponent(fileKey), // Decodes spaces or special chars
    };

    await s3.deleteObject(params).promise();
    return { success: true };
  } catch (error) {
    console.error("S3 Delete Error:", error);
    return { success: false, error };
  }
};

//for futture to delete it when i delete it from the database


// import { deleteFromS3 } from "../../utils/s3delete.js";

// export const deleteEvidence = async (req, res) => {
//   const evidence = await Evidence.findById(req.params.id);
  
//   if (evidence && evidence.fileUrl.includes("amazonaws.com")) {
//     await deleteFromS3(evidence.fileUrl);
//   }
  
//   await Evidence.findByIdAndDelete(req.params.id);
//   res.json({ message: "Evidence and S3 file deleted." });
// };