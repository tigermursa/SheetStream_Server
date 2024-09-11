import { File } from "./file.model";
import fs from "fs/promises";
import path from "path";
import mammoth from "mammoth";

export class FileService {
  // Convert DOCX to HTML using mammoth
  static async convertDocxToHtml(buffer: Buffer): Promise<string> {
    try {
      const { value: htmlContent } = await mammoth.convertToHtml({ buffer });
      return htmlContent || "<p>No content found in the document.</p>"; // Fallback for empty content
    } catch (error) {
      console.error("Error converting DOCX to HTML:", error);
      throw new Error("Failed to convert DOCX to HTML.");
    }
  }

  // Upload and process file
  static async uploadAndConvertFile(file: Express.Multer.File): Promise<void> {
    const uploadPath = path.resolve(
      __dirname,
      "../../../../uploads",
      file.filename
    );

    try {
      const fileBuffer = await fs.readFile(uploadPath);

      // Convert DOCX to HTML
      const htmlContent = await this.convertDocxToHtml(fileBuffer);

      // Save to MongoDB
      const fileDoc = new File({
        fileName: file.originalname,
        filePath: uploadPath,
        htmlContent,
      });
      await fileDoc.save();

      // Remove the file after processing
      await fs.unlink(uploadPath);
    } catch (error) {
      console.error("Error during file upload and conversion:", error);
      throw new Error("Upload and conversion process failed.");
    }
  }

  // Retrieve all files
  static async getAllFiles() {
    try {
      return await File.find().select("fileName htmlContent uploadDate"); // Fetch only required fields
    } catch (error) {
      console.error("Error retrieving files:", error);
      throw new Error("Failed to retrieve files.");
    }
  }

  // Update file content
  static async updateFileContent(
    fileId: string,
    htmlContent: string
  ): Promise<boolean> {
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
  }

  // Retrieve a single file by ID
  static async getFileById(fileId: string) {
    try {
      return await File.findById(fileId);
    } catch (error) {
      console.error("Error retrieving file:", error);
      throw new Error("Failed to retrieve file.");
    }
  }

  // Delete a file by ID
  static async deleteFile(fileId: string) {
    try {
      const file = await File.findById(fileId);
      if (!file) return null;
      await File.findByIdAndDelete(fileId); // Ensure deletion from MongoDB
      await fs.unlink(file.filePath); // Ensure to delete the file from the filesystem
      return file;
    } catch (error) {
      console.error("Error deleting file:", error);
      throw new Error("Failed to delete file.");
    }
  }
}
