
import { Router } from "express";

import authRoutes from "./auth.route.js";
import brandRoutes from "./brand.route.js";
import productRoutes from "./product.route.js";
import shipmentRoutes from "./shipment.route.js";
import deadlineRoutes from "./deadline.route.js";
import dashboardRoutes from "./dashboard.route.js";
import healthRoutes from "./healthcheck.route.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/brands", brandRoutes);
router.use("/products", productRoutes);
router.use("/shipments", shipmentRoutes);
router.use("/content-deadlines", deadlineRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/health", healthRoutes);

export default router;