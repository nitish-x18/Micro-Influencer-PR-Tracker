import bcrypt from "bcrypt";
import {
    getUserByEmail,
    getUserById,
    createUser
} from "../models/user.model.js";
import { generateAccessToken } from "../utils/jwt.js";
import { apiError } from "../utils/apiError.js";

const SALT_ROUNDS = 12;

// Register a user
export const registerUser = async ({ full_name, email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await getUserByEmail(normalizedEmail);

    if (existingUser) {
        throw new apiError(409, "An account with this email already exists");
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const result = await createUser(
        full_name.trim(),
        normalizedEmail,
        passwordHash
    );

    const user = await getUserById(result.insertId);

    if (!user) {
        throw new apiError(500, "Failed to retrieve the created user");
    }

    const accessToken = generateAccessToken(user.user_id);

    return {
        user,
        accessToken
    };
};

// Login a user
export const loginUser = async ({ email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();

    const user = await getUserByEmail(normalizedEmail);

    if (!user || !user.password_hash) {
        throw new apiError(401, "Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(
        password,
        user.password_hash
    );

    if (!isPasswordValid) {
        throw new apiError(401, "Invalid email or password");
    }

    const accessToken = generateAccessToken(user.user_id);

    // Never return the password hash to the client.
    const {
        password_hash,
        reset_token_hash,
        reset_token_expires_at,
        ...safeUser
    } = user;

    return {
        user: safeUser,
        accessToken
    };
};
