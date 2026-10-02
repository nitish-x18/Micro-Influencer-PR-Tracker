import { getDB } from "../db/databaseConfig.js";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const healthCheck = asyncHandler(async (req, res) => {
    const db = getDB();

    try {
        await db.query("SELECT 1");

        return res.status(200).json(
            new apiResponse(
                200,
                {
                    server: "UP",
                    database: "UP"
                },
                "Backend is healthy"
            )
        );

    } catch (error) {
        throw new apiError(503, "Database is unavailable");
    }
});