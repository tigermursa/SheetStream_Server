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
        const { userID, writer } = req.body;
        if (!file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        if (!file.mimetype.includes("officedocument.wordprocessingml")) {
            return res.status(400).json({ message: "Only DOCX files are allowed" });
        }
        if (!userID) {
            return res.status(400).json({ message: "userID is required" });
        }
        if (!writer) {
            return res.status(400).json({ message: "userID is required" });
        }
        yield (0, file_services_1.uploadAndConvertFile)(file, userID, writer); // Pass userID here
        return res
            .status(201)
            .json({ message: "File uploaded and converted successfully!" });
    }
    catch (error) {
        console.error("Error in uploadFile:", error);
        return res.status(500).json({
            message: "Error uploading and converting file",
            error: error instanceof Error ? error.message : "Unknown error",
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
        console.error("Error in getAllFilesController:", error);
        return res.status(500).json({
            message: "Error retrieving files",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.getAllFilesController = getAllFilesController;
const updateFileController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fileId = req.params.id;
        const { htmlContent, imageOne, imageTwo, title, description, isOnline } = req.body;
        if (!htmlContent) {
            return res.status(400).json({ message: "HTML content is required" });
        }
        const updated = yield (0, file_services_1.updateFileContent)(fileId, htmlContent, imageOne, imageTwo, title, description, isOnline);
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
        console.error("Error in updateFileController:", error);
        return res.status(500).json({
            message: "Error updating file content",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.updateFileController = updateFileController;
const getFileController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fileId = req.params.id;
        if (!(0, mongoose_1.isValidObjectId)(fileId)) {
            return res.status(400).json({ message: "Invalid file ID" });
        }
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
        console.error("Error in getFileController:", error);
        return res.status(500).json({
            message: "Error retrieving file",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.getFileController = getFileController;
const deleteFileController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fileId = req.params.id;
        if (!(0, mongoose_1.isValidObjectId)(fileId)) {
            return res.status(400).json({ message: "Invalid file ID" });
        }
        const result = yield (0, file_services_1.deleteFile)(fileId);
        if (!result.success) {
            return res.status(400).json({ message: result.message });
        }
        return res.status(200).json({ message: result.message });
    }
    catch (error) {
        console.error("Error in deleteFileController:", error);
        return res.status(500).json({
            message: "Error deleting file",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.deleteFileController = deleteFileController;
const toggleFileStatusController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fileId = req.params.id;
        if (!(0, mongoose_1.isValidObjectId)(fileId)) {
            return res.status(400).json({ message: "Invalid file ID" });
        }
        const file = yield file_model_1.File.findById(fileId);
        if (!file) {
            return res
                .status(404)
                .json({ message: `No file found with ID: ${fileId}` });
        }
        file.isOnline = !file.isOnline;
        yield file.save();
        return res.status(200).json({
            message: "File status updated successfully",
            data: { isOnline: file.isOnline },
        });
    }
    catch (error) {
        console.error("Error in toggleFileStatusController:", error);
        return res.status(500).json({
            message: "Error updating file status",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.toggleFileStatusController = toggleFileStatusController;
const searchFilesController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const searchQuery = req.query.q || "";
        const files = yield (0, file_services_1.searchFilesByTitle)(searchQuery);
        return res.status(200).json({ message: "Files found", data: files });
    }
    catch (error) {
        console.error("Error in searchFilesController:", error);
        return res.status(500).json({
            message: "Error searching files",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.searchFilesController = searchFilesController;
