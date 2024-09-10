import { Schema, model } from "mongoose";
import { IFile } from "./file.Interface";

// Define schema
const fileSchema = new Schema<IFile>({
  fileName: { type: String, required: true },
  filePath: { type: String, required: true },
  htmlContent: { type: String },
  uploadDate: { type: Date, default: Date.now, immutable: true }, // Immutable uploadDate
});

// Export the model
export const File = model<IFile>("File", fileSchema);
