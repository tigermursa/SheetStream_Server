import * as mammoth from "mammoth";
import fs from "fs";
import path from "path";
import { File } from "./file.model";

export class FileService {
  //!1 UPLOAD TO DB
  static async uploadAndConvertFile(file: Express.Multer.File): Promise<void> {
    // Define the storage path
    const uploadPath = path.join(__dirname, "../../uploads", file.filename);

    // The file will already be uploaded by Multer, no need to move it.
    // Read the uploaded .docx file
    const fileBuffer = fs.readFileSync(uploadPath);

    // Convert .docx to HTML using Mammoth
    const result = await mammoth.convertToHtml({ buffer: fileBuffer });
    const htmlContent = result.value;

    // Store the file metadata and HTML in MongoDB
    const fileDoc = new File({
      fileName: file.originalname,
      filePath: uploadPath,
      htmlContent: htmlContent,
    });

    await fileDoc.save();
  }
  //!2 GET FILES
  static async getAllFiles() {
    return File.find({});
  }
}
