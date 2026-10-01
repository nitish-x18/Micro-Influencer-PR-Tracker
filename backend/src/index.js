import { app } from "./app.js";
import dotenv from "dotenv";
import { connectDB } from "./db/index.js";

dotenv.config();

await connectDB()

app.on("error", (error) => {
    console.log("ERROR: APP ERROR!!!", error);
});

app.get("/", (req, res) => {
    res.send("Micro Influencer PR Tracker API is running");
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});