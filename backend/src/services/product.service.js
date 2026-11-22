import * as productModel from "../models/product.model.js";
import * as brandModel from "../models/brand.model.js";
import { apiError } from "../utils/apiError.js";

const parseId = (value, fieldName = "ID") => {
    const id = String(value ?? "");

    if (!/^[1-9]\d*$/.test(id)) {
        throw new apiError(400, `Invalid ${fieldName}`);
    }

    return id;
};

const validateProductData = (data, isUpdate = false) => {
    const errors = [];

    if (!isUpdate || data.product_name !== undefined) {
        if (
            typeof data.product_name !== "string" ||
            !data.product_name.trim()
        ) {
            errors.push("Product name is required");
        } else if (data.product_name.trim().length > 255) {
            errors.push("Product name must not exceed 255 characters");
        }
    }

    if (!isUpdate || data.value !== undefined) {
        const value = Number(data.value);

        if (
            data.value === "" ||
            data.value === null ||
            data.value === undefined ||
            !Number.isFinite(value) ||
            value < 0
        ) {
            errors.push("Product value must be a non-negative number");
        } else if (!/^\d+(\.\d{1,2})?$/.test(String(data.value))) {
            errors.push("Product value can have at most 2 decimal places");
        }
    }

    if (!isUpdate || data.currency !== undefined) {
        if (
            typeof data.currency !== "string" ||
            !/^[A-Za-z]{3}$/.test(data.currency.trim())
        ) {
            errors.push("Currency must be a 3-letter currency code");
        }
    }

    if (
        data.description !== undefined &&
        data.description !== null &&
        typeof data.description !== "string"
    ) {
        errors.push("Description must be a string");
    }

    if (
        typeof data.description === "string" &&
        data.description.length > 5000
    ) {
        errors.push("Description must not exceed 5000 characters");
    }

    if (errors.length > 0) {
        throw new apiError(400, "Invalid product data", errors);
    }
};

const getOwnedProduct = async (productId, userId) => {
    const id = parseId(productId, "product ID");

    const product = await productModel.getProductById(id);

    if (!product || String(product.user_id) !== String(userId)) {
        throw new apiError(404, "Product not found");
    }

    return product;
};

const verifyOwnedBrand = async (brandId, userId) => {
    const id = parseId(brandId, "brand ID");

    const brand = await brandModel.getBrandById(id);

    if (!brand || String(brand.user_id) !== String(userId)) {
        throw new apiError(404, "Brand not found");
    }

    return brand;
};

// Create product
export const createProduct = async (userId, data) => {
    validateProductData(data);

    const brandId = parseId(data.brand_id, "brand ID");

    await verifyOwnedBrand(brandId, userId);

    const result = await productModel.createProduct(
        userId,
        brandId,
        data.product_name.trim(),
        data.value,
        data.currency.trim().toUpperCase(),
        data.description ?? null
    );

    return productModel.getProductById(result.insertId);
};

// Get all products for current user
export const getProducts = async (userId) => {
    return productModel.getProductsByUserId(userId);
};

// Get a single product for current user
export const getProductById = async (userId, productId) => {
    return getOwnedProduct(productId, userId);
};

// Update product
export const updateProduct = async (userId, productId, data) => {
    const existingProduct = await getOwnedProduct(productId, userId);

    validateProductData(data, true);

    const productName =
        data.product_name === undefined
            ? existingProduct.product_name
            : data.product_name.trim();

    const value =
        data.value === undefined
            ? existingProduct.value
            : data.value;

    const currency =
        data.currency === undefined
            ? existingProduct.currency
            : data.currency.trim().toUpperCase();

    const description =
        data.description === undefined
            ? existingProduct.description
            : data.description;

    const result = await productModel.updateProduct(
        existingProduct.product_id,
        productName,
        value,
        currency,
        description
    );

    if (!result.affectedRows) {
        const refreshed = await productModel.getProductById(
            existingProduct.product_id
        );

        if (!refreshed) {
            throw new apiError(404, "Product not found");
        }

        return refreshed;
    }

    return productModel.getProductById(existingProduct.product_id);
};

// Delete product
export const deleteProduct = async (userId, productId) => {
    const product = await getOwnedProduct(productId, userId);

    const result = await productModel.deleteProduct(product.product_id);

    if (!result.affectedRows) {
        throw new apiError(404, "Product not found");
    }

    return {
        product_id: product.product_id
    };
};