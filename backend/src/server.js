import "dotenv/config";
import express from "express";
import cors from "cors";
import db from "./db/databaseConfig.js";
const app = express();

const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
    res.send("Micro Influencer PR Tracker API is running");
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});