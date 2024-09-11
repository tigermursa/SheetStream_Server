import { Request, Response } from "express";
import { FileService } from "./file.services";

export class FileController {
  // File upload
  static async uploadFile(req: Request, res: Response): Promise<Response> {
    try {
      const file = req.file as Express.Multer.File;

      if (!file) return res.status(400).json({ message: "No file uploaded" });
      if (!file.mimetype.includes("officedocument.wordprocessingml")) {
        return res.status(400).json({ message: "Only DOCX files are allowed" });
      }

      await FileService.uploadAndConvertFile(file);
      return res
        .status(201)
        .json({ message: "File uploaded and converted successfully!" });
    } catch (error) {
      return res.status(500).json({
        message: "Error updating file content",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // Get all files
  static async getAllFiles(req: Request, res: Response): Promise<Response> {
    try {
      const files = await FileService.getAllFiles();
      return res.status(200).json({ files });
    } catch (error) {
      return res.status(500).json({
        message: "Error updating file content",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // Update file
  static async updateFile(req: Request, res: Response): Promise<Response> {
    try {
      const fileId = req.params.id;
      const { htmlContent } = req.body;

      if (!htmlContent)
        return res.status(400).json({ message: "HTML content is required" });

      await FileService.updateFileContent(fileId, htmlContent);
      return res
        .status(200)
        .json({ message: "File content updated successfully" });
    } catch (error) {
      return res.status(500).json({
        message: "Error updating file content",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
