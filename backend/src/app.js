
import "dotenv/config";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// Import routers
import authRouter from "./routers/auth.route.js";
import brandRouter from "./routers/brand.route.js";
import productRouter from "./routers/product.route.js";
import shipmentRouter from "./routers/shipment.route.js";
import contentDeadlineRouter from "./routers/deadline.route.js";
import dashboardRouter from "./routers/dashboard.route.js";
import healthRouter from "./routers/healthcheck.route.js";

// Import middlewares
import { notFoundMiddleware } from "./middlewares/notFound.middleware.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express();

// ========================================
// 1. CORS CONFIGURATION
// ========================================

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true
    })
);

// ========================================
// 2. COMMON MIDDLEWARE
// ========================================

app.use(express.json({ limit: "16kb" }));

app.use(
    express.urlencoded({
        extended: true,
        limit: "16kb"
    })
);

app.use(cookieParser());

app.use(express.static("public"));

// ========================================
// 3. HEALTH CHECK ROUTE
// ========================================

app.use("/api/v1/health", healthRouter);

// ========================================
// 4. AUTHENTICATION ROUTES
// ========================================

app.use("/api/v1/auth", authRouter);

// ========================================
// 5. DASHBOARD ROUTES
// ========================================

app.use("/api/v1/dashboard", dashboardRouter);

// ========================================
// 6. BRAND ROUTES
// ========================================

app.use("/api/v1/brands", brandRouter);

// ========================================
// 7. PRODUCT ROUTES
// ========================================

app.use("/api/v1/products", productRouter);

// ========================================
// 8. SHIPMENT ROUTES
// ========================================

app.use("/api/v1/shipments", shipmentRouter);

// ========================================
// 9. CONTENT DEADLINE ROUTES
// ========================================

app.use("/api/v1/content-deadlines", contentDeadlineRouter);

// ========================================
// 10. 404 NOT FOUND MIDDLEWARE
// ========================================

app.use(notFoundMiddleware);

// ========================================
// 11. GLOBAL ERROR HANDLER
// ========================================

app.use(errorMiddleware);

export { app };
