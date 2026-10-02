import {
    getAllShipments,
    getShipmentById,
    getShipmentsByBrandId,
    getShipmentsByProductId,
    createShipment,
    updateShipmentStatus,
    deleteShipment
} from "../models/shipment.model.js";

import { getBrandById } from "../models/brand.model.js";

import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";


// GET ALL SHIPMENTS

export const getAllShipmentsController = asyncHandler(async (req, res) => {

    const shipments = await getAllShipments();

    return res.status(200).json({
        success: true,
        message: "Shipments fetched successfully",
        data: shipments
    });
});


// GET SHIPMENT BY ID

export const getShipmentByIdController = asyncHandler(async (req, res) => {

    const { shipmentId } = req.params;

    const shipment = await getShipmentById(shipmentId);

    if (!shipment) {
        throw new apiError(404, "Shipment not found");
    }

    return res.status(200).json({
        success: true,
        message: "Shipment fetched successfully",
        data: shipment
    });
});


// GET SHIPMENTS BY BRAND ID

export const getShipmentsByBrandIdController = asyncHandler(async (req, res) => {

    const { brandId } = req.params;

    const shipments = await getShipmentsByBrandId(brandId);

    return res.status(200).json({
        success: true,
        message: "Brand shipments fetched successfully",
        data: shipments
    });
});


// GET SHIPMENTS BY PRODUCT ID

export const getShipmentsByProductIdController = asyncHandler(async (req, res) => {

    const { productId } = req.params;

    const shipments = await getShipmentsByProductId(productId);

    return res.status(200).json({
        success: true,
        message: "Product shipments fetched successfully",
        data: shipments
    });
});


// CREATE SHIPMENT

export const createShipmentController = asyncHandler(async (req, res) => {

    // brandId comes from URL
    const { brandId } = req.params;

    const {
        shipmentCode,
        productId,
        shipmentDate,
        status,
        trackingReference
    } = req.body;


    // Validate required fields
    if (!shipmentCode) {
        throw new apiError(400, "Shipment code is required");
    }

    if (!productId) {
        throw new apiError(400, "Product ID is required");
    }

    if (!shipmentDate) {
        throw new apiError(400, "Shipment date is required");
    }

    if (!status) {
        throw new apiError(400, "Shipment status is required");
    }


    const result = await createShipment(
        shipmentCode,
        brandId,
        productId,
        shipmentDate,
        status,
        trackingReference || null
    );


    return res.status(201).json({
        success: true,
        message: "Shipment created successfully",
        data: {
            shipmentId: result.insertId,
            shipmentCode,
            brandId,
            productId,
            shipmentDate,
            status,
            trackingReference: trackingReference || null
        }
    });
});


// UPDATE SHIPMENT STATUS

export const updateShipmentStatusController = asyncHandler(async (req, res) => {

    const { shipmentId } = req.params;

    const {
        status,
        trackingReference,
        receivedAt
    } = req.body;


    if (!status) {
        throw new apiError(400, "Shipment status is required");
    }


    // Find shipment
    const shipment = await getShipmentById(shipmentId);

    if (!shipment) {
        throw new apiError(404, "Shipment not found");
    }


    // Find shipment's brand
    const brand = await getBrandById(shipment.brand_id);

    if (!brand) {
        throw new apiError(404, "Associated brand not found");
    }


    // Check ownership
    if (brand.user_id !== req.user.user_id) {
        throw new apiError(
            403,
            "You are not authorized to update this shipment"
        );
    }


    await updateShipmentStatus(
        shipmentId,
        status,
        trackingReference || null,
        receivedAt || null
    );


    return res.status(200).json({
        success: true,
        message: "Shipment updated successfully",
        data: {
            shipmentId,
            status,
            trackingReference: trackingReference || null,
            receivedAt: receivedAt || null
        }
    });
});


// DELETE SHIPMENT

export const deleteShipmentController = asyncHandler(async (req, res) => {

    const { shipmentId } = req.params;


    // Find shipment
    const shipment = await getShipmentById(shipmentId);

    if (!shipment) {
        throw new apiError(404, "Shipment not found");
    }


    // Find shipment's brand
    const brand = await getBrandById(shipment.brand_id);

    if (!brand) {
        throw new apiError(404, "Associated brand not found");
    }


    // Check ownership
    if (brand.user_id !== req.user.user_id) {
        throw new apiError(
            403,
            "You are not authorized to delete this shipment"
        );
    }


    await deleteShipment(shipmentId);


    return res.status(200).json({
        success: true,
        message: "Shipment deleted successfully"
    });
});