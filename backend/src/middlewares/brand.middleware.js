import { getBrandById } from "../models/brand.model.js";
import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyBrandOwnership = asyncHandler(async (req, res, next) => {

    const { brandId } = req.params;

    const brand = await getBrandById(brandId);

    if (!brand) {
        throw new apiError(404, "Brand not found");
    }

    if (brand.user_id !== req.user.user_id) {
        throw new apiError(403, "You are not authorized to access this brand");
    }

    req.brand = brand;

    next();
});