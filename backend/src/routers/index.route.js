import { Router } from "express";

import authRoutes from "./auth.routes.js";
import brandRoutes from "./brand.routes.js";
import productRoutes from "./product.routes.js";
import shipmentRoutes from "./shipment.routes.js";
import deadlineRoutes from "./deadline.routes.js";
import dashboardRoutes from "./dashboard.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/brands", brandRoutes);
router.use("/products", productRoutes);
router.use("/shipments", shipmentRoutes);
router.use("/deadlines", deadlineRoutes);
router.use("/dashboard", dashboardRoutes);

export default router;
