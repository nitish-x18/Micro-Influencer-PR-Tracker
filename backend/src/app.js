
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// Router imports
import userRouter from "./routers/user.route.js";
import brandRouter from "./routers/brand.route.js";
import productRouter from "./routers/product.route.js";
import shipmentRouter from "./routers/shipment.route.js";
import contentDeadlineRouter from "./routers/contentDeadline.route.js";
import healthRouter from "./routers/healthcheack.route.js";

const app = express();

// Middlewares
app.use(
    cors({
        origin: process.env.CORS_ORIGIN
    })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Request logging
app.use((req, res, next) => {
    console.log("REQUEST:", req.method, req.url);
    next();
});

// API routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/brands", brandRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/shipments", shipmentRouter);
app.use("/api/v1/content-deadlines", contentDeadlineRouter);
app.use("/api/v1/health", healthRouter);

console.log("ROUTER LOADED");

// Handle unknown routes
app.use((req, res) => {
    return res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`,
        errors: []
    });
});

// Global error-handling middleware
app.use((err, req, res, next) => {
    const statusCode =
        Number.isInteger(err.statusCode) &&
        err.statusCode >= 400 &&
        err.statusCode <= 599
            ? err.statusCode
            : 500;

    return res.status(statusCode).json({
        success: false,
        message:
            statusCode === 500 && !err.statusCode
                ? "Internal server error"
                : err.message || "Something went wrong",
        errors: err.errors || []
    });
});

export { app };
