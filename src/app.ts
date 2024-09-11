import express from "express";
import cors from "cors";
import morgan from "morgan"; // Logging
import { FileRoutes } from "./app/modules/File/file.routes";

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev")); // Log HTTP requests

// Routes
app.use("/api/v1/files", FileRoutes);

app.get("/", (req, res) => {
  res.send("The Server is Running");
});

export default app;
