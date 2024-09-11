import { Request, Response } from "express";
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
} from "./blogs.services";

// Create a new blog
const createBlogController = async (req: Request, res: Response) => {
  const { fileId, title, imageOne, imageTwo } = req.body;

  try {
    const blog = await createBlog(fileId, title, imageOne, imageTwo);
    res.status(201).json({ message: "Blog created successfully", data: blog });
  } catch (error) {
    res.status(500).json({ message: "Failed to create blog", error });
  }
};

// Get all blogs
const getAllBlogsController = async (req: Request, res: Response) => {
  try {
    const blogs = await getAllBlogs();
    res
      .status(200)
      .json({ message: "Blogs retrieved successfully", data: blogs });
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve blogs", error });
  }
};

// Get blog by ID
const getBlogByIdController = async (req: Request, res: Response) => {
  const blogId = req.params.id;

  try {
    const blog = await getBlogById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res
      .status(200)
      .json({ message: "Blog retrieved successfully", data: blog });
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve blog", error });
  }
};

// Update blog
const updateBlogController = async (req: Request, res: Response) => {
  const blogId = req.params.id;
  const updateData = req.body;

  try {
    const updatedBlog = await updateBlog(blogId, updateData);
    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res
      .status(200)
      .json({ message: "Blog updated successfully", data: updatedBlog });
  } catch (error) {
    res.status(500).json({ message: "Failed to update blog", error });
  }
};

// Delete blog
const deleteBlogController = async (req: Request, res: Response) => {
  const blogId = req.params.id;

  try {
    const deleted = await deleteBlog(blogId);
    if (!deleted) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete blog", error });
  }
};

export {
  createBlogController,
  getAllBlogsController,
  getBlogByIdController,
  updateBlogController,
  deleteBlogController,
};
