import { getDB } from "../db/databaseConfig.js";

// Get all products
export async function getAllProducts() {
    const db = getDB();

    const [products] = await db.query(
        "SELECT * FROM products"
    );

    return products;
}

// Get product by ID
export async function getProductById(productId) {
    const db = getDB();

    const [products] = await db.query(
        "SELECT * FROM products WHERE product_id = ?",
        [productId]
    );

    return products[0];
}

// Get products by brand ID
export async function getProductsByBrandId(brandId) {
    const db = getDB();

    const [products] = await db.query(
        "SELECT * FROM products WHERE brand_id = ?",
        [brandId]
    );

    return products;
}

// Create a new product
export async function createProduct(
    brandId,
    productName,
    value,
    currency,
    description
) {
    const db = getDB();

    const [result] = await db.query(
        `INSERT INTO products
        (brand_id, product_name, value, currency, description)
        VALUES (?, ?, ?, ?, ?)`,
        [brandId, productName, value, currency, description]
    );

    return result;
}

// Update a product
export async function updateProduct(
    productId,
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
        WHERE product_id = ?`,
        [productName, value, currency, description, productId]
    );

    return result;
}

// Delete a product
export async function deleteProduct(productId) {
    const db = getDB();

    const [result] = await db.query(
        "DELETE FROM products WHERE product_id = ?",
        [productId]
    );

    return result;
}