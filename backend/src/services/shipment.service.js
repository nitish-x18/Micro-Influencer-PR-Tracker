import * as shipmentModel from "../models/shipment.model.js";
import * as productModel from "../models/product.model.js";
import * as brandModel from "../models/brand.model.js";
import { apiError } from "../utils/apiError.js";

const ALLOWED_STATUSES = ["SHIPPED", "RECEIVED"];

const parseId = (value, fieldName = "ID") => {
    const id = String(value ?? "");

    if (!/^[1-9]\d*$/.test(id)) {
        throw new apiError(400, `Invalid ${fieldName}`);
    }

    return id;
};

// Validate shipment date in YYYY-MM-DD format
const validateShipmentDate = (value) => {
    if (
        typeof value !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(value)
    ) {
        throw new apiError(
            400,
            "Shipment date must use YYYY-MM-DD format"
        );
    }

    const date = new Date(`${value}T00:00:00Z`);

    if (
        Number.isNaN(date.getTime()) ||
        date.toISOString().slice(0, 10) !== value
    ) {
        throw new apiError(400, "Invalid shipment date");
    }

    return value;
};

// Get shipment only if it belongs to the logged-in user
const getOwnedShipment = async (shipmentId, userId) => {
    const id = parseId(shipmentId, "shipment ID");

    const shipment = await shipmentModel.getShipmentById(
        id,
        userId
    );

    if (!shipment) {
        throw new apiError(404, "Shipment not found");
    }

    return shipment;
};

// Create shipment
export const createShipment = async (userId, data) => {
    parseId(userId, "user ID");

    if (!data || typeof data !== "object" || Array.isArray(data)) {
        throw new apiError(400, "Invalid shipment data");
    }

    const {
        shipment_code,
        brand_id,
        product_id,
        shipment_date,
        status = "SHIPPED",
        tracking_reference = null
    } = data;

    parseId(brand_id, "brand ID");
    parseId(product_id, "product ID");

    if (
        typeof shipment_code !== "string" ||
        !shipment_code.trim()
    ) {
        throw new apiError(400, "Shipment code is required");
    }

    const shipmentCode = shipment_code.trim();

    if (shipmentCode.length > 50) {
        throw new apiError(
            400,
            "Shipment code cannot exceed 50 characters"
        );
    }

    validateShipmentDate(shipment_date);

    if (!ALLOWED_STATUSES.includes(status)) {
        throw new apiError(400, "Invalid shipment status");
    }

    if (status !== "SHIPPED") {
        throw new apiError(
            400,
            "New shipments must have SHIPPED status"
        );
    }

    if (
        tracking_reference !== null &&
        typeof tracking_reference !== "string"
    ) {
        throw new apiError(
            400,
            "Tracking reference must be a string"
        );
    }

    // Verify brand ownership
    const brand = await brandModel.getBrandByIdAndUserId(
        brand_id,
        userId
    );

    if (!brand) {
        throw new apiError(
            404,
            "Brand not found or does not belong to you"
        );
    }

    // Verify product ownership
    const product = await productModel.getProductByIdAndUserId(
        product_id,
        userId
    );

    if (!product) {
        throw new apiError(
            404,
            "Product not found or does not belong to you"
        );
    }

    // Verify that the product belongs to the selected brand
    if (String(product.brand_id) !== String(brand_id)) {
        throw new apiError(
            400,
            "The selected product does not belong to this brand"
        );
    }

    let result;

    try {
        result = await shipmentModel.createShipment(
            userId,
            shipmentCode,
            brand_id,
            product_id,
            shipment_date,
            status,
            tracking_reference
        );
    } catch (error) {
        // Handle duplicate shipment constraints
        if (error.code === "ER_DUP_ENTRY" || error.errno === 1062) {
            throw new apiError(
                409,
                "Shipment code already exists or this product already has a shipment"
            );
        }

        throw error;
    }

    return {
        shipment_id: result.insertId,
        shipment_code: shipmentCode,
        brand_id,
        product_id,
        shipment_date,
        status,
        tracking_reference,
        received_at: null
    };
};

// Get all shipments belonging to the current user
export const getShipments = async (userId) => {
    parseId(userId, "user ID");

    return shipmentModel.getShipmentsByUserId(userId);
};

// Get one shipment belonging to the current user
export const getShipmentById = async (shipmentId, userId) => {
    return getOwnedShipment(shipmentId, userId);
};

// Update shipment status
export const updateShipmentStatus = async (
    shipmentId,
    userId,
    data
) => {
    const shipment = await getOwnedShipment(shipmentId, userId);

    if (!data || typeof data !== "object" || Array.isArray(data)) {
        throw new apiError(400, "Invalid shipment update data");
    }

    const { status, tracking_reference } = data;

    if (!ALLOWED_STATUSES.includes(status)) {
        throw new apiError(400, "Invalid shipment status");
    }

    // Prevent reverting a received shipment
    if (
        shipment.status === "RECEIVED" &&
        status === "SHIPPED"
    ) {
        throw new apiError(
            400,
            "A received shipment cannot be changed back to SHIPPED"
        );
    }

    // Validate tracking reference
    if (
        tracking_reference !== undefined &&
        tracking_reference !== null &&
        typeof tracking_reference !== "string"
    ) {
        throw new apiError(
            400,
            "Tracking reference must be a string"
        );
    }

    // Prevent invalid status transitions
    if (shipment.status === status) {
        throw new apiError(
            400,
            "Shipment already has this status"
        );
    }

    // Validate stored shipment date
    const shipmentDate = validateShipmentDate(
        typeof shipment.shipment_date === "string"
            ? shipment.shipment_date.slice(0, 10)
            : new Date(shipment.shipment_date)
                .toISOString()
                .slice(0, 10)
    );

    // Set received timestamp when marking as received
    const receivedAt =
        status === "RECEIVED"
            ? (shipment.received_at || new Date())
            : null;

    // Prevent receiving shipment before its shipment date
    if (
        status === "RECEIVED" &&
        new Date(`${shipmentDate}T00:00:00Z`) > receivedAt
    ) {
        throw new apiError(
            400,
            "Shipment cannot be received before its shipment date"
        );
    }

    await shipmentModel.updateShipmentStatus(
        shipment.shipment_id,
        userId,
        status,
        tracking_reference ??
            shipment.tracking_reference ??
            null,
        receivedAt
    );

    return shipmentModel.getShipmentById(
        shipment.shipment_id,
        userId
    );
};

// Delete shipment belonging to the current user
export const deleteShipment = async (shipmentId, userId) => {
    parseId(userId, "user ID");

    const shipment = await getOwnedShipment(
        shipmentId,
        userId
    );

    const result = await shipmentModel.deleteShipment(
        shipment.shipment_id,
        userId
    );

    if (!result.affectedRows) {
        throw new apiError(404, "Shipment not found");
    }

    return {
        shipment_id: shipment.shipment_id
    };
};