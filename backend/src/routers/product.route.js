import { Router } from "express";
import {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
} from "../controllers/product.controller.js";

import { authenticateUser } from "../middlewares/authenticateUser.js";
import { validateRequest } from "../middlewares/validateRequest.js";

import {
    createProductValidator,
    updateProductValidator
} from "../validators/product.validator.js";

const router = Router();

router.use(authenticateUser);

router.route("/")
    .post(validateRequest(createProductValidator), createProduct)
    .get(getProducts);

router.route("/:productId")
    .get(getProductById)
    .patch(validateRequest(updateProductValidator), updateProduct)
    .delete(deleteProduct);

export default router;
