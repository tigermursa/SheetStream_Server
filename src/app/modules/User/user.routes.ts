import express from "express";
import { getUserByToken } from "./user.controller";

const router = express.Router();

// router.get("/:id", getUserById);
router.get("/me", getUserByToken);

export const UserRoutes = router;
