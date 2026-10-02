import express from "express";

import {
    getAllProductsController,
    getProductByIdController,
    getProductsByBrandIdController,
    createProductController,
    updateProductController,
    deleteProductController
} from "../controllers/product.controller.js";

import { authenticateUser } from "../middlewares/auth.middleware.js";
import { verifyBrandOwnership } from "../middlewares/brand.middleware.js";

const router = express.Router();


// All product routes require authentication
router.use(authenticateUser);


// Get all products
router.get(
    "/",
    getAllProductsController
);


// Get products belonging to a brand
// Ownership is checked before returning them
router.get(
    "/brand/:brandId",
    verifyBrandOwnership,
    getProductsByBrandIdController
);


// Create product for a brand
// User must own the brand
router.post(
    "/brand/:brandId",
    verifyBrandOwnership,
    createProductController
);


// Get product by ID
router.get(
    "/:productId",
    getProductByIdController
);


// Update product
// Controller verifies that the logged-in user owns the product's brand
router.put(
    "/:productId",
    updateProductController
);


// Delete product
// Controller verifies that the logged-in user owns the product's brand
router.delete(
    "/:productId",
    deleteProductController
);


export default router;