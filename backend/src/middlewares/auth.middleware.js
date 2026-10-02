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

    const decoded = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET
    );

    const user = await getUserById(decoded.userId);

    if (!user) {
        throw new apiError(401, "User no longer exists");
    }

    // Store authenticated user in request
    req.user = user;

    next();
});