import { getDB } from "../db/databaseConfig.js";

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

    return brands[0];
}

// Get brands by user ID
export async function getBrandsByUserId(userId) {
    const db = getDB();

    const [brands] = await db.query(
        "SELECT * FROM brands WHERE user_id = ?",
        [userId]
    );

    return brands;
}

// Create a new brand
export async function createBrand(
    userId,
    brandName,
    description,
    websiteUrl,
    logoUrl
) {
    const db = getDB();

    const [result] = await db.query(
        `INSERT INTO brands
        (user_id, brand_name, description, website_url, logo_url)
        VALUES (?, ?, ?, ?, ?)`,
        [userId, brandName, description, websiteUrl, logoUrl]
    );

    return result;
}

// Update a brand
export async function updateBrand(
    brandId,
    brandName,
    description,
    websiteUrl,
    logoUrl
) {
    const db = getDB();

    const [result] = await db.query(
        `UPDATE brands
        SET brand_name = ?,
            description = ?,
            website_url = ?,
            logo_url = ?
        WHERE brand_id = ?`,
        [brandName, description, websiteUrl, logoUrl, brandId]
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