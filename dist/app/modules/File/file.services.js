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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchFilesByTitle = exports.deleteFile = exports.getFileById = exports.updateFileContent = exports.getAllFiles = exports.uploadAndConvertFile = exports.convertDocxToHtml = void 0;
const file_model_1 = require("./file.model");
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const mammoth_1 = __importDefault(require("mammoth"));
const mongoose_1 = require("mongoose");
const cloudinaryConfig_1 = require("../../config/cloudinaryConfig");
// Function to convert DOCX to HTML
const convertDocxToHtml = (buffer) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { value: htmlContent } = yield mammoth_1.default.convertToHtml({ buffer });
        return htmlContent || "<p>No content found in the document.</p>";
    }
    catch (error) {
        console.error("Error converting DOCX to HTML:", error);
        throw new Error("Failed to convert DOCX to HTML.");
    }
});
exports.convertDocxToHtml = convertDocxToHtml;
// Function to upload and convert DOCX to HTML
const uploadAndConvertFile = (file) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Create a temporary path for the uploaded file in /tmp
        const tempFilePath = path_1.default.join("/tmp", file.originalname);
        // Move the file to the /tmp directory (assuming file.path points to a location accessible)
        yield promises_1.default.copyFile(file.path, tempFilePath); // Copy the file to /tmp
        // Read the uploaded file
        const fileBuffer = yield promises_1.default.readFile(tempFilePath);
        // Convert DOCX to HTML
        const htmlContent = yield convertDocxToHtml(fileBuffer);
        // Upload the file to Cloudinary
        const cloudinaryResult = yield new Promise((resolve, reject) => {
            const stream = cloudinaryConfig_1.cloudinaryInstance.uploader.upload_stream({ resource_type: "raw" }, (error, result) => {
                if (error)
                    reject(error);
                resolve(result);
            });
            stream.end(fileBuffer);
        });
        // Create a new file document
        const fileDoc = new file_model_1.File({
            fileName: file.originalname,
            filePath: cloudinaryResult.secure_url,
            htmlContent,
        });
        yield fileDoc.save(); // Save the document in the DB
        // Remove the local file after upload
        yield promises_1.default.unlink(tempFilePath); // Clean up the temporary file
    }
    catch (error) {
        console.error("Error during file upload and conversion:", error);
        throw new Error("Upload and conversion process failed.");
    }
});
exports.uploadAndConvertFile = uploadAndConvertFile;
const getAllFiles = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield file_model_1.File.find().select("imageOne  title fileName shortDescription  uploadDate isOnline");
    }
    catch (error) {
        console.error("Error retrieving files:", error);
        throw new Error("Failed to retrieve files.");
    }
});
exports.getAllFiles = getAllFiles;
const updateFileContent = (fileId, htmlContent, imageOne, imageTwo, title, isOnline, shortDescription) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updateFields = { htmlContent };
        if (imageOne)
            updateFields.imageOne = imageOne;
        if (imageTwo)
            updateFields.imageTwo = imageTwo;
        if (title)
            updateFields.title = title;
        if (shortDescription)
            updateFields.shortDescription = shortDescription;
        if (typeof isOnline === "boolean") {
            updateFields.isOnline = isOnline;
        }
        const file = yield file_model_1.File.findByIdAndUpdate(fileId, updateFields, {
            new: true,
        });
        return file !== null;
    }
    catch (error) {
        console.error("Error updating file content:", error);
        throw new Error("Failed to update file content.");
    }
});
exports.updateFileContent = updateFileContent;
const getFileById = (fileId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const file = yield file_model_1.File.findById(fileId);
        return file;
    }
    catch (error) {
        console.error("Error retrieving file:", error);
        throw new Error("Failed to retrieve file.");
    }
});
exports.getFileById = getFileById;
const deleteFile = (fileId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!(0, mongoose_1.isValidObjectId)(fileId)) {
            throw new Error(`Invalid ID: ${fileId}`);
        }
        const file = yield file_model_1.File.findById(fileId);
        if (!file) {
            return { message: `No file found with ID: ${fileId}`, success: false };
        }
        // Attempt to delete the file from the database
        yield file_model_1.File.findByIdAndDelete(fileId);
        // Check if the file exists before attempting to delete it
        try {
            yield promises_1.default.access(file.filePath); // Check if the file exists
            yield promises_1.default.unlink(file.filePath); // Delete the file
        }
        catch (err) {
            console.warn(`File not found on the filesystem: ${file.filePath}`);
        }
        return { message: "File deleted successfully", success: true };
    }
    catch (error) {
        console.error("Error retrieving file:", error);
        throw new Error("Failed to retrieve file.");
    }
});
exports.deleteFile = deleteFile;
const searchFilesByTitle = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (searchQuery = "") {
    try {
        const regex = new RegExp(`^${searchQuery}`, "i"); // Case-insensitive, starts with
        return yield file_model_1.File.find({ title: { $regex: regex } }).select("_id title");
    }
    catch (error) {
        console.error("Error searching files:", error);
        throw new Error("Failed to search files.");
    }
});
exports.searchFilesByTitle = searchFilesByTitle;
