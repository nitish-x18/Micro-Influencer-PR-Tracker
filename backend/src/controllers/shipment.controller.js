
import * as shipmentService from "../services/shipment.service.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Create Shipment
export const createShipment = asyncHandler(async (req, res) => {
    const shipment = await shipmentService.createShipment(
        req.user.user_id,
        req.body
    );

    return res.status(201).json(
        new apiResponse(201, shipment, "Shipment created successfully")
    );
});

// Get All Shipments
export const getShipments = asyncHandler(async (req, res) => {
    const result = await shipmentService.getShipments(
        req.user.user_id
    );

    return res.status(200).json(
        new apiResponse(200, result, "Shipments retrieved successfully")
    );
});

// Get Shipment By ID
export const getShipmentById = asyncHandler(async (req, res) => {
    const shipment = await shipmentService.getShipmentById(
        req.params.shipmentId,
        req.user.user_id
    );

    return res.status(200).json(
        new apiResponse(200, shipment, "Shipment retrieved successfully")
    );
});

// Update Shipment Status
export const updateShipmentStatus = asyncHandler(async (req, res) => {
    const shipment = await shipmentService.updateShipmentStatus(
        req.params.shipmentId,
        req.user.user_id,
        req.body
    );

    return res.status(200).json(
        new apiResponse(200, shipment, "Shipment status updated successfully")
    );
});

// Delete Shipment
export const deleteShipment = asyncHandler(async (req, res) => {
    await shipmentService.deleteShipment(
        req.params.shipmentId,
        req.user.user_id
    );

    return res.status(200).json(
        new apiResponse(200, null, "Shipment deleted successfully")
    );
});
