import { Request, Response } from "express";
import {
  deleteFile,
  getAllFiles,
  getFileById,
  searchFilesByTitle,
  updateFileContent,
  uploadAndConvertFile,
} from "./file.services";
import { isValidObjectId } from "mongoose";
import { File } from "./file.model";

const uploadFile = async (req: Request, res: Response) => {
  try {
    const file = req.file as Express.Multer.File;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    if (!file.mimetype.includes("officedocument.wordprocessingml")) {
      return res.status(400).json({ message: "Only DOCX files are allowed" });
    }

    await uploadAndConvertFile(file); // Perform upload and conversion
    return res
      .status(201)
      .json({ message: "File uploaded and converted successfully!" });
  } catch (error) {
    console.error("Error in uploadFile:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({
      message: "Error uploading and converting file",
      error: errorMessage,
    });
  }
};

const getAllFilesController = async (req: Request, res: Response) => {
  try {
    const files = await getAllFiles();
    return res
      .status(200)
      .json({ message: "Files retrieved successfully", data: files });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return res
      .status(500)
      .json({ message: "Error retrieving files", error: errorMessage });
  }
};

const updateFileController = async (req: Request, res: Response) => {
  try {
    const fileId = req.params.id;
    const { htmlContent, imageOne, imageTwo, title, description } = req.body;

    if (!htmlContent) {
      return res.status(400).json({ message: "HTML content is required" });
    }

    const updated = await updateFileContent(
      fileId,
      htmlContent,
      imageOne,
      imageTwo,
      title,
      description
    );
    if (!updated) {
      return res
        .status(404)
        .json({ message: `No file found with ID: ${fileId}` });
    }

    return res
      .status(200)
      .json({ message: "File content updated successfully" });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return res
      .status(500)
      .json({ message: "Error updating file content", error: errorMessage });
  }
};

const getFileController = async (req: Request, res: Response) => {
  try {
    const fileId = req.params.id;
    const file = await getFileById(fileId);

    if (!file) {
      return res
        .status(404)
        .json({ message: `No file found with ID: ${fileId}` });
    }

    return res
      .status(200)
      .json({ message: "File retrieved successfully", data: file });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return res
      .status(500)
      .json({ message: "Error retrieving file", error: errorMessage });
  }
};

const deleteFileController = async (req: Request, res: Response) => {
  try {
    const fileId = req.params.id;
    const result = await deleteFile(fileId);

    if (!result.success) {
      return res.status(400).json({ message: result.message });
    }

    return res.status(200).json({ message: result.message });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return res
      .status(500)
      .json({ message: "Error deleting file", error: errorMessage });
  }
};

const toggleFileStatusController = async (req: Request, res: Response) => {
  try {
    const fileId = req.params.id;

    // Validate if file ID is valid
    if (!isValidObjectId(fileId)) {
      return res.status(400).json({ message: "Invalid file ID" });
    }

    // Find the file and toggle its `isOnline` status
    const file = await File.findById(fileId);

    if (!file) {
      return res
        .status(404)
        .json({ message: `No file found with ID: ${fileId}` });
    }

    // Toggle the `isOnline` field
    file.isOnline = !file.isOnline;
    await file.save();

    return res.status(200).json({
      message: "File status updated successfully",
      data: { isOnline: file.isOnline },
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return res
      .status(500)
      .json({ message: "Error updating file status", error: errorMessage });
  }
};

const searchFilesController = async (req: Request, res: Response) => {
  try {
    const searchQuery = req.query.q || ""; // Get search query from URL query parameters
    const files = await searchFilesByTitle(searchQuery as string);
    return res.status(200).json({ message: "Files found", data: files });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return res
      .status(500)
      .json({ message: "Error searching files", error: errorMessage });
  }
};

export {
  uploadFile,
  getAllFilesController,
  updateFileController,
  getFileController,
  deleteFileController,
  toggleFileStatusController,
  searchFilesController,
};
