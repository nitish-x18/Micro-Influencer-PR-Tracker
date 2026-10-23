import "dotenv/config";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import dashboardRouter from "./routers/dashboard.route.js";
import indexRouter from "./routers/index.route.js";
import authRouter from "./routers/auth.route.js";
import brandRouter from "./routers/brand.route.js";
import productRouter from "./routers/product.route.js";
import shipmentRouter from "./routers/shipment.route.js";
import contentDeadlineRouter from "./routers/deadline.route.js";
import healthRouter from "./routers/healthcheck.route.js";

import { notFoundMiddleware } from "./middlewares/notFound.middleware.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express();

// CORS
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

// Common middleware
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
app.use(express.static("public"));

// Request logger
// app.use((req, res, next) => {
//     console.log("REQUEST:", req.method, req.originalUrl);
//     next();
// });

// Health check
app.use("/api/v1/health", healthRouter);

// Authentication
app.use("/api/v1/auth", authRouter);

// Other API routes
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/brands", brandRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/shipments", shipmentRouter);
app.use("/api/v1/content-deadlines", contentDeadlineRouter);

// Keep this only if indexRouter provides additional routes
app.use("/api/v1", indexRouter);

// Error handling — always last
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export { app };
