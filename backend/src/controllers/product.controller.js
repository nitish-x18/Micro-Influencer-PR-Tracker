import * as productService from "../services/product.service.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createProduct = asyncHandler(async (req, res) => {
    const product = await productService.createProduct(
        req.user.user_id,
        req.body
    );

    return res.status(201).json(
        new apiResponse(201, product, "Product created successfully")
    );
});

export const getProducts = asyncHandler(async (req, res) => {
    const result = await productService.getProducts(
        req.user.user_id,
        req.query
    );

    return res.status(200).json(
        new apiResponse(200, result, "Products retrieved successfully")
    );
});

export const getProductById = asyncHandler(async (req, res) => {
    const product = await productService.getProductById(
        req.user.user_id,
        req.params.productId
    );

    return res.status(200).json(
        new apiResponse(200, product, "Product retrieved successfully")
    );
});

export const updateProduct = asyncHandler(async (req, res) => {
    const product = await productService.updateProduct(
        req.user.user_id,
        req.params.productId,
        req.body
    );

    return res.status(200).json(
        new apiResponse(200, product, "Product updated successfully")
    );
});

export const deleteProduct = asyncHandler(async (req, res) => {
    await productService.deleteProduct(
        req.user.user_id,
        req.params.productId
    );

    return res.status(200).json(
        new apiResponse(200, null, "Product deleted successfully")
    );
});
