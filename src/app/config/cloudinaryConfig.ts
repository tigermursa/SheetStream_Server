// src/services/cloudinaryConfig.ts
import cloudinary from "cloudinary";
import { File } from "../modules/File/file.model";
import { convertDocxToHtml } from "../modules/File/file.services";
import fs from "fs/promises"; // Importing fs for file operations
import dotenv from "dotenv"; // Import dotenv to load environment variables

// Load environment variables from .env file
dotenv.config();

// Log Cloudinary configuration for debugging
if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  throw new Error("Cloudinary configuration missing in environment variables.");
}

// Configure Cloudinary with environment variables
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload and convert the file
const uploadAndConvertFile = async (
  file: Express.Multer.File
): Promise<void> => {
  try {
    // Read the uploaded file from multer
    const fileBuffer = await fs.readFile(file.path);

    // Convert DOCX file to HTML
    const htmlContent = await convertDocxToHtml(fileBuffer);

    // Upload the file to Cloudinary using a stream
    const cloudinaryResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.v2.uploader.upload_stream(
        { resource_type: "raw" },
        (error: any, result: unknown) => {
          if (error) {
            return reject(error);
          }
          resolve(result);
        }
      );
      // Pass the file buffer to the stream
      stream.end(fileBuffer);
    });

    // Create a new File document with the Cloudinary URL and HTML content
    const fileDoc = new File({
      fileName: file.originalname,
      filePath: (cloudinaryResult as any).secure_url, // Use the secure URL from Cloudinary
      htmlContent,
    });

    // Save the document to the database
    await fileDoc.save();

    // Delete the local file if needed
    await fs.unlink(file.path);
  } catch (error) {
    console.error("Error during file upload and conversion:", error);
    throw new Error("Upload and conversion process failed.");
  }
};

export { uploadAndConvertFile };
