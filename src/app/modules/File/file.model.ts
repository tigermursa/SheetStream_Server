import { Schema, model } from "mongoose";
import { IFile } from "./file.Interface";

const fileSchema = new Schema<IFile>({
  userID: { type: String, required: true },
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
export const File = model<IFile>("File", fileSchema);
