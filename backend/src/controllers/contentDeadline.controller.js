import {
    getAllContentDeadlines,
    getContentDeadlineById,
    getContentDeadlinesByShipmentId,
    createContentDeadline,
    updateContentDeadline,
    deleteContentDeadline
} from "../models/contentDeadline.model.js";

import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


// GET ALL CONTENT DEADLINES
export const getAllContentDeadlinesController = asyncHandler(
    async (req, res) => {

        const deadlines = await getAllContentDeadlines();

        return res.status(200).json(
            new apiResponse(
                200,
                deadlines,
                "Content deadlines fetched successfully"
            )
        );
    }
);


// GET CONTENT DEADLINE BY ID
export const getContentDeadlineByIdController = asyncHandler(
    async (req, res) => {

        const { deadlineId } = req.params;

        if (!deadlineId) {
            throw new apiError(400, "Deadline ID is required");
        }

        const deadline = await getContentDeadlineById(deadlineId);

        if (!deadline) {
            throw new apiError(404, "Content deadline not found");
        }

        return res.status(200).json(
            new apiResponse(
                200,
                deadline,
                "Content deadline fetched successfully"
            )
        );
    }
);


// GET DEADLINES BY SHIPMENT ID
export const getContentDeadlinesByShipmentIdController = asyncHandler(
    async (req, res) => {

        const { shipmentId } = req.params;

        if (!shipmentId) {
            throw new apiError(400, "Shipment ID is required");
        }

        const deadlines =
            await getContentDeadlinesByShipmentId(shipmentId);

        return res.status(200).json(
            new apiResponse(
                200,
                deadlines,
                "Shipment content deadlines fetched successfully"
            )
        );
    }
);


// CREATE CONTENT DEADLINE
export const createContentDeadlineController = asyncHandler(
    async (req, res) => {

        const {
            shipmentId,
            platform,
            dueDate,
            status,
            notes
        } = req.body;

        if (!shipmentId || !platform || !dueDate) {
            throw new apiError(
                400,
                "Shipment ID, platform and due date are required"
            );
        }

        const result = await createContentDeadline(
            shipmentId,
            platform,
            dueDate,
            status || "pending",
            notes || null
        );

        const newDeadline =
            await getContentDeadlineById(result.insertId);

        return res.status(201).json(
            new apiResponse(
                201,
                newDeadline,
                "Content deadline created successfully"
            )
        );
    }
);


// UPDATE CONTENT DEADLINE
export const updateContentDeadlineController = asyncHandler(
    async (req, res) => {

        const { deadlineId } = req.params;

        const {
            platform,
            dueDate,
            status,
            notes
        } = req.body;

        if (!deadlineId) {
            throw new apiError(400, "Deadline ID is required");
        }

        const existingDeadline =
            await getContentDeadlineById(deadlineId);

        if (!existingDeadline) {
            throw new apiError(404, "Content deadline not found");
        }

        if (!platform || !dueDate || !status) {
            throw new apiError(
                400,
                "Platform, due date and status are required"
            );
        }

        await updateContentDeadline(
            deadlineId,
            platform,
            dueDate,
            status,
            notes || null
        );

        const updatedDeadline =
            await getContentDeadlineById(deadlineId);

        return res.status(200).json(
            new apiResponse(
                200,
                updatedDeadline,
                "Content deadline updated successfully"
            )
        );
    }
);


// DELETE CONTENT DEADLINE
export const deleteContentDeadlineController = asyncHandler(
    async (req, res) => {

        const { deadlineId } = req.params;

        if (!deadlineId) {
            throw new apiError(400, "Deadline ID is required");
        }

        const existingDeadline =
            await getContentDeadlineById(deadlineId);

        if (!existingDeadline) {
            throw new apiError(404, "Content deadline not found");
        }

        await deleteContentDeadline(deadlineId);

        return res.status(200).json(
            new apiResponse(
                200,
                null,
                "Content deadline deleted successfully"
            )
        );
    }
);