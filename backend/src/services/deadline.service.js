
import * as deadlineModel from "../models/contentDeadline.model.js";
import * as shipmentModel from "../models/shipment.model.js";
import { apiError } from "../utils/apiError.js";

const ALLOWED_PLATFORMS = [
    "Instagram",
    "YouTube",
    "Pinterest",
    "Blog",
    "Other"
];

const parseId = (value, fieldName = "ID") => {
    const id = String(value ?? "");

    if (!/^[1-9]\d*$/.test(id)) {
        throw new apiError(400, `Invalid ${fieldName}`);
    }

    return id;
};

// Convert a database date into YYYY-MM-DD
const formatDate = (value) => {
    if (value instanceof Date) {
        const year = value.getFullYear();
        const month = String(value.getMonth() + 1).padStart(2, "0");
        const day = String(value.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    return String(value ?? "").slice(0, 10);
};

// Get today's date in YYYY-MM-DD format
const getTodayDate = () => {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

// Get a deadline only if it belongs to the logged-in user
const getOwnedDeadline = async (deadlineId, userId) => {
    const id = parseId(deadlineId, "deadline ID");

    const deadline =
        await deadlineModel.getContentDeadlineByIdAndUserId(id, userId);

    if (!deadline) {
        throw new apiError(404, "Content deadline not found");
    }

    return deadline;
};

// Verify that the shipment belongs to the logged-in user
const verifyOwnedShipment = async (shipmentId, userId) => {
    const id = parseId(shipmentId, "shipment ID");

    const shipment = await shipmentModel.getShipmentById(id, userId);

    if (!shipment) {
        throw new apiError(404, "Shipment not found");
    }

    return shipment;
};

// Validate deadline data
const validateDeadlineData = (data, isUpdate = false) => {
    const errors = [];

    if (!data || typeof data !== "object" || Array.isArray(data)) {
        throw new apiError(400, "Invalid content deadline data");
    }

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

    if (typeof data.notes === "string" && data.notes.length > 500) {
        errors.push("Notes must not exceed 500 characters");
    }

    if (errors.length > 0) {
        throw new apiError(400, "Invalid content deadline data", errors);
    }
};

// Calculate deadline status automatically
const deriveStatus = (deadline) => {
    if (deadline.completed_at || deadline.status === "COMPLETED") {
        return "COMPLETED";
    }

    const dueDate = formatDate(deadline.due_date);
    const today = getTodayDate();

    return dueDate < today ? "OVERDUE" : "UPCOMING";
};

// Create a deadline
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
        data.notes?.trim() || null
    );

    const deadline =
        await deadlineModel.getContentDeadlineByIdAndUserId(
            result.insertId,
            userId
        );

    if (!deadline) {
        throw new apiError(500, "Unable to retrieve created deadline");
    }

    return {
        ...deadline,
        status: deriveStatus(deadline)
    };
};

// Get all deadlines for the logged-in user
export const getDeadlines = async (userId) => {
    const deadlines =
        await deadlineModel.getContentDeadlinesByUserId(userId);

    return deadlines.map((deadline) => ({
        ...deadline,
        status: deriveStatus(deadline)
    }));
};

// Get one deadline
export const getDeadlineById = async (userId, deadlineId) => {
    const deadline = await getOwnedDeadline(deadlineId, userId);

    return {
        ...deadline,
        status: deriveStatus(deadline)
    };
};

// Update a deadline
export const updateDeadline = async (userId, deadlineId, data) => {
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
            ? formatDate(existing.due_date)
            : data.due_date;

    const notes =
        data.notes === undefined
            ? existing.notes
            : data.notes?.trim() || null;

    const currentStatus = deriveStatus(existing);

    const status =
        currentStatus === "COMPLETED"
            ? "COMPLETED"
            : deriveStatus({
                due_date: dueDate,
                completed_at: null,
                status: "UPCOMING"
            });

    await deadlineModel.updateContentDeadline(
        existing.deadline_id,
        userId,
        contentTitle,
        platform,
        dueDate,
        status,
        notes
    );

    const updated =
        await deadlineModel.getContentDeadlineByIdAndUserId(
            existing.deadline_id,
            userId
        );

    if (!updated) {
        throw new apiError(404, "Content deadline not found");
    }

    return {
        ...updated,
        status: deriveStatus(updated)
    };
};

// Mark a deadline as completed
export const completeDeadline = async (userId, deadlineId) => {
    const existing = await getOwnedDeadline(deadlineId, userId);

    if (existing.completed_at || existing.status === "COMPLETED") {
        return {
            ...existing,
            status: "COMPLETED"
        };
    }

    await deadlineModel.updateContentDeadline(
        existing.deadline_id,
        userId,
        existing.content_title,
        existing.platform,
        formatDate(existing.due_date),
        "COMPLETED",
        existing.notes ?? null
    );

    const updated =
        await deadlineModel.getContentDeadlineByIdAndUserId(
            existing.deadline_id,
            userId
        );

    if (!updated) {
        throw new apiError(404, "Content deadline not found");
    }

    return {
        ...updated,
        status: deriveStatus(updated)
    };
};

// Delete a deadline
export const deleteDeadline = async (userId, deadlineId) => {
    const deadline = await getOwnedDeadline(deadlineId, userId);

    const result = await deadlineModel.deleteContentDeadline(
        deadline.deadline_id,
        userId
    );

    if (!result.affectedRows) {
        throw new apiError(404, "Content deadline not found");
    }

    return {
        deadline_id: deadline.deadline_id
    };
};
