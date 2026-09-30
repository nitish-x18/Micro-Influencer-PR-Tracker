import { app } from "./app.js"
import dotenv from "dotenv"
import connectDB from "./db/index.js"

// CONFIGURATION OF ENV
dotenv.config();

// DATABASE CONNECTION
connectDB()
    .then(() => {
        app.on("error", (error) => {
            console.log("ERROR: APP ERROR!!!", error);
        })
        // Test route
        app.get("/", (req, res) => {
            res.send("Micro Influencer PR Tracker API is running");
        })
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server running on port http://localhost:${PORT}`);
        })
    })
    .catch((error) => {
        console.log('ERROR: FAILED to connect tot he dataBase', error);
    })