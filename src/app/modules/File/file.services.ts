import { File } from "./file.model";
import fs from "fs/promises";
import mammoth from "mammoth";
import { isValidObjectId } from "mongoose";
import { IFile } from "./file.Interface";
import { cloudinaryInstance } from "../../config/cloudinaryConfig";

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

// Function to upload and convert DOCX to HTML
const uploadAndConvertFile = async (
  file: Express.Multer.File,
  userID: string,
  writer: string
): Promise<void> => {
  try {
    const fileBuffer = await fs.readFile(file.path); // Read the uploaded file

    // Convert DOCX to HTML
    const htmlContent = await convertDocxToHtml(fileBuffer);

    // Upload the file to Cloudinary
    const cloudinaryResult = await new Promise((resolve, reject) => {
      const stream = cloudinaryInstance.uploader.upload_stream(
        { resource_type: "raw" },
        (error: any, result: unknown) => {
          if (error) reject(error);
          resolve(result);
        }
      );
      stream.end(fileBuffer);
    });

    // Create a new file document
    const fileDoc = new File({
      userID,
      writer,
      fileName: file.originalname,
      filePath: (cloudinaryResult as any).secure_url,
      htmlContent,
    });

    await fileDoc.save(); // Save the document in the DB

    // Remove the local file after upload
    await fs.unlink(file.path);
  } catch (error) {
    console.error("Error during file upload and conversion:", error);
    throw new Error("Upload and conversion process failed.");
  }
};

const getAllFiles = async () => {
  try {
    return await File.find().select(
      "imageOne title description fileName uploadDate isOnline"
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
  description?: string,
  isOnline?: boolean
) => {
  try {
    const updateFields: Partial<IFile> = { htmlContent };

    if (imageOne) updateFields.imageOne = imageOne;
    if (imageTwo) updateFields.imageTwo = imageTwo;
    if (title) updateFields.title = title;
    if (description) updateFields.description = description;
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
    if (file.filePath.startsWith("http")) {
      console.warn("File hosted remotely, skipping local deletion.");
    } else {
      try {
        await fs.access(file.filePath); // Check if the file exists
        await fs.unlink(file.filePath); // Delete the file
      } catch (err) {
        console.warn(`File not found on the filesystem: ${file.filePath}`);
      }
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
