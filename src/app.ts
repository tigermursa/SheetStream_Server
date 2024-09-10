import express from "express";
import cors from "cors";
import { FileRoutes } from "./app/modules/File/file.routes";

const app = express();

app.use(express.json());
app.use(cors());

// Use the file routes for handling routes starting with '/api/v1/files'
app.use("/api/v1/files", FileRoutes);

app.get("/", (req, res) => {
  res.send("The Server Running");
});

export default app;
