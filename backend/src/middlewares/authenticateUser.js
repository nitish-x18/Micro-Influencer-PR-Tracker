
import { verifyAccessToken } from "../utils/jwt.js";
import { getUserById } from "../models/user.model.js";
import { isAccessTokenRevoked } from "../models/authToken.model.js";
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

    if (!decoded.userId || !decoded.exp) {
        throw new apiError(401, "Invalid access token");
    }

    const revoked = await isAccessTokenRevoked(token);

    if (revoked) {
        throw new apiError(401, "Access token has been revoked");
    }

    const user = await getUserById(decoded.userId);

    if (!user) {
        throw new apiError(401, "User not found or no longer exists");
    }

    const { password_hash, ...safeUser } = user;

    req.user = safeUser;
    req.accessToken = token;
    req.tokenExpiresAt = new Date(decoded.exp * 1000);

    next();
});
