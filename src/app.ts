import express from "express";
import cors from "cors";
import morgan from "morgan"; // Logging
import { FileRoutes } from "./app/modules/File/file.routes";
import { AuthRoutes } from "./app/modules/Auth/auth.routes";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev")); // Log HTTP requests

// Routes
app.use("/api/v1/files", FileRoutes);
app.use("/api/v2/auth", AuthRoutes);

app.get("/", (req, res) => {
  res.send("The Server is Running");
});
app.use(globalErrorHandler);
export default app;