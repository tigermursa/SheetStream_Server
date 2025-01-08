"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.File = void 0;
const mongoose_1 = require("mongoose");
const fileSchema = new mongoose_1.Schema({
    userID: { type: String },
    writer: { type: String },
    imageOne: { type: String },
    imageTwo: { type: String },
    title: { type: String, default: "New file" },
    description: {
        type: String,
        default: "please provide description  from edit option",
    },
    fileName: { type: String, required: true },
    filePath: { type: String, required: true },
    htmlContent: { type: String, required: true },
    isOnline: { type: Boolean, required: true, default: false },
    uploadDate: { type: Date, default: Date.now, immutable: true },
});
// Export the model
exports.File = (0, mongoose_1.model)("File", fileSchema);
