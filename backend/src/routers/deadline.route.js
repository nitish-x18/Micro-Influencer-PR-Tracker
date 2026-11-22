import { Router } from "express";
import {
    createDeadline,
    getDeadlines,
    getDeadlineById,
    updateDeadline,
    completeDeadline,
    deleteDeadline
} from "../controllers/deadline.controller.js";

import { authenticateUser } from "../middlewares/authenticateUser.js";
import { validateRequest } from "../middlewares/validateRequest.js";

import {
    createDeadlineValidator,
    updateDeadlineValidator,
    completeDeadlineValidator
} from "../validators/deadline.validator.js";

const router = Router();

router.use(authenticateUser);

router.route("/")
    .post(validateRequest(createDeadlineValidator), createDeadline)
    .get(getDeadlines);

router.patch(
    "/:deadlineId/complete",
    validateRequest(completeDeadlineValidator),
    completeDeadline
);

router.route("/:deadlineId")
    .get(getDeadlineById)
    .patch(validateRequest(updateDeadlineValidator), updateDeadline)
    .delete(deleteDeadline);

export default router;
