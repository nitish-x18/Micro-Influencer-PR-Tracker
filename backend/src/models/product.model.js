
import { getDB } from "../config/databaseConfig.js";

// Get all products belonging to a user
export async function getAllProducts(userId) {
    const db = getDB();

    const [products] = await db.query(
        `SELECT product_id, user_id, brand_id, product_name,
                value, currency, description, created_at
         FROM products
         WHERE user_id = ?`,
        [userId]
    );

    return products;
}

// Get products by user ID
export async function getProductsByUserId(userId) {
    const db = getDB();

    const [products] = await db.query(
        `SELECT *
         FROM products
         WHERE user_id = ?`,
        [userId]
    );

    return products;
}

// Get product by ID
export async function getProductById(productId) {
    const db = getDB();

    const [products] = await db.query(
        `SELECT *
         FROM products
         WHERE product_id = ?`,
        [productId]
    );

    return products[0] ?? null;
}

// Get product by ID and user ID
export async function getProductByIdAndUserId(productId, userId) {
    const db = getDB();

    const [products] = await db.query(
        `SELECT *
         FROM products
         WHERE product_id = ?
         AND user_id = ?`,
        [productId, userId]
    );

    return products[0] ?? null;
}

// Get products by brand ID and user ID
export async function getProductsByBrandId(brandId, userId) {
    const db = getDB();

    const [products] = await db.query(
        `SELECT *
         FROM products
         WHERE brand_id = ?
         AND user_id = ?`,
        [brandId, userId]
    );

    return products;
}

// Create a new product
export async function createProduct(
    userId,
    brandId,
    productName,
    value,
    currency,
    description
) {
    const db = getDB();

    const [result] = await db.query(
        `INSERT INTO products
         (user_id, brand_id, product_name, value, currency, description)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
            userId,
            brandId,
            productName,
            value,
            currency,
            description
        ]
    );

    return result;
}

// Update product belonging to a user
export async function updateProduct(
    productId,
    userId,
    productName,
    value,
    currency,
    description
) {
    const db = getDB();

    const [result] = await db.query(
        `UPDATE products
         SET product_name = ?,
             value = ?,
             currency = ?,
             description = ?
         WHERE product_id = ?
         AND user_id = ?`,
        [
            productName,
            value,
            currency,
            description,
            productId,
            userId
        ]
    );

    return result;
}

// Delete product belonging to a user
export async function deleteProduct(productId, userId) {
    const db = getDB();

    const [result] = await db.query(
        `DELETE FROM products
         WHERE product_id = ?
         AND user_id = ?`,
        [productId, userId]
    );

    return result;
}
