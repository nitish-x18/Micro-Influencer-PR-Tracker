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

const router = Router();


// All brand routes require authentication
router.use(authenticateUser);


// Get all brands
router.get("/", getBrands);


// Get logged-in user's brands
router.get("/my", getMyBrands);


// Get a specific brand
router.get("/:brandId", getBrand);


// Create a brand for logged-in user
router.post("/", createNewBrand);


// Update brand
router.put("/:brandId", updateExistingBrand);


// Delete brand
router.delete("/:brandId", removeBrand);


export default router;