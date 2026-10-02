import { getDB } from "../db/databaseConfig.js";

// Get all users
async function getAllUsers() {
    const db = getDB();

    const [users] = await db.query(
        "SELECT * FROM users"
    );

    return users;
}

// Get user by ID
async function getUserById(userId) {
    const db = getDB();

    const [users] = await db.query(
        "SELECT * FROM users WHERE user_id = ?",
        [userId]
    );

    return users[0];
}

// Get user by email
async function getUserByEmail(email) {
    const db = getDB();

    const [users] = await db.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
    );

    return users[0];
}

// Create a new user
async function createUser(fullName, email, passwordHash) {
    const db = getDB();

    const [result] = await db.query(
        `INSERT INTO users
        (full_name, email, password_hash)
        VALUES (?, ?, ?)`,
        [fullName, email, passwordHash]
    );

    return result;
}

export {
    getAllUsers,
    getUserById,
    getUserByEmail,
    createUser
};