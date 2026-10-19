import * as shipmentService from "../services/shipment.service.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createShipment = asyncHandler(async (req, res) => {
    const shipment = await shipmentService.createShipment(
        req.user.user_id,
        req.body
    );

    return res.status(201).json(
        new apiResponse(201, shipment, "Shipment created successfully")
    );
});

export const getShipments = asyncHandler(async (req, res) => {
    const result = await shipmentService.getShipments(
        req.user.user_id,
        req.query
    );

    return res.status(200).json(
        new apiResponse(200, result, "Shipments retrieved successfully")
    );
});

export const getShipmentById = asyncHandler(async (req, res) => {
    const shipment = await shipmentService.getShipmentById(
        req.user.user_id,
        req.params.shipmentId
    );

    return res.status(200).json(
        new apiResponse(200, shipment, "Shipment retrieved successfully")
    );
});

export const updateShipmentStatus = asyncHandler(async (req, res) => {
    const shipment = await shipmentService.updateShipmentStatus(
        req.user.user_id,
        req.params.shipmentId,
        req.body.status
    );

    return res.status(200).json(
        new apiResponse(200, shipment, "Shipment status updated successfully")
    );
});

export const deleteShipment = asyncHandler(async (req, res) => {
    await shipmentService.deleteShipment(
        req.user.user_id,
        req.params.shipmentId
    );

    return res.status(200).json(
        new apiResponse(200, null, "Shipment deleted successfully")
    );
});
