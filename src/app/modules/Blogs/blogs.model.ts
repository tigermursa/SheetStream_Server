import { Schema, model } from "mongoose";
import { IFile } from "../File/file.Interface";

export interface IBlog {
  imageOne?: string;
  imageTwo?: string;
  file?: IFile;
  createdAt: Date;
}

// Define the Blog schema
const blogSchema = new Schema<IBlog>({
  imageOne: { type: String },
  imageTwo: { type: String },
  file: { type: Schema.Types.ObjectId, ref: "File", required: true },
  createdAt: { type: Date, default: Date.now, immutable: true },
});

// Create and export the Blog model
export const Blog = model<IBlog>("Blog", blogSchema);
