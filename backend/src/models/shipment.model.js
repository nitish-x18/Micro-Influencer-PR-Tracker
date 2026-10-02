import { getDB } from "../db/databaseConfig.js";

// Get all shipments
export async function getAllShipments() {
    const db = getDB();

    const [shipments] = await db.query(
        "SELECT * FROM shipments"
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

    return shipments[0];
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
    shipmentCode,
    brandId,
    productId,
    shipmentDate,
    status,
    trackingReference
) {
    const db = getDB();

    const [result] = await db.query(
        `INSERT INTO shipments
        (
            shipment_code,
            brand_id,
            product_id,
            shipment_date,
            status,
            tracking_reference
        )
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
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

// Update shipment status
export async function updateShipmentStatus(
    shipmentId,
    status,
    trackingReference,
    receivedAt
) {
    const db = getDB();

    const [result] = await db.query(
        `UPDATE shipments
        SET status = ?,
            tracking_reference = ?,
            received_at = ?
        WHERE shipment_id = ?`,
        [status, trackingReference, receivedAt, shipmentId]
    );

    return result;
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