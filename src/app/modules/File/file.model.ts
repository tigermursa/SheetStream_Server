import { Schema, model } from "mongoose";
import { IFile } from "./file.Interface";

const fileSchema = new Schema<IFile>({
  fileName: { type: String, required: true },
  filePath: { type: String, required: true },
  htmlContent: { type: String },
  uploadDate: { type: Date, default: Date.now },
});

export const File = model<IFile>("File", fileSchema);
