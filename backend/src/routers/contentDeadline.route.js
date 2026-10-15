import { Router } from "express";

import {
    getAllContentDeadlinesController,
    getContentDeadlineByIdController,
    getContentDeadlinesByShipmentIdController,
    createContentDeadlineController,
    updateContentDeadlineController,
    deleteContentDeadlineController
} from "../controllers/contentDeadline.controller.js";

import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = Router();

// Get all content deadlines
router.get(
    "/",
    authenticateUser,
    getAllContentDeadlinesController
);

// IMPORTANT: shipment route before /:deadlineId
// Get deadlines by shipment ID
router.get(
    "/shipment/:shipmentId",
    authenticateUser,
    getContentDeadlinesByShipmentIdController
);

// Get deadline by ID
router.get(
    "/:deadlineId",
    authenticateUser,
    getContentDeadlineByIdController
);

// Create content deadline
router.post(
    "/",
    authenticateUser,
    createContentDeadlineController
);

// Update content deadline
router.put(
    "/:deadlineId",
    authenticateUser,
    updateContentDeadlineController
);

// Delete content deadline
router.delete(
    "/:deadlineId",
    authenticateUser,
    deleteContentDeadlineController
);

export default router;