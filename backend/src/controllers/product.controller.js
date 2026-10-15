import {
    getAllProducts,
    getProductById,
    getProductsByBrandId,
    createProduct,
    updateProduct,
    deleteProduct
} from "../models/product.model.js";

import { getBrandById } from "../models/brand.model.js";
import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";


// Get all products
export const getAllProductsController = asyncHandler(async (req, res) => {

    const products = await getAllProducts();

    res.status(200).json({
        success: true,
        message: "Products fetched successfully",
        data: products
    });
});


// Get product by ID
export const getProductByIdController = asyncHandler(async (req, res) => {

    const { productId } = req.params;

    const product = await getProductById(productId);

    if (!product) {
        throw new apiError(404, "Product not found");
    }

    res.status(200).json({
        success: true,
        message: "Product fetched successfully",
        data: product
    });
});


// Get products by brand ID
export const getProductsByBrandIdController = asyncHandler(async (req, res) => {

    const { brandId } = req.params;

    const products = await getProductsByBrandId(brandId);

    res.status(200).json({
        success: true,
        message: "Products fetched successfully",
        data: products
    });
});


// Create product
export const createProductController = asyncHandler(async (req, res) => {

    const { brandId } = req.params;

    const {
        productName,
        value,
        currency,
        description
    } = req.body;

    if (!productName || value === undefined || !currency) {
        throw new apiError(
            400,
            "Product name, value and currency are required"
        );
    }

    const result = await createProduct(
        brandId,
        productName,
        value,
        currency,
        description
    );

    res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: {
            productId: result.insertId
        }
    });
});


// Update product
export const updateProductController = asyncHandler(async (req, res) => {

    const { productId } = req.params;

    const {
        productName,
        value,
        currency,
        description
    } = req.body;

    // Find product
    const product = await getProductById(productId);

    if (!product) {
        throw new apiError(404, "Product not found");
    }

    // Find product's brand
    const brand = await getBrandById(product.brand_id);

    if (!brand) {
        throw new apiError(404, "Brand not found");
    }

    // Check ownership
    if (brand.user_id !== req.user.user_id) {
        throw new apiError(
            403,
            "You are not authorized to update this product"
        );
    }

    if (!productName || value === undefined || !currency) {
        throw new apiError(
            400,
            "Product name, value and currency are required"
        );
    }

    const result = await updateProduct(
        productId,
        productName,
        value,
        currency,
        description
    );

    if (result.affectedRows === 0) {
        throw new apiError(404, "Product not found");
    }

    res.status(200).json({
        success: true,
        message: "Product updated successfully"
    });
});


// Delete product
export const deleteProductController = asyncHandler(async (req, res) => {

    const { productId } = req.params;

    // Find product
    const product = await getProductById(productId);

    if (!product) {
        throw new apiError(404, "Product not found");
    }

    // Find product's brand
    const brand = await getBrandById(product.brand_id);

    if (!brand) {
        throw new apiError(404, "Brand not found");
    }

    // Check ownership
    if (brand.user_id !== req.user.user_id) {
        throw new apiError(
            403,
            "You are not authorized to delete this product"
        );
    }

    const result = await deleteProduct(productId);

    if (result.affectedRows === 0) {
        throw new apiError(404, "Product not found");
    }

    res.status(200).json({
        success: true,
        message: "Product deleted successfully"
    });
});