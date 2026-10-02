import { getDB } from "../db/databaseConfig.js";

// Get all users
export async function getAllUsers() {
    const db = getDB();

    const [users] = await db.query(
        "SELECT * FROM users"
    );

    return users;
}

// Get user by ID
export async function getUserById(userId) {
    const db = getDB();

    const [users] = await db.query(
        "SELECT * FROM users WHERE user_id = ?",
        [userId]
    );

    return users[0];
}

// Get user by email
export async function getUserByEmail(email) {
    const db = getDB();

    const [users] = await db.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
    );

    return users[0];
}

// Create a new user
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