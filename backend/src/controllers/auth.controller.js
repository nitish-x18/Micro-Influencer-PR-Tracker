import {
    registerUser,
    loginUser
} from "../services/auth.service.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const setAuthCookie = (res, token) => {
    res.cookie("accessToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000
    });
};

export const register = asyncHandler(async (req, res) => {
    const result = await registerUser(req.body);

    setAuthCookie(res, result.accessToken);

    return res.status(201).json(
        new apiResponse(
            201,
            result,
            "Account created successfully"
        )
    );
});

export const login = asyncHandler(async (req, res) => {
    const result = await loginUser(req.body);

    setAuthCookie(res, result.accessToken);

    return res.status(200).json(
        new apiResponse(
            200,
            result,
            "Login successful"
        )
    );
});

export const logout = asyncHandler(async (req, res) => {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
    });

    return res.status(200).json(
        new apiResponse(200, null, "Logout successful")
    );
});

export const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200).json(
        new apiResponse(200, req.user, "Current user retrieved successfully")
    );
});
