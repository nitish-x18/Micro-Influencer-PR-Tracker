import * as deadlineService from "../services/deadline.service.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createDeadline = asyncHandler(async (req, res) => {
    const deadline = await deadlineService.createDeadline(
        req.user.user_id,
        req.body
    );

    return res.status(201).json(
        new apiResponse(201, deadline, "Content deadline created successfully")
    );
});

export const getDeadlines = asyncHandler(async (req, res) => {
    const result = await deadlineService.getDeadlines(
        req.user.user_id,
        req.query
    );

    return res.status(200).json(
        new apiResponse(200, result, "Content deadlines retrieved successfully")
    );
});

export const getDeadlineById = asyncHandler(async (req, res) => {
    const deadline = await deadlineService.getDeadlineById(
        req.user.user_id,
        req.params.deadlineId
    );

    return res.status(200).json(
        new apiResponse(200, deadline, "Content deadline retrieved successfully")
    );
});

export const updateDeadline = asyncHandler(async (req, res) => {
    const deadline = await deadlineService.updateDeadline(
        req.user.user_id,
        req.params.deadlineId,
        req.body
    );

    return res.status(200).json(
        new apiResponse(200, deadline, "Content deadline updated successfully")
    );
});

export const completeDeadline = asyncHandler(async (req, res) => {
    const deadline = await deadlineService.completeDeadline(
        req.user.user_id,
        req.params.deadlineId
    );

    return res.status(200).json(
        new apiResponse(200, deadline, "Content deadline marked as completed")
    );
});

export const deleteDeadline = asyncHandler(async (req, res) => {
    await deadlineService.deleteDeadline(
        req.user.user_id,
        req.params.deadlineId
    );

    return res.status(200).json(
        new apiResponse(200, null, "Content deadline deleted successfully")
    );
});
