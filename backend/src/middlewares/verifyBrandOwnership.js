import { getBrandById } from "../models/brand.model.js";
import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyBrandOwnership = asyncHandler(
    async (req, res, next) => {
        const brandId = req.params.brandId || req.params.id;

        if (!brandId) {
            throw new apiError(400, "Brand ID is required");
        }

        const brand = await getBrandById(brandId);

        if (!brand) {
            throw new apiError(404, "Brand not found");
        }

        if (String(brand.user_id) !== String(req.user.user_id)) {
            throw new apiError(
                403,
                "You are not allowed to access this brand"
            );
        }

        req.brand = brand;
        next();
    }
);
