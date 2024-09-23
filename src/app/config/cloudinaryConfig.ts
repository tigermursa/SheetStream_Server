// services/cloudinaryConfig.ts
import cloudinary from 'cloudinary';
import { File } from '../modules/File/file.model';
import { convertDocxToHtml } from '../modules/File/file.services';
import fs from 'fs/promises'; // Importing fs for file operations
import dotenv from 'dotenv'; // Import dotenv to load environment variables

// Load environment variables from .env file
dotenv.config();

// Log Cloudinary configuration for debugging
console.log("Cloudinary Config:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

    // Upload the file to Cloudinary
    const cloudinaryResult = await cloudinary.v2.uploader.upload(file.path, {
      resource_type: "raw", // Use 'raw' for non-image files
    });

    // Create a new File document with the Cloudinary URL and HTML content
    const fileDoc = new File({
      fileName: file.originalname,
      filePath: cloudinaryResult.secure_url, // Use the secure URL from Cloudinary
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
