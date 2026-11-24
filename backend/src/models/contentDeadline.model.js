
import { getDB } from "../config/databaseConfig.js";

// Get deadlines belonging to a user
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

// Get a deadline by ID and owner
export async function getContentDeadlineByIdAndUserId(
    deadlineId,
    userId
) {
    const db = getDB();

    const [deadlines] = await db.query(
        `SELECT *
         FROM content_deadlines
         WHERE deadline_id = ?
         AND user_id = ?`,
        [deadlineId, userId]
    );

    return deadlines[0] ?? null;
}

// Get deadlines belonging to a shipment and user
export async function getContentDeadlinesByShipmentId(
    shipmentId,
    userId
) {
    const db = getDB();

    const [deadlines] = await db.query(
        `SELECT *
         FROM content_deadlines
         WHERE shipment_id = ?
         AND user_id = ?
         ORDER BY due_date ASC`,
        [shipmentId, userId]
    );

    return deadlines;
}

// Create a content deadline
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

// Update a deadline belonging to a user
export async function updateContentDeadline(
    deadlineId,
    userId,
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
         WHERE deadline_id = ?
         AND user_id = ?`,
        [
            contentTitle,
            platform,
            dueDate,
            status,
            notes,
            status,
            deadlineId,
            userId
        ]
    );

    return result;
}

// Delete a deadline belonging to a user
export async function deleteContentDeadline(
    deadlineId,
    userId
) {
    const db = getDB();

    const [result] = await db.query(
        `DELETE FROM content_deadlines
         WHERE deadline_id = ?
         AND user_id = ?`,
        [deadlineId, userId]
    );

    return result;
}
