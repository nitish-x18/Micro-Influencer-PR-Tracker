import { apiResponse } from "../utils/apiResponse.js";

export const healthCheck = (req, res) => {
    return res.status(200).json(
        new apiResponse(200, {
            status: "OK",
            service: "InfluenceFlow PR Tracker API",
            timestamp: new Date().toISOString(),
            uptime: process.uptime()
        }, "Server is healthy")
    );
};
