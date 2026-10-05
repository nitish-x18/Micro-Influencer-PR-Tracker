import jwt from "jsonwebtoken";
import { getUserById } from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const authenticateUser = asyncHandler(async (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new apiError(401, "Authentication token is required");
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        throw new apiError(401, "Invalid authentication token");
    }

    let decoded;

    try {
        decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );
    } catch (error) {
        throw new apiError(401, "Invalid or expired authentication token");
    }

    const user = await getUserById(decoded.user_id);

    if (!user) {
        throw new apiError(401, "User no longer exists");
    }

    req.user = user;

    next();
});