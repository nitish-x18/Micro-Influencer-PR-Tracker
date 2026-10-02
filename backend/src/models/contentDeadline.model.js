import { getDB } from "../db/databaseConfig.js";

// Get all content deadlines
export async function getAllContentDeadlines() {
    const db = getDB();

    const [deadlines] = await db.query(
        "SELECT * FROM content_deadlines"
    );

    return deadlines;
}

// Get deadline by ID
export async function getContentDeadlineById(deadlineId) {
    const db = getDB();

    const [deadlines] = await db.query(
        "SELECT * FROM content_deadlines WHERE deadline_id = ?",
        [deadlineId]
    );

    return deadlines[0];
}

// Get deadlines by shipment ID
export async function getContentDeadlinesByShipmentId(shipmentId) {
    const db = getDB();

    const [deadlines] = await db.query(
        "SELECT * FROM content_deadlines WHERE shipment_id = ?",
        [shipmentId]
    );

    return deadlines;
}

// Create a new content deadline
export async function createContentDeadline(
    shipmentId,
    platform,
    dueDate,
    status,
    notes
) {
    const db = getDB();

    const [result] = await db.query(
        `INSERT INTO content_deadlines
        (
            shipment_id,
            platform,
            due_date,
            status,
            notes
        )
        VALUES (?, ?, ?, ?, ?)`,
        [
            shipmentId,
            platform,
            dueDate,
            status,
            notes
        ]
    );

    return result;
}

// Update a content deadline
export async function updateContentDeadline(
    deadlineId,
    platform,
    dueDate,
    status,
    notes
) {
    const db = getDB();

    const [result] = await db.query(
        `UPDATE content_deadlines
        SET platform = ?,
            due_date = ?,
            status = ?,
            notes = ?
        WHERE deadline_id = ?`,
        [
            platform,
            dueDate,
            status,
            notes,
            deadlineId
        ]
    );

    return result;
}

// Delete a content deadline
export async function deleteContentDeadline(deadlineId) {
    const db = getDB();

    const [result] = await db.query(
        "DELETE FROM content_deadlines WHERE deadline_id = ?",
        [deadlineId]
    );

    return result;
}