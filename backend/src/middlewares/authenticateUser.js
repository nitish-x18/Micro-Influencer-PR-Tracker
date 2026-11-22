import { verifyAccessToken } from "../utils/jwt.js";
import { getUserById } from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const authenticateUser = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization;

    const bearerToken =
        authHeader?.startsWith("Bearer ")
            ? authHeader.slice(7).trim()
            : null;

    const token = req.cookies?.accessToken || bearerToken;

    if (!token) {
        throw new apiError(401, "Authentication required");
    }

    const decoded = verifyAccessToken(token);

    if (!decoded.userId) {
        throw new apiError(401, "Invalid access token");
    }

    const user = await getUserById(decoded.userId);

    if (!user) {
        throw new apiError(401, "User not found or no longer exists");
    }

    // Never expose the password hash to downstream handlers.
    const { password_hash, ...safeUser } = user;

    req.user = safeUser;
    next();
});
