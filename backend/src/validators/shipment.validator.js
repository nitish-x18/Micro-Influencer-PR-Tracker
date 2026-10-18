import { SHIPMENT_STATUS_VALUES } from "../constants/shipment.constants.js";

const isPositiveId = (value) => {
    if (
        typeof value !== "string" &&
        typeof value !== "number"
    ) {
        return false;
    }

    const id = String(value);

    return /^\d+$/.test(id) && BigInt(id) > 0n;
};

export const createShipmentValidator = (body = {}) => {
    const errors = [];
    const allowedFields = [
        "product_id",
        "shipment_code",
        "tracking_number",
        "status",
        "shipped_at"
    ];

    const unknownFields = Object.keys(body).filter(
        (key) => !allowedFields.includes(key)
    );

    if (unknownFields.length > 0) {
        errors.push(`Unsupported fields: ${unknownFields.join(", ")}`);
    }

    if (!isPositiveId(body.product_id)) {
        errors.push("A valid product ID is required");
    }

    if (
        typeof body.shipment_code !== "string" ||
        !body.shipment_code.trim()
    ) {
        errors.push("Shipment code is required");
    } else if (body.shipment_code.trim().length > 255) {
        errors.push("Shipment code is too long");
    }

    if (
        body.tracking_number !== undefined &&
        body.tracking_number !== null &&
        typeof body.tracking_number !== "string"
    ) {
        errors.push("Tracking number must be a string");
    }

    if (
        body.status !== undefined &&
        !SHIPMENT_STATUS_VALUES.includes(body.status)
    ) {
        errors.push("Invalid shipment status");
    }

    if (body.shipped_at !== undefined && body.shipped_at !== null) {
        if (
            typeof body.shipped_at !== "string" ||
            !/^\d{4}-\d{2}-\d{2}$/.test(body.shipped_at) ||
            Number.isNaN(Date.parse(`${body.shipped_at}T00:00:00Z`)) ||
            new Date(`${body.shipped_at}T00:00:00Z`).toISOString().slice(0, 10) !== body.shipped_at
        ) {
            errors.push("Shipped date must be a valid date in YYYY-MM-DD format");
        }
    }

    return errors;
};

export const updateShipmentStatusValidator = (body = {}) => {
    const errors = [];
    const allowedFields = ["status"];

    const unknownFields = Object.keys(body).filter(
        (key) => !allowedFields.includes(key)
    );

    if (unknownFields.length > 0) {
        errors.push(`Unsupported fields: ${unknownFields.join(", ")}`);
    }

    if (!SHIPMENT_STATUS_VALUES.includes(body.status)) {
        errors.push("Status must be SHIPPED or RECEIVED");
    }

    return errors;
};
