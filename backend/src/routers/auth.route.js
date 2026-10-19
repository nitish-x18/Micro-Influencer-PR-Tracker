import { Router } from "express";
import {
    register,
    login,
    logout,
    getCurrentUser
} from "../controllers/auth.controller.js";

import { authenticateUser } from "../middlewares/authenticateUser.js";
import { validateRequest } from "../middlewares/validateRequest.js";

import {
    registerValidator,
    loginValidator
} from "../validators/auth.validator.js";

const router = Router();

// Public routes
router.post("/register", validateRequest(registerValidator), register);
router.post("/login", validateRequest(loginValidator), login);

// Protected routes
router.post("/logout", authenticateUser, logout);
router.get("/me", authenticateUser, getCurrentUser);

export default router;
