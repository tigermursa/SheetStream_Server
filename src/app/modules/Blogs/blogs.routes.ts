import express from "express";
import {
  createBlogController,
  getAllBlogsController,
  getBlogByIdController,
  updateBlogController,
  deleteBlogController,
} from "./blogs.controller";

const router = express.Router();

router.post("/blogs", createBlogController);
router.get("/blogs", getAllBlogsController);
router.get("/blogs/:id", getBlogByIdController);
router.put("/blogs/:id", updateBlogController);
router.delete("/blogs/:id", deleteBlogController);

export const BlogRoutes = router;
