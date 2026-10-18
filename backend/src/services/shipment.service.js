import * as shipmentModel from "../models/shipment.model.js";
import { apiError } from "../utils/apiError.js";

const ALLOWED_STATUSES = ["SHIPPED", "RECEIVED"];

const parseId = (value, fieldName = "ID") => {
    const id = String(value ?? "");

    if (!/^[1-9]\d*$/.test(id)) {
        throw new apiError(400, `Invalid ${fieldName}`);
    }

    return id;
};

const getOwnedShipment = async (shipmentId, userId) => {
    const id = parseId(shipmentId, "shipment ID");
    const shipment = await shipmentModel.getShipmentById(id);

    if (!shipment || String(shipment.user_id) !== String(userId)) {
        throw new apiError(404, "Shipment not found");
    }

    return shipment;
};

// Create shipment
export const createShipment = async (userId, data) => {
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

    if (!shipment_code?.trim()) {
        throw new apiError(400, "Shipment code is required");
    }

    if (!shipment_date) {
        throw new apiError(400, "Shipment date is required");
    }

    if (!ALLOWED_STATUSES.includes(status)) {
        throw new apiError(400, "Invalid shipment status");
    }

    if (status === "RECEIVED") {
        throw new apiError(
            400,
            "Create the shipment as SHIPPED, then mark it as RECEIVED"
        );
    }

    // The model must be called with its actual parameter order.
    const result = await shipmentModel.createShipment(
        userId,
        shipment_code.trim(),
        brand_id,
        product_id,
        shipment_date,
        status,
        tracking_reference
    );

    return {
        shipment_id: result.insertId,
        shipment_code: shipment_code.trim(),
        brand_id,
        product_id,
        shipment_date,
        status,
        tracking_reference
    };
};

// Get all shipments belonging to the current user
export const getShipments = async (userId) => {
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

    const { status, tracking_reference } = data;

    if (!ALLOWED_STATUSES.includes(status)) {
        throw new apiError(400, "Invalid shipment status");
    }

    // Do not allow changing a received shipment back to shipped.
    if (shipment.status === "RECEIVED" && status === "SHIPPED") {
        throw new apiError(
            400,
            "A received shipment cannot be changed back to SHIPPED"
        );
    }

    const receivedAt = status === "RECEIVED"
        ? (shipment.received_at || new Date())
        : null;

    await shipmentModel.updateShipmentStatus(
        shipment.shipment_id,
        status,
        tracking_reference ?? shipment.tracking_reference ?? null,
        receivedAt
    );

    return shipmentModel.getShipmentById(shipment.shipment_id);
};

// Delete shipment
export const deleteShipment = async (shipmentId, userId) => {
    const shipment = await getOwnedShipment(shipmentId, userId);

    const result = await shipmentModel.deleteShipment(
        shipment.shipment_id
    );

    if (!result.affectedRows) {
        throw new apiError(404, "Shipment not found");
    }

    return { shipment_id: shipment.shipment_id };
};
