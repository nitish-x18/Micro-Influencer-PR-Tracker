import { db } from "../config/databaseConfig.js";

// Get all shipments
export async function getAllShipments() {
    const db = getDB();

    const [shipments] = await db.query(
        "SELECT * FROM shipments"
    );

    return shipments;
}

// Get shipments by user ID
export async function getShipmentsByUserId(userId) {
    const db = getDB();

    const [shipments] = await db.query(
        "SELECT * FROM shipments WHERE user_id = ?",
        [userId]
    );

    return shipments;
}

// Get shipment by ID
export async function getShipmentById(shipmentId) {
    const db = getDB();

    const [shipments] = await db.query(
        "SELECT * FROM shipments WHERE shipment_id = ?",
        [shipmentId]
    );

    return shipments[0] ?? null;
}

// Get shipments by brand ID
export async function getShipmentsByBrandId(brandId) {
    const db = getDB();

    const [shipments] = await db.query(
        "SELECT * FROM shipments WHERE brand_id = ?",
        [brandId]
    );

    return shipments;
}

// Get shipments by product ID
export async function getShipmentsByProductId(productId) {
    const db = getDB();

    const [shipments] = await db.query(
        "SELECT * FROM shipments WHERE product_id = ?",
        [productId]
    );

    return shipments;
}

// Create a new shipment
export async function createShipment(
    userId,
    shipmentCode,
    brandId,
    productId,
    shipmentDate,
    status = "SHIPPED",
    trackingReference = null
) {
    const db = getDB();

    const [result] = await db.query(
        `INSERT INTO shipments (
            user_id,
            shipment_code,
            brand_id,
            product_id,
            shipment_date,
            status,
            tracking_reference
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
            userId,
            shipmentCode,
            brandId,
            productId,
            shipmentDate,
            status,
            trackingReference
        ]
    );

    return result;
}

// Update shipment status and record the change in audit_logs
export async function updateShipmentStatus(
    shipmentId,
    status,
    trackingReference = null,
    receivedAt = null
) {
    const db = getDB();
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        // Get current shipment information
        const [shipments] = await connection.query(
            `SELECT user_id, status
             FROM shipments
             WHERE shipment_id = ?
             FOR UPDATE`,
            [shipmentId]
        );

        if (shipments.length === 0) {
            throw new Error("Shipment not found");
        }

        const shipment = shipments[0];
        const oldStatus = shipment.status;

        // Update shipment
        await connection.query(
            `UPDATE shipments
             SET status = ?,
                 tracking_reference = ?,
                 received_at = ?
             WHERE shipment_id = ?`,
            [status, trackingReference, receivedAt, shipmentId]
        );

        // Record the status change
        if (oldStatus !== status) {
            await connection.query(
                `INSERT INTO audit_logs (
                    user_id,
                    shipment_id,
                    old_status,
                    new_status
                )
                VALUES (?, ?, ?, ?)`,
                [shipment.user_id, shipmentId, oldStatus, status]
            );
        }

        await connection.commit();

        return {
            affectedRows: 1,
            oldStatus,
            newStatus: status
        };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

// Delete a shipment
export async function deleteShipment(shipmentId) {
    const db = getDB();

    const [result] = await db.query(
        "DELETE FROM shipments WHERE shipment_id = ?",
        [shipmentId]
    );

    return result;
}