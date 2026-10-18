import * as deadlineModel from "../models/contentDeadline.model.js";
import * as shipmentModel from "../models/shipment.model.js";
import { apiError } from "../utils/apiError.js";

const ALLOWED_PLATFORMS = [
    "INSTAGRAM",
    "YOUTUBE",
    "PINTEREST",
    "BLOG",
    "OTHER"
];

const ALLOWED_STATUSES = [
    "UPCOMING",
    "OVERDUE",
    "COMPLETED"
];

const parseId = (value, fieldName = "ID") => {
    const id = String(value ?? "");

    if (!/^[1-9]\d*$/.test(id)) {
        throw new apiError(400, `Invalid ${fieldName}`);
    }

    return id;
};

const getOwnedDeadline = async (deadlineId, userId) => {
    const id = parseId(deadlineId, "deadline ID");
    const deadline = await deadlineModel.getContentDeadlineById(id);

    if (!deadline || String(deadline.user_id) !== String(userId)) {
        throw new apiError(404, "Content deadline not found");
    }

    return deadline;
};

const verifyOwnedShipment = async (shipmentId, userId) => {
    const id = parseId(shipmentId, "shipment ID");
    const shipment = await shipmentModel.getShipmentById(id);

    if (!shipment || String(shipment.user_id) !== String(userId)) {
        throw new apiError(404, "Shipment not found");
    }

    return shipment;
};

const validateDeadlineData = (data, isUpdate = false) => {
    const errors = [];

    if (!isUpdate || data.content_title !== undefined) {
        if (
            typeof data.content_title !== "string" ||
            !data.content_title.trim()
        ) {
            errors.push("Content title is required");
        } else if (data.content_title.trim().length > 255) {
            errors.push("Content title must not exceed 255 characters");
        }
    }

    if (!isUpdate || data.platform !== undefined) {
        if (!ALLOWED_PLATFORMS.includes(data.platform)) {
            errors.push("Invalid content platform");
        }
    }

    if (!isUpdate || data.due_date !== undefined) {
        if (
            typeof data.due_date !== "string" ||
            !/^\d{4}-\d{2}-\d{2}$/.test(data.due_date)
        ) {
            errors.push("Due date must use YYYY-MM-DD format");
        } else {
            const date = new Date(`${data.due_date}T00:00:00Z`);

            if (
                Number.isNaN(date.getTime()) ||
                date.toISOString().slice(0, 10) !== data.due_date
            ) {
                errors.push("Due date is not a valid calendar date");
            }
        }
    }

    if (
        data.notes !== undefined &&
        data.notes !== null &&
        typeof data.notes !== "string"
    ) {
        errors.push("Notes must be a string");
    }

    if (typeof data.notes === "string" && data.notes.length > 5000) {
        errors.push("Notes must not exceed 5000 characters");
    }

    if (errors.length > 0) {
        throw new apiError(400, "Invalid content deadline data", errors);
    }
};

const deriveStatus = (deadline) => {
    if (deadline.completed_at || deadline.status === "COMPLETED") {
        return "COMPLETED";
    }

    // Compare calendar dates, not UTC timestamps.
    const today = new Date().toLocaleDateString("en-CA");

    return deadline.due_date < today ? "OVERDUE" : "UPCOMING";
};

// Create deadline
export const createDeadline = async (userId, data) => {
    validateDeadlineData(data);

    const shipmentId = parseId(data.shipment_id, "shipment ID");

    await verifyOwnedShipment(shipmentId, userId);

    const result = await deadlineModel.createContentDeadline(
        userId,
        shipmentId,
        data.content_title.trim(),
        data.platform,
        data.due_date,
        "UPCOMING",
        data.notes ?? null
    );

    const deadline = await deadlineModel.getContentDeadlineById(
        result.insertId
    );

    return {
        ...deadline,
        status: deriveStatus(deadline)
    };
};

// Get all deadlines belonging to current user
export const getDeadlines = async (userId) => {
    const deadlines =
        await deadlineModel.getContentDeadlinesByUserId(userId);

    return deadlines.map((deadline) => ({
        ...deadline,
        status: deriveStatus(deadline)
    }));
};

// Get a single deadline belonging to current user
export const getDeadlineById = async (deadlineId, userId) => {
    const deadline = await getOwnedDeadline(deadlineId, userId);

    return {
        ...deadline,
        status: deriveStatus(deadline)
    };
};

// Update deadline
export const updateDeadline = async (deadlineId, userId, data) => {
    const existing = await getOwnedDeadline(deadlineId, userId);

    validateDeadlineData(data, true);

    const contentTitle =
        data.content_title === undefined
            ? existing.content_title
            : data.content_title.trim();

    const platform =
        data.platform === undefined
            ? existing.platform
            : data.platform;

    const dueDate =
        data.due_date === undefined
            ? existing.due_date
            : data.due_date;

    const notes =
        data.notes === undefined
            ? existing.notes
            : data.notes;

    const currentStatus = deriveStatus(existing);
    const status = currentStatus === "COMPLETED"
        ? "COMPLETED"
        : deriveStatus({ due_date: dueDate, completed_at: null });

    await deadlineModel.updateContentDeadline(
        existing.deadline_id,
        contentTitle,
        platform,
        dueDate,
        status,
        notes
    );

    const updated = await deadlineModel.getContentDeadlineById(
        existing.deadline_id
    );

    return {
        ...updated,
        status: deriveStatus(updated)
    };
};

// Mark deadline as completed
export const completeDeadline = async (deadlineId, userId) => {
    const existing = await getOwnedDeadline(deadlineId, userId);

    if (existing.completed_at || existing.status === "COMPLETED") {
        return {
            ...existing,
            status: "COMPLETED"
        };
    }

    await deadlineModel.updateContentDeadline(
        existing.deadline_id,
        existing.content_title,
        existing.platform,
        existing.due_date,
        "COMPLETED",
        existing.notes ?? null
    );

    const updated = await deadlineModel.getContentDeadlineById(
        existing.deadline_id
    );

    return {
        ...updated,
        status: deriveStatus(updated)
    };
};

// Delete deadline
export const deleteDeadline = async (deadlineId, userId) => {
    const deadline = await getOwnedDeadline(deadlineId, userId);

    const result = await deadlineModel.deleteContentDeadline(
        deadline.deadline_id
    );

    if (!result.affectedRows) {
        throw new apiError(404, "Content deadline not found");
    }

    return { deadline_id: deadline.deadline_id };
};
