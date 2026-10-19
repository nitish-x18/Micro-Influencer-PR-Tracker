import { getDB } from "../config/databaseConfig.js";

// Get all audit logs
export async function getAllAuditLogs() {
    const db = getDB();

    const [logs] = await db.query(
        `SELECT *
         FROM audit_logs
         ORDER BY created_at DESC`
    );

    return logs;
}

// Get audit logs by ID
export async function getAuditLogById(auditLogId) {
    const db = getDB();

    const [logs] = await db.query(
        `SELECT *
         FROM audit_logs
         WHERE audit_log_id = ?`,
        [auditLogId]
    );

    return logs[0] ?? null;
}

// Get audit logs by user ID
export async function getAuditLogsByUserId(userId) {
    const db = getDB();

    const [logs] = await db.query(
        `SELECT *
         FROM audit_logs
         WHERE user_id = ?
         ORDER BY created_at DESC`,
        [userId]
    );

    return logs;
}

// Get audit logs by shipment ID
export async function getAuditLogsByShipmentId(shipmentId) {
    const db = getDB();

    const [logs] = await db.query(
        `SELECT *
         FROM audit_logs
         WHERE shipment_id = ?
         ORDER BY created_at DESC`,
        [shipmentId]
    );

    return logs;
}

// Create an audit log entry
export async function createAuditLog(
    userId,
    shipmentId,
    oldStatus,
    newStatus
) {
    const db = getDB();

    const [result] = await db.query(
        `INSERT INTO audit_logs
        (user_id, shipment_id, old_status, new_status)
        VALUES (?, ?, ?, ?)`,
        [
            userId,
            shipmentId,
            oldStatus,
            newStatus
        ]
    );

    return result;
}

// Delete an audit log entry
export async function deleteAuditLog(auditLogId) {
    const db = getDB();

    const [result] = await db.query(
        `DELETE FROM audit_logs
         WHERE audit_log_id = ?`,
        [auditLogId]
    );

    return result;
}