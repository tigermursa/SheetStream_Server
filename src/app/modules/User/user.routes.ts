import express from "express";
import { getUserById } from "./user.controller";

const router = express.Router();

router.get("/:id", getUserById);

export const UserRoutes = router;
