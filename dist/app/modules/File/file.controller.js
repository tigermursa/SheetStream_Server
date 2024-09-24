"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchFilesController = exports.toggleFileStatusController = exports.deleteFileController = exports.getFileController = exports.updateFileController = exports.getAllFilesController = exports.uploadFile = void 0;
const file_services_1 = require("./file.services");
const mongoose_1 = require("mongoose");
const file_model_1 = require("./file.model");
const uploadFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        if (!file.mimetype.includes("officedocument.wordprocessingml")) {
            return res.status(400).json({ message: "Only DOCX files are allowed" });
        }
        yield (0, file_services_1.uploadAndConvertFile)(file); // Perform upload and conversion
        return res
            .status(201)
            .json({ message: "File uploaded and converted successfully!" });
    }
    catch (error) {
        console.error("Error in uploadFile:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return res.status(500).json({
            message: "Error uploading and converting file",
            error: errorMessage,
        });
    }
});
exports.uploadFile = uploadFile;
const getAllFilesController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const files = yield (0, file_services_1.getAllFiles)();
        return res
            .status(200)
            .json({ message: "Files retrieved successfully", data: files });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return res
            .status(500)
            .json({ message: "Error retrieving files", error: errorMessage });
    }
});
exports.getAllFilesController = getAllFilesController;
const updateFileController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fileId = req.params.id;
        const { htmlContent, imageOne, imageTwo, title, description } = req.body;
        if (!htmlContent) {
            return res.status(400).json({ message: "HTML content is required" });
        }
        const updated = yield (0, file_services_1.updateFileContent)(fileId, htmlContent, imageOne, imageTwo, title, description);
        if (!updated) {
            return res
                .status(404)
                .json({ message: `No file found with ID: ${fileId}` });
        }
        return res
            .status(200)
            .json({ message: "File content updated successfully" });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return res
            .status(500)
            .json({ message: "Error updating file content", error: errorMessage });
    }
});
exports.updateFileController = updateFileController;
const getFileController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fileId = req.params.id;
        const file = yield (0, file_services_1.getFileById)(fileId);
        if (!file) {
            return res
                .status(404)
                .json({ message: `No file found with ID: ${fileId}` });
        }
        return res
            .status(200)
            .json({ message: "File retrieved successfully", data: file });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return res
            .status(500)
            .json({ message: "Error retrieving file", error: errorMessage });
    }
});
exports.getFileController = getFileController;
const deleteFileController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fileId = req.params.id;
        const result = yield (0, file_services_1.deleteFile)(fileId);
        if (!result.success) {
            return res.status(400).json({ message: result.message });
        }
        return res.status(200).json({ message: result.message });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return res
            .status(500)
            .json({ message: "Error deleting file", error: errorMessage });
    }
});
exports.deleteFileController = deleteFileController;
const toggleFileStatusController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fileId = req.params.id;
        // Validate if file ID is valid
        if (!(0, mongoose_1.isValidObjectId)(fileId)) {
            return res.status(400).json({ message: "Invalid file ID" });
        }
        // Find the file and toggle its `isOnline` status
        const file = yield file_model_1.File.findById(fileId);
        if (!file) {
            return res
                .status(404)
                .json({ message: `No file found with ID: ${fileId}` });
        }
        // Toggle the `isOnline` field
        file.isOnline = !file.isOnline;
        yield file.save();
        return res.status(200).json({
            message: "File status updated successfully",
            data: { isOnline: file.isOnline },
        });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return res
            .status(500)
            .json({ message: "Error updating file status", error: errorMessage });
    }
});
exports.toggleFileStatusController = toggleFileStatusController;
const searchFilesController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const searchQuery = req.query.q || ""; // Get search query from URL query parameters
        const files = yield (0, file_services_1.searchFilesByTitle)(searchQuery);
        return res.status(200).json({ message: "Files found", data: files });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return res
            .status(500)
            .json({ message: "Error searching files", error: errorMessage });
    }
});
exports.searchFilesController = searchFilesController;
