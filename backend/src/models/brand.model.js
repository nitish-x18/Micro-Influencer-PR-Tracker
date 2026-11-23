import { getDB } from "../config/databaseConfig.js";

// Get all brands
export async function getAllBrands() {
    const db = getDB();

    const [brands] = await db.query(
        "SELECT * FROM brands"
    );

    return brands;
}

// Get brand by ID
export async function getBrandById(brandId) {
    const db = getDB();

    const [brands] = await db.query(
        "SELECT * FROM brands WHERE brand_id = ?",
        [brandId]
    );

    return brands[0] ?? null;
}

// Get brands by user ID
export async function getBrandsByUserId(userId) {
    const db = getDB();

    const [brands] = await db.query(
        `SELECT
            b.*,
            COUNT(p.product_id) AS product_count,
            COALESCE(SUM(p.value), 0) AS total_value
         FROM brands b
         LEFT JOIN products p
            ON b.brand_id = p.brand_id
         WHERE b.user_id = ?
         GROUP BY b.brand_id
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

// Update a brand
export async function updateBrand(
    brandId,
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
         WHERE brand_id = ?`,
        [
            brandName,
            description,
            website,
            logoUrl,
            brandId
        ]
    );

    return result;
}

// Delete a brand
export async function deleteBrand(brandId) {
    const db = getDB();

    const [result] = await db.query(
        "DELETE FROM brands WHERE brand_id = ?",
        [brandId]
    );

    return result;
}