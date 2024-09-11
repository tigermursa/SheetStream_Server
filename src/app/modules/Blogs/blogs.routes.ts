import express from "express";
import {
  createBlogController,
  getAllBlogsController,
  getBlogByIdController,
  updateBlogController,
  deleteBlogController,
} from "./blogs.controller";

const router = express.Router();

router.post("/create", createBlogController);
router.get("/get", getAllBlogsController);
router.get("/blogs/:id", getBlogByIdController);
router.put("/update/:id", updateBlogController);
router.delete("/blogs/:id", deleteBlogController);

export const BlogRoutes = router;
