import { getDB } from "../config/databaseConfig.js";

// Get all content deadlines
export async function getAllContentDeadlines() {
    const db = getDB();

    const [deadlines] = await db.query(
        "SELECT * FROM content_deadlines"
    );

    return deadlines;
}

// Get deadlines by user ID
export async function getContentDeadlinesByUserId(userId) {
    const db = getDB();

    const [deadlines] = await db.query(
        `SELECT *
         FROM content_deadlines
         WHERE user_id = ?
         ORDER BY due_date ASC`,
        [userId]
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

    return deadlines[0] ?? null;
}

// Get deadlines by shipment ID
export async function getContentDeadlinesByShipmentId(shipmentId) {
    const db = getDB();

    const [deadlines] = await db.query(
        `SELECT *
         FROM content_deadlines
         WHERE shipment_id = ?
         ORDER BY due_date ASC`,
        [shipmentId]
    );

    return deadlines;
}

// Create a new content deadline
export async function createContentDeadline(
    userId,
    shipmentId,
    contentTitle,
    platform,
    dueDate,
    status = "UPCOMING",
    notes = null
) {
    const db = getDB();

    const [result] = await db.query(
        `INSERT INTO content_deadlines
        (
            user_id,
            shipment_id,
            content_title,
            platform,
            due_date,
            status,
            notes
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
            userId,
            shipmentId,
            contentTitle,
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
    contentTitle,
    platform,
    dueDate,
    status,
    notes
) {
    const db = getDB();

    const [result] = await db.query(
        `UPDATE content_deadlines
         SET content_title = ?,
             platform = ?,
             due_date = ?,
             status = ?,
             notes = ?,
             completed_at = CASE
                 WHEN ? = 'COMPLETED'
                 THEN COALESCE(completed_at, CURRENT_TIMESTAMP)
                 ELSE NULL
             END
         WHERE deadline_id = ?`,
        [
            contentTitle,
            platform,
            dueDate,
            status,
            notes,
            status,
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