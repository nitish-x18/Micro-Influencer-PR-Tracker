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

    const { full_name, email, password } = req.body;

    if (!full_name || !email || !password) {
        throw new apiError(
            400,
            "Full name, email and password are required"
        );
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
        throw new apiError(
            409,
            "User with this email already exists"
        );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const result = await createUser(
        full_name,
        email,
        passwordHash
    );

    // Get newly created user
    const user = await getUserById(result.insertId);

    // Remove password hash from response
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

    const { email, password } = req.body;

    if (!email || !password) {
        throw new apiError(
            400,
            "Email and password are required"
        );
    }

    // Find user
    const user = await getUserByEmail(email);

    if (!user) {
        throw new apiError(
            401,
            "Invalid email or password"
        );
    }

    // Compare password
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

    // Generate JWT
    const token = generateToken(user);

    delete user.password_hash;

    // Store token in cookie
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

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                null,
                "Logout successful"
            )
        );
});


// Get Current User
export const getCurrentUser = asyncHandler(async (req, res) => {

    const userId = req.user.user_id;

    const user = await getUserById(userId);

    if (!user) {
        throw new apiError(
            404,
            "User not found"
        );
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

    // Remove password hashes
    const safeUsers = users.map(user => {
        delete user.password_hash;
        return user;
    });

    return res.status(200).json(
        new apiResponse(
            200,
            safeUsers,
            "Users fetched successfully"
        )
    );
});