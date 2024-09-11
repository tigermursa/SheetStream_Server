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
  ): Promise<void> {
    try {
      const file = await File.findByIdAndUpdate(
        fileId,
        { htmlContent },
        { new: true }
      );
      if (!file) throw new Error("File not found");
    } catch (error) {
      console.error("Error updating file content:", error);
      throw new Error("Failed to update file content.");
    }
  }
}
