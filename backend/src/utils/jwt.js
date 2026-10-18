
import jwt from "jsonwebtoken";
import { apiError } from "./apiError.js";

const generateAccessToken = (userId) => {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new apiError(
            500,
            "JWT_SECRET is not configured"
        );
    }

    return jwt.sign(
        { userId: String(userId) },
        secret,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || "1d"
        }
    );
};

const verifyAccessToken = (token) => {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new apiError(
            500,
            "JWT_SECRET is not configured"
        );
    }

    try {
        return jwt.verify(token, secret);
    } catch {
        throw new apiError(
            401,
            "Invalid or expired access token"
        );
    }
};

export {
    generateAccessToken,
    verifyAccessToken
};
