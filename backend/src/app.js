
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRouter from "./routers/user.route.js";
import brandRouter from "./routers/brand.route.js";
import productRouter from "./routers/product.route.js";
import shipmentRouter from "./routers/shipment.route.js";
import contentDeadlineRouter from "./routers/contentDeadline.route.js";

const app = express();

// Middlewares
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Request logger
app.use((req, res, next) => {
    console.log("REQUEST:", req.method, req.url);
    next();
});

// Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/brands", brandRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/shipments", shipmentRouter);
app.use("/api/v1/content-deadlines", contentDeadlineRouter);

console.log("ROUTER LOADED");

export { app };
