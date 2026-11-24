
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

const isValidDate = (value) => {
    if (
        typeof value !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(value)
    ) {
        return false;
    }

    const date = new Date(`${value}T00:00:00Z`);

    return (
        !Number.isNaN(date.getTime()) &&
        date.toISOString().slice(0, 10) === value
    );
};

// Validate shipment creation
export const createShipmentValidator = (body = {}) => {
    const errors = [];

    const allowedFields = [
        "shipment_code",
        "brand_id",
        "product_id",
        "shipment_date",
        "status",
        "tracking_reference"
    ];

    const unknownFields = Object.keys(body).filter(
        (key) => !allowedFields.includes(key)
    );

    if (unknownFields.length > 0) {
        errors.push(
            `Unsupported fields: ${unknownFields.join(", ")}`
        );
    }

    if (
        typeof body.shipment_code !== "string" ||
        !body.shipment_code.trim()
    ) {
        errors.push("Shipment code is required");
    } else if (body.shipment_code.trim().length > 50) {
        errors.push("Shipment code cannot exceed 50 characters");
    }

    if (!isPositiveId(body.brand_id)) {
        errors.push("A valid brand ID is required");
    }

    if (!isPositiveId(body.product_id)) {
        errors.push("A valid product ID is required");
    }

    if (!isValidDate(body.shipment_date)) {
        errors.push(
            "Shipment date must be a valid date in YYYY-MM-DD format"
        );
    }

    if (
        body.status !== undefined &&
        !SHIPMENT_STATUS_VALUES.includes(body.status)
    ) {
        errors.push("Invalid shipment status");
    }

    if (
        body.status === "RECEIVED"
    ) {
        errors.push(
            "New shipments must have SHIPPED status"
        );
    }

    if (
        body.tracking_reference !== undefined &&
        body.tracking_reference !== null &&
        typeof body.tracking_reference !== "string"
    ) {
        errors.push("Tracking reference must be a string");
    } else if (
        typeof body.tracking_reference === "string" &&
        body.tracking_reference.length > 255
    ) {
        errors.push("Tracking reference cannot exceed 255 characters");
    }

    return errors;
};

// Validate shipment status updates
export const updateShipmentStatusValidator = (body = {}) => {
    const errors = [];

    const allowedFields = [
        "status",
        "tracking_reference"
    ];

    const unknownFields = Object.keys(body).filter(
        (key) => !allowedFields.includes(key)
    );

    if (unknownFields.length > 0) {
        errors.push(
            `Unsupported fields: ${unknownFields.join(", ")}`
        );
    }

    if (!SHIPMENT_STATUS_VALUES.includes(body.status)) {
        errors.push("Status must be SHIPPED or RECEIVED");
    }

    if (
        body.tracking_reference !== undefined &&
        body.tracking_reference !== null &&
        typeof body.tracking_reference !== "string"
    ) {
        errors.push("Tracking reference must be a string");
    } else if (
        typeof body.tracking_reference === "string" &&
        body.tracking_reference.length > 255
    ) {
        errors.push("Tracking reference cannot exceed 255 characters");
    }

    return errors;
};
