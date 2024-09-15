import express from "express";
import { register } from "./auth.register";
import { login } from "./auth.login";
import { logout } from "./auth.logOut";

const router = express.Router();

// Signup route
router.post("/register", register);

// Login route
router.post("/login", login);

// Logout route
router.post("/logout", logout);

export const AuthRoutes = router;
