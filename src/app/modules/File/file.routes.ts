import express from "express";
import multer from "multer";
import { FileController } from "./file.controller";

// Configure Multer to store files in the 'uploads/' directory
const upload = multer({ dest: "uploads/" });
//router
const router = express.Router();

// Use Multer's single file upload middleware
router.post("/upload", upload.single("file"), FileController.uploadFile);
router.get("/files", FileController.getAllFiles);

export const FileRoutes = router;
