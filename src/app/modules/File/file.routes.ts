import express from "express";
import multer from "multer";
import {
  deleteFileController,
  getAllFilesController,
  getFileController,
  searchFilesController,
  toggleFileStatusController,
  updateFileController,
  uploadFile,
} from "./file.controller";

const upload = multer({ dest: "uploads/" });
const router = express.Router();

router.post("/upload", upload.single("file"), uploadFile);
router.get("/files", getAllFilesController);
router.get("/single/:id", getFileController);
router.delete("/delete/:id", deleteFileController);
router.post("/update/:id", updateFileController);
router.patch("/toggle/isOnline/:id", toggleFileStatusController);
router.get("/search", searchFilesController);

export const FileRoutes = router;
