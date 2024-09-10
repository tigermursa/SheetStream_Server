import { Request, Response } from "express";
import { FileService } from "./file.services";

export class FileController {
  static async uploadFile(req: Request, res: Response): Promise<void> {
    try {
      const file = req.file as Express.Multer.File; // Cast to Express.Multer.File
      if (!file) {
        res.status(400).json({ message: "No file uploaded" });
        return;
      }

      // Call the service with the uploaded file
      await FileService.uploadAndConvertFile(file);
      res
        .status(201)
        .json({ message: "File uploaded and converted successfully!" });
    } catch (error: unknown) {
      // Handle unknown error
      if (error instanceof Error) {
        res
          .status(500)
          .json({ message: "Error uploading file", error: error.message });
      } else {
        res.status(500).json({ message: "Unknown error occurred" });
      }
    }
  }

  static async getAllFiles(req: Request, res: Response): Promise<void> {
    try {
      const files = await FileService.getAllFiles();
      res.status(200).json(files);
    } catch (error: unknown) {
      // Handle unknown error
      if (error instanceof Error) {
        res
          .status(500)
          .json({ message: "Error retrieving files", error: error.message });
      } else {
        res.status(500).json({ message: "Unknown error occurred" });
      }
    }
  }
}
