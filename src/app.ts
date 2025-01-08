import express from "express";
import cors from "cors";
import dotenv from "dotenv"; // Load environment variables
import cookieParser from "cookie-parser";
import morgan from "morgan"; // Import Morgan
import fs from "fs";
import path from "path";

import { FileRoutes } from "./app/modules/File/file.routes";
import { AuthRoutes } from "./app/modules/Auth/auth.routes";
import { UserRoutes } from "./app/modules/User/user.routes";
import config from "./app/config";

// Load .env file
dotenv.config();

const app = express();

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: config.dev_frontend,
    credentials: true,
  })
);

// Morgan Middleware (for console logging)
app.use(morgan("dev"));

// Optionally log requests to a file
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);
app.use(morgan("combined", { stream: accessLogStream }));

// Routes
app.use("/api/v1/files", FileRoutes);
app.use("/api/v2/auth", AuthRoutes);
app.use("/api/v3/user", UserRoutes);

// Simple health check route
app.get("/", (req, res) => {
  res.send("The Server is Running");
});

export default app;
