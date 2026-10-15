import { getDB } from "../db/databaseConfig.js";

// Get all users
export async function getAllUsers() {
    const db = getDB();

    const [users] = await db.query(
        `SELECT user_id, full_name, email, google_id, created_at
         FROM users`
    );

    return users;
}

// Get user by ID
export async function getUserById(userId) {
    const db = getDB();

    const [users] = await db.query(
        `SELECT user_id, full_name, email, google_id, created_at
         FROM users
         WHERE user_id = ?`,
        [userId]
    );

    return users[0] ?? null;
}

// Get user by email
export async function getUserByEmail(email) {
    const db = getDB();

    const [users] = await db.query(
        `SELECT *
         FROM users
         WHERE email = ?`,
        [email]
    );

    return users[0] ?? null;
}

// Get user by Google ID
export async function getUserByGoogleId(googleId) {
    const db = getDB();

    const [users] = await db.query(
        `SELECT *
         FROM users
         WHERE google_id = ?`,
        [googleId]
    );

    return users[0] ?? null;
}

// Create a user with email and password
export async function createUser(fullName, email, passwordHash) {
    const db = getDB();

    const [result] = await db.query(
        `INSERT INTO users
            (full_name, email, password_hash)
         VALUES (?, ?, ?)`,
        [fullName, email, passwordHash]
    );

    return result;
}

// Create a user with Google sign-in
export async function createGoogleUser(fullName, email, googleId) {
    const db = getDB();

    const [result] = await db.query(
        `INSERT INTO users
            (full_name, email, google_id, password_hash)
         VALUES (?, ?, ?, NULL)`,
        [fullName, email, googleId]
    );

    return result;
}

// Save password-reset token details
export async function savePasswordResetToken(
    userId,
    resetTokenHash,
    expiresAt
) {
    const db = getDB();

    const [result] = await db.query(
        `UPDATE users
         SET reset_token_hash = ?,
             reset_token_expires_at = ?
         WHERE user_id = ?`,
        [resetTokenHash, expiresAt, userId]
    );

    return result;
}

// Clear password-reset token details
export async function clearPasswordResetToken(userId) {
    const db = getDB();

    const [result] = await db.query(
        `UPDATE users
         SET reset_token_hash = NULL,
             reset_token_expires_at = NULL
         WHERE user_id = ?`,
        [userId]
    );

    return result;
}

// Update password
export async function updateUserPassword(userId, passwordHash) {
    const db = getDB();

    const [result] = await db.query(
        `UPDATE users
         SET password_hash = ?,
             reset_token_hash = NULL,
             reset_token_expires_at = NULL
         WHERE user_id = ?`,
        [passwordHash, userId]
    );

    return result;
}