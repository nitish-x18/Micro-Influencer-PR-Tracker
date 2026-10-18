import * as brandService from "../services/brand.service.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createBrand = asyncHandler(async (req, res) => {
    const brand = await brandService.createBrand(req.user.user_id, req.body);

    return res.status(201).json(
        new apiResponse(201, brand, "Brand created successfully")
    );
});

export const getBrands = asyncHandler(async (req, res) => {
    const result = await brandService.getBrands(
        req.user.user_id,
        req.query
    );

    return res.status(200).json(
        new apiResponse(200, result, "Brands retrieved successfully")
    );
});

export const getBrandById = asyncHandler(async (req, res) => {
    const brand = await brandService.getBrandById(
        req.user.user_id,
        req.params.brandId
    );

    return res.status(200).json(
        new apiResponse(200, brand, "Brand retrieved successfully")
    );
});

export const updateBrand = asyncHandler(async (req, res) => {
    const brand = await brandService.updateBrand(
        req.user.user_id,
        req.params.brandId,
        req.body
    );

    return res.status(200).json(
        new apiResponse(200, brand, "Brand updated successfully")
    );
});

export const deleteBrand = asyncHandler(async (req, res) => {
    await brandService.deleteBrand(
        req.user.user_id,
        req.params.brandId
    );

    return res.status(200).json(
        new apiResponse(200, null, "Brand deleted successfully")
    );
});
