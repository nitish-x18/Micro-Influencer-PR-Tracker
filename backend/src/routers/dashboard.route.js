import { Router } from "express";
import {
    getDashboard,
    getDashboardDeadlines
} from "../controllers/dashboard.controller.js";

import { authenticateUser } from "../middlewares/authenticateUser.js";

const router = Router();

router.use(authenticateUser);

router.get("/", getDashboard);
router.get("/deadlines", getDashboardDeadlines);

export default router;
