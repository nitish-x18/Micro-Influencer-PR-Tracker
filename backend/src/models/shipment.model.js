import { getDB } from "../config/databaseConfig.js";

const SHIPMENT_SELECT = `
    SELECT shipments.*
    FROM shipments
`;

// Get all shipments
export async function getAllShipments() {
    const db = getDB();

    const [shipments] = await db.query(
        `${SHIPMENT_SELECT}
         ORDER BY created_at DESC`
    );

    return shipments;
}

// Get shipment by ID
export async function getShipmentById(shipmentId) {
    const db = getDB();

    const [shipments] = await db.query(
        `${SHIPMENT_SELECT}
         WHERE shipment_id = ?`,
        [shipmentId]
    );

    return shipments[0] ?? null;
}

// Get shipments by brand ID
export async function getShipmentsByBrandId(brandId) {
    const db = getDB();

    const [shipments] = await db.query(
        `${SHIPMENT_SELECT}
         WHERE brand_id = ?
         ORDER BY created_at DESC`,
        [brandId]
    );

    return shipments;
}

// Get shipments by product ID
export async function getShipmentsByProductId(productId) {
    const db = getDB();

    const [shipments] = await db.query(
        `${SHIPMENT_SELECT}
         WHERE product_id = ?
         ORDER BY created_at DESC`,
        [productId]
    );

    return shipments;
}

// Create a shipment
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
        (shipment_code, brand_id, product_id, shipment_date, status, tracking_reference)
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
        [
            status,
            trackingReference,
            receivedAt,
            shipmentId
        ]
    );

    return result;
}

// Delete a shipment
export async function deleteShipment(shipmentId) {
    const db = getDB();

    const [result] = await db.query(
        `DELETE FROM shipments
         WHERE shipment_id = ?`,
        [shipmentId]
    );

    return result;
}