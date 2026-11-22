import { Router } from "express";
import {
    createBrand,
    getBrands,
    getBrandById,
    updateBrand,
    deleteBrand
} from "../controllers/brand.controller.js";

import { authenticateUser } from "../middlewares/authenticateUser.js";
import { validateRequest } from "../middlewares/validateRequest.js";

import {
    createBrandValidator,
    updateBrandValidator
} from "../validators/brand.validator.js";

const router = Router();

router.use(authenticateUser);

router.route("/")
    .post(validateRequest(createBrandValidator), createBrand)
    .get(getBrands);

router.route("/:brandId")
    .get(getBrandById)
    .patch(validateRequest(updateBrandValidator), updateBrand)
    .delete(deleteBrand);

export default router;
