import {
    getAllBrands,
    getBrandById,
    getBrandsByUserId,
    createBrand,
    updateBrand,
    deleteBrand
} from "../models/brand.model.js";

import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


// Get all brands
export const getBrands = asyncHandler(async (req, res) => {

    const brands = await getAllBrands();

    return res.status(200).json(
        new apiResponse(
            200,
            brands,
            "Brands fetched successfully"
        )
    );
});


// Get brand by ID
export const getBrand = asyncHandler(async (req, res) => {

    const { brandId } = req.params;

    const brand = await getBrandById(brandId);

    if (!brand) {
        throw new apiError(404, "Brand not found");
    }

    return res.status(200).json(
        new apiResponse(
            200,
            brand,
            "Brand fetched successfully"
        )
    );
});


// Get brands of logged-in user
export const getMyBrands = asyncHandler(async (req, res) => {

    const userId = req.user.user_id;

    const brands = await getBrandsByUserId(userId);

    return res.status(200).json(
        new apiResponse(
            200,
            brands,
            "User brands fetched successfully"
        )
    );
});


// Create brand
export const createNewBrand = asyncHandler(async (req, res) => {

    const userId = req.user.user_id;

    const {
        brandName,
        description,
        websiteUrl,
        logoUrl
    } = req.body;

    if (!brandName) {
        throw new apiError(400, "Brand name is required");
    }

    const result = await createBrand(
        userId,
        brandName,
        description,
        websiteUrl,
        logoUrl
    );

    return res.status(201).json(
        new apiResponse(
            201,
            {
                brandId: result.insertId
            },
            "Brand created successfully"
        )
    );
});


// Update brand
export const updateExistingBrand = asyncHandler(async (req, res) => {

    const { brandId } = req.params;

    const {
        brandName,
        description,
        websiteUrl,
        logoUrl
    } = req.body;

    const existingBrand = await getBrandById(brandId);

    if (!existingBrand) {
        throw new apiError(404, "Brand not found");
    }

    const result = await updateBrand(
        brandId,
        brandName,
        description,
        websiteUrl,
        logoUrl
    );

    if (result.affectedRows === 0) {
        throw new apiError(400, "Brand could not be updated");
    }

    return res.status(200).json(
        new apiResponse(
            200,
            null,
            "Brand updated successfully"
        )
    );
});


// Delete brand
export const removeBrand = asyncHandler(async (req, res) => {

    const { brandId } = req.params;

    const existingBrand = await getBrandById(brandId);

    if (!existingBrand) {
        throw new apiError(404, "Brand not found");
    }

    const result = await deleteBrand(brandId);

    if (result.affectedRows === 0) {
        throw new apiError(400, "Brand could not be deleted");
    }

    return res.status(200).json(
        new apiResponse(
            200,
            null,
            "Brand deleted successfully"
        )
    );
});