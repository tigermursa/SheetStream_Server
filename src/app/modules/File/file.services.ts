import { File } from "./file.model";
import fs from "fs/promises";
import path from "path";
import mammoth from "mammoth";
import { isValidObjectId } from "mongoose";

const convertDocxToHtml = async (buffer: Buffer): Promise<string> => {
  try {
    const { value: htmlContent } = await mammoth.convertToHtml({ buffer });
    return htmlContent || "<p>No content found in the document.</p>";
  } catch (error) {
    console.error("Error converting DOCX to HTML:", error);
    throw new Error("Failed to convert DOCX to HTML.");
  }
};

const uploadAndConvertFile = async (
  file: Express.Multer.File
): Promise<void> => {
  const uploadPath = path.resolve(
    __dirname,
    "../../../../uploads",
    file.filename
  );

  try {
    const fileBuffer = await fs.readFile(uploadPath);
    const htmlContent = await convertDocxToHtml(fileBuffer);

    const fileDoc = new File({
      fileName: file.originalname,
      filePath: uploadPath,
      htmlContent,
    });
    await fileDoc.save();

    await fs.unlink(uploadPath);
  } catch (error) {
    console.error("Error during file upload and conversion:", error);
    throw new Error("Upload and conversion process failed.");
  }
};

const getAllFiles = async () => {
  try {
    return await File.find().select("fileName htmlContent uploadDate");
  } catch (error) {
    console.error("Error retrieving files:", error);
    throw new Error("Failed to retrieve files.");
  }
};

const updateFileContent = async (fileId: string, htmlContent: string) => {
  try {
    const file = await File.findByIdAndUpdate(
      fileId,
      { htmlContent },
      { new: true }
    );
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

export {
  convertDocxToHtml,
  uploadAndConvertFile,
  getAllFiles,
  updateFileContent,
  getFileById,
  deleteFile,
};
