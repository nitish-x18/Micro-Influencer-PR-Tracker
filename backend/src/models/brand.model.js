
import { getDB } from "../config/databaseConfig.js";

// Get all brands belonging to a user
export async function getAllBrands(userId) {
    const db = getDB();

    const [brands] = await db.query(
        `SELECT *
         FROM brands
         WHERE user_id = ?
         ORDER BY created_at DESC`,
        [userId]
    );

    return brands;
}

// Get brand by ID
export async function getBrandById(brandId) {
    const db = getDB();

    const [brands] = await db.query(
        `SELECT *
         FROM brands
         WHERE brand_id = ?`,
        [brandId]
    );

    return brands[0] ?? null;
}

// Get brand by ID and user ID
export async function getBrandByIdAndUserId(brandId, userId) {
    const db = getDB();

    const [brands] = await db.query(
        `SELECT *
         FROM brands
         WHERE brand_id = ?
         AND user_id = ?`,
        [brandId, userId]
    );

    return brands[0] ?? null;
}

// Get all brands with product count, shipment count and total value
export async function getBrandsByUserId(userId) {
    const db = getDB();

    const [brands] = await db.query(
        `SELECT
            b.*,

            (
                SELECT COUNT(*)
                FROM products p
                WHERE p.brand_id = b.brand_id
                AND p.user_id = b.user_id
            ) AS product_count,

            (
                SELECT COUNT(*)
                FROM shipments s
                WHERE s.brand_id = b.brand_id
                AND s.user_id = b.user_id
            ) AS shipment_count,

            (
                SELECT COALESCE(SUM(p.value), 0)
                FROM products p
                WHERE p.brand_id = b.brand_id
                AND p.user_id = b.user_id
            ) AS total_value

         FROM brands b
         WHERE b.user_id = ?
         ORDER BY b.created_at DESC`,
        [userId]
    );

    return brands;
}

// Create a new brand
export async function createBrand(
    userId,
    brandName,
    description = null,
    website = null,
    logoUrl = null
) {
    const db = getDB();

    const [result] = await db.query(
        `INSERT INTO brands
            (user_id, brand_name, description, website, logo_url)
         VALUES (?, ?, ?, ?, ?)`,
        [
            userId,
            brandName,
            description,
            website,
            logoUrl
        ]
    );

    return result;
}

// Update brand belonging to a user
export async function updateBrand(
    brandId,
    userId,
    brandName,
    description = null,
    website = null,
    logoUrl = null
) {
    const db = getDB();

    const [result] = await db.query(
        `UPDATE brands
         SET brand_name = ?,
             description = ?,
             website = ?,
             logo_url = ?
         WHERE brand_id = ?
         AND user_id = ?`,
        [
            brandName,
            description,
            website,
            logoUrl,
            brandId,
            userId
        ]
    );

    return result;
}

// Delete brand belonging to a user
export async function deleteBrand(brandId, userId) {
    const db = getDB();

    const [result] = await db.query(
        `DELETE FROM brands
         WHERE brand_id = ?
         AND user_id = ?`,
        [brandId, userId]
    );

    return result;
}
