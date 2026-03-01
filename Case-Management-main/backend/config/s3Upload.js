//currently not working but have substitue in verifyEvidenceController.js

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
 * Uploads a local file to S3 and returns the public URL
 * @param {string} localPath - The path to the local file
 * @param {string} folder - The S3 folder name (e.g., 'evidence')
 */
export const uploadToS3 = async (localPath, folder = "uploads") => {
  const fileContent = fs.readFileSync(localPath);
  const fileName = localPath.split("/").pop();
  const contentType = mime.lookup(localPath) || "application/octet-stream";

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${folder}/${Date.now()}-${fileName}`,
    Body: fileContent,
    ACL: "public-read",
    ContentType: contentType,
  };

  const result = await s3.upload(params).promise();
  return result.Location;
};