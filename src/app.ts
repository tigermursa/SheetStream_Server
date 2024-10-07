import express from "express";
import cors from "cors";
import morgan from "morgan"; // Logging
import dotenv from "dotenv"; // Load environment variables
import cookieParser from "cookie-parser";
import { FileRoutes } from "./app/modules/File/file.routes";
import { AuthRoutes } from "./app/modules/Auth/auth.routes";
import { UserRoutes } from "./app/modules/User/user.routes";

// Load .env file
dotenv.config();

const app = express();

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: "https://sheetstream-client.vercel.app",
    credentials: true,
  })
);
app.use(morgan("dev")); // Log HTTP requests

// Routes
app.use("/api/v1/files", FileRoutes);
app.use("/api/v2/auth", AuthRoutes);
app.use("/api/v3/user", UserRoutes);

// Simple health check route
app.get("/", (req, res) => {
  res.send("The Server is Running");
});

export default app;

//so redy to host now
