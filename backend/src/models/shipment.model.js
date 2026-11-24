
import { getDB } from "../config/databaseConfig.js";
import { apiError } from "../utils/apiError.js";

// Get shipments belonging to a specific user
export async function getShipmentsByUserId(userId) {
    const db = getDB();

    const [shipments] = await db.query(
        `SELECT *
         FROM shipments
         WHERE user_id = ?`,
        [userId]
    );

    return shipments;
}

// Get one shipment belonging to a specific user
export async function getShipmentById(shipmentId, userId) {
    const db = getDB();

    const [shipments] = await db.query(
        `SELECT *
         FROM shipments
         WHERE shipment_id = ?
         AND user_id = ?`,
        [shipmentId, userId]
    );

    return shipments[0] ?? null;
}

// Get shipments by brand and user
export async function getShipmentsByBrandId(brandId, userId) {
    const db = getDB();

    const [shipments] = await db.query(
        `SELECT *
         FROM shipments
         WHERE brand_id = ?
         AND user_id = ?`,
        [brandId, userId]
    );

    return shipments;
}

// Get shipments by product and user
export async function getShipmentsByProductId(productId, userId) {
    const db = getDB();

    const [shipments] = await db.query(
        `SELECT *
         FROM shipments
         WHERE product_id = ?
         AND user_id = ?`,
        [productId, userId]
    );

    return shipments;
}

// Create shipment
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
        `INSERT INTO shipments
            (
                user_id,
                shipment_code,
                brand_id,
                product_id,
                shipment_date,
                status,
                tracking_reference,
                received_at
            )
         VALUES (?, ?, ?, ?, ?, ?, ?, NULL)`,
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

// Update shipment status with audit logging
export async function updateShipmentStatus(
    shipmentId,
    userId,
    status,
    trackingReference = null,
    receivedAt = null
) {
    const db = getDB();
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const [shipments] = await connection.query(
            `SELECT user_id, status
             FROM shipments
             WHERE shipment_id = ?
             AND user_id = ?
             FOR UPDATE`,
            [shipmentId, userId]
        );

        if (!shipments.length) {
            throw new apiError(404, "Shipment not found");
        }

        const oldStatus = shipments[0].status;

        const [result] = await connection.query(
            `UPDATE shipments
             SET status = ?,
                 tracking_reference = ?,
                 received_at = ?
             WHERE shipment_id = ?
             AND user_id = ?`,
            [
                status,
                trackingReference,
                receivedAt,
                shipmentId,
                userId
            ]
        );

        if (!result.affectedRows) {
            throw new apiError(404, "Shipment not found");
        }

        if (oldStatus !== status) {
            await connection.query(
                `INSERT INTO audit_logs
                    (user_id, shipment_id, old_status, new_status)
                 VALUES (?, ?, ?, ?)`,
                [
                    userId,
                    shipmentId,
                    oldStatus,
                    status
                ]
            );
        }

        await connection.commit();

        return result;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

// Delete shipment belonging to a specific user
export async function deleteShipment(shipmentId, userId) {
    const db = getDB();

    const [result] = await db.query(
        `DELETE FROM shipments
         WHERE shipment_id = ?
         AND user_id = ?`,
        [shipmentId, userId]
    );

    return result;
}

// Get recent shipments with product and brand details for dashboard
export async function getRecentShipmentsByUserId(userId, limit = 5) {
    const db = getDB();

    const [shipments] = await db.query(
        `SELECT
            s.shipment_id,
            s.shipment_code,
            s.product_id,
            s.brand_id,
            s.shipment_date,
            s.status,
            s.tracking_reference,
            s.received_at,
            s.created_at,
            p.product_name,
            b.brand_name
         FROM shipments s
         INNER JOIN products p
            ON s.product_id = p.product_id
            AND p.user_id = s.user_id
         INNER JOIN brands b
            ON s.brand_id = b.brand_id
            AND b.user_id = s.user_id
         WHERE s.user_id = ?
         ORDER BY s.shipment_date DESC, s.shipment_id DESC
         LIMIT ?`,
        [userId, limit]
    );

    return shipments;
}
