import "dotenv/config";

import { app } from "./app.js";
import { connectDB } from "./config/databaseConfig.js";

const PORT = Number(process.env.PORT) || 8000;

const startServer = async () => {
    try {
        await connectDB();

        const server = app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });

        server.on("error", (error) => {
            console.error("HTTP server failed:", error.message);
            process.exitCode = 1;
        });
    } catch (error) {
        console.error("Server failed to start:", error.message);
        process.exitCode = 1;
    }
};

startServer();