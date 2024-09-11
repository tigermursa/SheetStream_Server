import express from "express";
import multer from "multer";
import { FileController } from "./file.controller";

// Configure Multer to handle file uploads
const upload = multer({ dest: "uploads/" });

const router = express.Router();

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    await FileController.uploadFile(req, res);
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: "Error processing request", error });
  }
});

router.get("/files", async (req, res) => {
  try {
    await FileController.getAllFiles(req, res);
  } catch (error) {
    console.error("Retrieve Files Error:", error);
    res.status(500).json({ message: "Error retrieving files", error });
  }
});

router.post("/update/:id", async (req, res) => {
  try {
    await FileController.updateFile(req, res);
  } catch (error) {
    console.error("Update File Error:", error);
    res.status(500).json({ message: "Error updating file", error });
  }
});

export const FileRoutes = router;
