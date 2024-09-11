import { File } from "../File/file.model";
import { Blog, IBlog } from "./blogs.model";

// Create a blog when a file is created
const createBlog = async (
  fileId: string,
  title?: string,
  imageOne?: string,
  imageTwo?: string
) => {
  try {
    const file = await File.findById(fileId);
    if (!file) throw new Error("File not found");

    const blog = new Blog({
      title,
      imageOne,
      imageTwo,
      file: file._id,
    });

    return await blog.save();
  } catch (error) {
    console.error("Error creating blog:", error);
    throw new Error("Failed to create blog");
  }
};

// Get all blogs
const getAllBlogs = async () => {
  try {
    return await Blog.find().populate(
      "file",
      "fileName htmlContent uploadDate"
    );
  } catch (error) {
    console.error("Error retrieving blogs:", error);
    throw new Error("Failed to retrieve blogs");
  }
};

// Get a single blog by ID
const getBlogById = async (blogId: string) => {
  try {
    const blog = await Blog.findById(blogId).populate(
      "file",
      "fileName htmlContent uploadDate"
    );
    return blog;
  } catch (error) {
    console.error("Error retrieving blog:", error);
    throw new Error("Failed to retrieve blog");
  }
};

// Update blog content
const updateBlog = async (blogId: string, data: Partial<IBlog>) => {
  try {
    const blog = await Blog.findByIdAndUpdate(blogId, data, { new: true });
    return blog;
  } catch (error) {
    console.error("Error updating blog:", error);
    throw new Error("Failed to update blog");
  }
};

// Delete a blog
const deleteBlog = async (blogId: string) => {
  try {
    const blog = await Blog.findByIdAndDelete(blogId);
    return blog !== null;
  } catch (error) {
    console.error("Error deleting blog:", error);
    throw new Error("Failed to delete blog");
  }
};

export { createBlog, getAllBlogs, getBlogById, updateBlog, deleteBlog };
