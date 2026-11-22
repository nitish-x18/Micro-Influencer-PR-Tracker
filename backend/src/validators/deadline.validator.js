import { CONTENT_PLATFORM_VALUES } from "../constants/deadline.constants.js";

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

    const parsed = new Date(`${value}T00:00:00Z`);

    return (
        !Number.isNaN(parsed.getTime()) &&
        parsed.toISOString().slice(0, 10) === value
    );
};

const validateDeadlineFields = (body, errors, partial = false) => {
    const allowedFields = [
        "shipment_id",
        "content_title",
        "platform",
        "due_date"
    ];

    const unknownFields = Object.keys(body).filter(
        (key) => !allowedFields.includes(key)
    );

    if (unknownFields.length > 0) {
        errors.push(`Unsupported fields: ${unknownFields.join(", ")}`);
    }

    if (!partial || "shipment_id" in body) {
        if (!isPositiveId(body.shipment_id)) {
            errors.push("A valid shipment ID is required");
        }
    }

    if (!partial || "content_title" in body) {
        if (
            typeof body.content_title !== "string" ||
            !body.content_title.trim()
        ) {
            errors.push("Content title is required");
        } else if (body.content_title.trim().length > 255) {
            errors.push("Content title must not exceed 255 characters");
        }
    }

    if (!partial || "platform" in body) {
        if (!CONTENT_PLATFORM_VALUES.includes(body.platform)) {
            errors.push("Invalid content platform");
        }
    }

    if (!partial || "due_date" in body) {
        if (!isValidDate(body.due_date)) {
            errors.push("Due date must be a valid date in YYYY-MM-DD format");
        }
    }
};

export const createDeadlineValidator = (body = {}) => {
    const errors = [];
    validateDeadlineFields(body, errors);
    return errors;
};

export const updateDeadlineValidator = (body = {}) => {
    const errors = [];

    if (Object.keys(body).length === 0) {
        errors.push("Provide at least one field to update");
        return errors;
    }

    validateDeadlineFields(body, errors, true);
    return errors;
};

export const completeDeadlineValidator = (body = {}) => {
    const errors = [];
    const allowedFields = [];

    const unknownFields = Object.keys(body).filter(
        (key) => !allowedFields.includes(key)
    );

    if (unknownFields.length > 0) {
        errors.push("This endpoint does not accept request body fields");
    }

    return errors;
};
