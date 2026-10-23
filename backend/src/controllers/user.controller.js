import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import {
    getAllUsers,
    getUserById,
    getUserByEmail,
    createUser
} from "../models/user.model.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";

// Generate JWT
const generateToken = (user) => {
    if (!process.env.JWT_SECRET) {
        throw new apiError(500, "JWT_SECRET is not configured");
    }

    return jwt.sign(
        {
            user_id: user.user_id,
            email: user.email
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || "1d"
        }
    );
};

// Register User
export const registerUser = asyncHandler(async (req, res) => {
    const { full_name, password } = req.body;
    const email = req.body.email?.trim().toLowerCase();

    if (
        typeof full_name !== "string" ||
        !full_name.trim() ||
        typeof email !== "string" ||
        !email ||
        typeof password !== "string" ||
        !password
    ) {
        throw new apiError(
            400,
            "Full name, email and password are required"
        );
    }

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
        throw new apiError(
            409,
            "User with this email already exists"
        );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await createUser(
        full_name.trim(),
        email,
        passwordHash
    );

    const user = await getUserById(result.insertId);

    if (!user) {
        throw new apiError(
            500,
            "User was created but could not be retrieved"
        );
    }

    delete user.password_hash;

    return res.status(201).json(
        new apiResponse(
            201,
            user,
            "User registered successfully"
        )
    );
});

// Login User
export const loginUser = asyncHandler(async (req, res) => {
    const email = req.body.email?.trim().toLowerCase();
    const { password } = req.body;

    if (
        typeof email !== "string" ||
        !email ||
        typeof password !== "string" ||
        !password
    ) {
        throw new apiError(
            400,
            "Email and password are required"
        );
    }

    const user = await getUserByEmail(email);

    if (!user || !user.password_hash) {
        throw new apiError(
            401,
            "Invalid email or password"
        );
    }

    const isPasswordCorrect = await bcrypt.compare(
        password,
        user.password_hash
    );

    if (!isPasswordCorrect) {
        throw new apiError(
            401,
            "Invalid email or password"
        );
    }

    const token = generateToken(user);

    delete user.password_hash;

    res.cookie("accessToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000
    });

    return res.status(200).json(
        new apiResponse(
            200,
            {
                user,
                accessToken: token
            },
            "Login successful"
        )
    );
});

// Logout User
export const logoutUser = asyncHandler(async (req, res) => {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
    });

    return res.status(200).json(
        new apiResponse(
            200,
            null,
            "Logout successful"
        )
    );
});

// Get Current User
export const getCurrentUser = asyncHandler(async (req, res) => {
    if (!req.user?.user_id) {
        throw new apiError(401, "Authentication required");
    }

    const user = await getUserById(req.user.user_id);

    if (!user) {
        throw new apiError(404, "User not found");
    }

    delete user.password_hash;

    return res.status(200).json(
        new apiResponse(
            200,
            user,
            "User fetched successfully"
        )
    );
});

// Get All Users
export const getUsers = asyncHandler(async (req, res) => {
    const users = await getAllUsers();

    const safeUsers = users.map(({ password_hash, ...user }) => user);

    return res.status(200).json(
        new apiResponse(
            200,
            safeUsers,
            "Users fetched successfully"
        )
    );
});