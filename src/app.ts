import express from "express";
import cors from "cors";
import morgan from "morgan"; // Logging
import { FileRoutes } from "./app/modules/File/file.routes";
import { BlogRoutes } from "./app/modules/Blogs/blogs.routes";

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev")); // Log HTTP requests

// Routes
app.use("/api/v1/files", FileRoutes);
app.use("/api/v2/blogs", BlogRoutes);

app.get("/", (req, res) => {
  res.send("The Server is Running");
});

export default app;
