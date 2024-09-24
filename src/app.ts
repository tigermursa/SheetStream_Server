// src/app.ts
import express from "express";
import cors from "cors";
import morgan from "morgan"; // Logging
import dotenv from "dotenv"; // Load environment variables

import { FileRoutes } from "./app/modules/File/file.routes";
import { AuthRoutes } from "./app/modules/Auth/auth.routes";

// Load .env file
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev")); // Log HTTP requests

// Routes
app.use("/api/v1/files", FileRoutes);
app.use("/api/v2/auth", AuthRoutes);

// Simple health check route
app.get("/", (req, res) => {
  res.send("The Server is Running");
});

export default app; // Ensure the app is exported
