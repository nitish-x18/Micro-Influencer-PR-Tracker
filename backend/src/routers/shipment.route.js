import { Router } from "express";
import {
    createShipment,
    getShipments,
    getShipmentById,
    updateShipmentStatus,
    deleteShipment
} from "../controllers/shipment.controller.js";

import { authenticateUser } from "../middlewares/authenticateUser.js";
import { validateRequest } from "../middlewares/validateRequest.js";

import {
    createShipmentValidator,
    updateShipmentStatusValidator
} from "../validators/shipment.validator.js";

const router = Router();

router.use(authenticateUser);

router.route("/")
    .post(validateRequest(createShipmentValidator), createShipment)
    .get(getShipments);

router.patch(
    "/:shipmentId/status",
    validateRequest(updateShipmentStatusValidator),
    updateShipmentStatus
);

router.route("/:shipmentId")
    .get(getShipmentById)
    .delete(deleteShipment);

export default router;
