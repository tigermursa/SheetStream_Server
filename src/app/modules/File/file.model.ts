import { Schema, model } from "mongoose";
import { IFile } from "./file.Interface";

const fileSchema = new Schema<IFile>({
  imageOne: { type: String },
  imageTwo: { type: String },
  fileName: { type: String, required: true },
  filePath: { type: String, required: true },
  htmlContent: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now, immutable: true },
});

// Export the model
export const File = model<IFile>("File", fileSchema);
