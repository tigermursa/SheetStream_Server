import { File } from "./file.model";
import fs from "fs/promises";
import path from "path";
import mammoth from "mammoth";

// Function to convert DOCX to HTML using mammoth
async function convertDocxToHtml(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.convertToHtml({ buffer });
    return result.value; // Return the HTML content
  } catch (error) {
    console.error("Error converting DOCX to HTML:", error);
    throw new Error("Conversion failed.");
  }
}

export class FileService {
  static async uploadAndConvertFile(file: Express.Multer.File): Promise<void> {
    try {
      const uploadPath = path.resolve(
        __dirname,
        "../../../../uploads",
        file.filename
      );
      const fileBuffer = await fs.readFile(uploadPath);

      // Convert DOCX to HTML
      const htmlContent = await convertDocxToHtml(fileBuffer);

      const fileDoc = new File({
        fileName: file.originalname,
        filePath: uploadPath,
        htmlContent,
        uploadDate: new Date(),
      });

      await fileDoc.save();
      await fs.unlink(uploadPath);
    } catch (error) {
      console.error("Error uploading or converting file:", error);
      throw new Error("Failed to upload and convert file.");
    }
  }

  static async getAllFiles() {
    try {
      return await File.find({});
    } catch (error) {
      console.error("Error retrieving files:", error);
      throw new Error("Failed to retrieve files.");
    }
  }

  static async updateFileContent(fileId: string, htmlContent: string): Promise<void> {
    try {
      await File.findByIdAndUpdate(fileId, { htmlContent });
    } catch (error) {
      console.error("Error updating file content:", error);
      throw new Error("Failed to update file content.");
    }
  }
}
