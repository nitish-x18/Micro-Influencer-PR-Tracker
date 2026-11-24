
import { getBrandByIdAndUserId } from "../models/brand.model.js";
import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyBrandOwnership = asyncHandler(
    async (req, res, next) => {
        const brandId = req.params.brandId || req.params.id;
        const userId = req.user?.user_id;

        if (!brandId) {
            throw new apiError(400, "Brand ID is required");
        }

        if (!userId) {
            throw new apiError(401, "Authentication required");
        }

        if (!/^[1-9]\d*$/.test(String(brandId))) {
            throw new apiError(400, "Invalid brand ID");
        }

        const brand = await getBrandByIdAndUserId(
            brandId,
            userId
        );

        if (!brand) {
            throw new apiError(404, "Brand not found");
        }

        req.brand = brand;
        next();
    }
);
