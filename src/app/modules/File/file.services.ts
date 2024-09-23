import { File } from "./file.model";
import fs from "fs/promises";
import path from "path";
import mammoth from "mammoth";
import { isValidObjectId } from "mongoose";
import { IFile } from "./file.Interface";
import cloudinary from "cloudinary";

// Function to convert DOCX to HTML
const convertDocxToHtml = async (buffer: Buffer): Promise<string> => {
  try {
    const { value: htmlContent } = await mammoth.convertToHtml({ buffer });
    return htmlContent || "<p>No content found in the document.</p>";
  } catch (error) {
    console.error("Error converting DOCX to HTML:", error);
    throw new Error("Failed to convert DOCX to HTML.");
  }
};

// Function to upload and convert the file
const uploadAndConvertFile = async (
  file: Express.Multer.File
): Promise<void> => {
  try {
    const fileBuffer = await fs.readFile(file.path); // Read the uploaded file from multer
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

    await fileDoc.save();

    // Delete the local file if needed
    await fs.unlink(file.path);
  } catch (error) {
    console.error("Error during file upload and conversion:", error);
    throw new Error("Upload and conversion process failed.");
  }
};


const getAllFiles = async () => {
  try {
    return await File.find().select(
      "imageOne  title fileName shortDescription  uploadDate isOnline"
    );
  } catch (error) {
    console.error("Error retrieving files:", error);
    throw new Error("Failed to retrieve files.");
  }
};

const updateFileContent = async (
  fileId: string,
  htmlContent: string,
  imageOne?: string,
  imageTwo?: string,
  title?: string,
  isOnline?: boolean,
  shortDescription?: string
) => {
  try {
    const updateFields: Partial<IFile> = { htmlContent };

    if (imageOne) updateFields.imageOne = imageOne;
    if (imageTwo) updateFields.imageTwo = imageTwo;
    if (title) updateFields.title = title;
    if (shortDescription) updateFields.shortDescription = shortDescription;
    if (typeof isOnline === "boolean") {
      updateFields.isOnline = isOnline;
    }

    const file = await File.findByIdAndUpdate(fileId, updateFields, {
      new: true,
    });

    return file !== null;
  } catch (error) {
    console.error("Error updating file content:", error);
    throw new Error("Failed to update file content.");
  }
};

const getFileById = async (fileId: string) => {
  try {
    const file = await File.findById(fileId);
    return file;
  } catch (error) {
    console.error("Error retrieving file:", error);
    throw new Error("Failed to retrieve file.");
  }
};

const deleteFile = async (fileId: string) => {
  try {
    if (!isValidObjectId(fileId)) {
      throw new Error(`Invalid ID: ${fileId}`);
    }

    const file = await File.findById(fileId);
    if (!file) {
      return { message: `No file found with ID: ${fileId}`, success: false };
    }

    // Attempt to delete the file from the database
    await File.findByIdAndDelete(fileId);

    // Check if the file exists before attempting to delete it
    try {
      await fs.access(file.filePath); // Check if the file exists
      await fs.unlink(file.filePath); // Delete the file
    } catch (err) {
      console.warn(`File not found on the filesystem: ${file.filePath}`);
    }

    return { message: "File deleted successfully", success: true };
  } catch (error) {
    console.error("Error retrieving file:", error);
    throw new Error("Failed to retrieve file.");
  }
};

const searchFilesByTitle = async (searchQuery = "") => {
  try {
    const regex = new RegExp(`^${searchQuery}`, "i"); // Case-insensitive, starts with
    return await File.find({ title: { $regex: regex } }).select("_id title");
  } catch (error) {
    console.error("Error searching files:", error);
    throw new Error("Failed to search files.");
  }
};

export {
  convertDocxToHtml,
  uploadAndConvertFile,
  getAllFiles,
  updateFileContent,
  getFileById,
  deleteFile,
  searchFilesByTitle,
};
