import express from "express";
import cors from "cors";
import morgan from "morgan"; // Add morgan for logging
import { FileRoutes } from "./app/modules/File/file.routes";

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev")); // Log HTTP requests

// Use the file routes for handling routes starting with '/api/v1/files'
app.use("/api/v1/files", FileRoutes);

app.get("/", (req, res) => {
  res.send("The Server is Running");
});

export default app;
