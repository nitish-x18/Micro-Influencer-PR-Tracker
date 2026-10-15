import { Router } from "express";

import {
    getAllShipmentsController,
    getShipmentByIdController,
    getShipmentsByBrandIdController,
    getShipmentsByProductIdController,
    createShipmentController,
    updateShipmentStatusController,
    deleteShipmentController
} from "../controllers/shipment.controller.js";

import { authenticateUser } from "../middlewares/auth.middleware.js";
import { verifyBrandOwnership } from "../middlewares/brand.middleware.js";


const router = Router();


// GET ALL SHIPMENTS
router.get(
    "/",
    authenticateUser,
    getAllShipmentsController
);


// GET SHIPMENTS BY BRAND
router.get(
    "/brand/:brandId",
    authenticateUser,
    verifyBrandOwnership,
    getShipmentsByBrandIdController
);


// GET SHIPMENTS BY PRODUCT
router.get(
    "/product/:productId",
    authenticateUser,
    getShipmentsByProductIdController
);


// CREATE SHIPMENT FOR A BRAND
router.post(
    "/brand/:brandId",
    authenticateUser,
    verifyBrandOwnership,
    createShipmentController
);


// GET SHIPMENT BY ID
router.get(
    "/:shipmentId",
    authenticateUser,
    getShipmentByIdController
);


// UPDATE SHIPMENT
router.patch(
    "/:shipmentId",
    authenticateUser,
    updateShipmentStatusController
);


// DELETE SHIPMENT
router.delete(
    "/:shipmentId",
    authenticateUser,
    deleteShipmentController
);


export default router;