import * as dashboardService from "../services/dashboard.service.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getDashboard = asyncHandler(async (req, res) => {
    const dashboard = await dashboardService.getDashboard(
        req.user.user_id
    );

    return res.status(200).json(
        new apiResponse(
            200,
            dashboard,
            "Dashboard retrieved successfully"
        )
    );
});

export const getDashboardDeadlines = asyncHandler(async (req, res) => {
    const deadlines = await dashboardService.getDashboardDeadlines(
        req.user.user_id,
        req.query
    );

    return res.status(200).json(
        new apiResponse(
            200,
            deadlines,
            "Dashboard deadlines retrieved successfully"
        )
    );
});
