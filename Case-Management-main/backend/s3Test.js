import AWS from "aws-sdk";
import dotenv from "dotenv";
dotenv.config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_SECRET,
  region: process.env.AWS_REGION,
});

const testConnection = async () => {
  try {
    console.log("Checking connection to AWS...");
    const data = await s3.listBuckets().promise();
    console.log("Success! Found buckets:", data.Buckets.map(b => b.Name));
  } catch (err) {
    console.error("Connection failed! Error:", err.message);
  }
};

testConnection();