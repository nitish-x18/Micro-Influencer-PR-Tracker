import { Router } from "express";

import {
    getBrands,
    getBrand,
    getMyBrands,
    createNewBrand,
    updateExistingBrand,
    removeBrand
} from "../controllers/brand.controller.js";

import { authenticateUser } from "../middlewares/auth.middleware.js";
import { verifyBrandOwnership } from "../middlewares/brand.middleware.js";

const router = Router();

router.use(authenticateUser);

router.get("/", getBrands);

router.get("/my", getMyBrands);

router.get("/:brandId", verifyBrandOwnership, getBrand);

router.post("/", createNewBrand);

router.put(
    "/:brandId",
    verifyBrandOwnership,
    updateExistingBrand
);

router.delete(
    "/:brandId",
    verifyBrandOwnership,
    removeBrand
);

export default router;