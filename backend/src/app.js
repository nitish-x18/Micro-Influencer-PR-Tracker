// import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// Middlewares
app.use(cors({
    origin: process.env.CORS_ORIGIN
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//ROUTER IMPORT
import userRouter from "./routers/user.route.js"
import brandRouter from "./routers/brand.route.js"

//ROUTER DECLARATION
app.use((req, res, next) => {
    console.log("REQUEST:", req.method, req.url);
    next();
});

app.use("/api/v1/users", userRouter)
app.use("/api/v1/brands", brandRouter);

console.log("ROUTER LOADED");

export { app }