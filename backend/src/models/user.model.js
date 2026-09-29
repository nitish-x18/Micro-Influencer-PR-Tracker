const db = require("../db/databaseConfig");

// Create a new user
const createUser = (full_name, email, password_hash, callback) => {
    const sql = `
        INSERT INTO users (full_name, email, password_hash)
        VALUES (?, ?, ?)
    `;

    db.query(sql, [full_name, email, password_hash], callback);
};

// Find a user by email
const getUserByEmail = (email, callback) => {
    const sql = `
        SELECT *
        FROM users
        WHERE email = ?
    `;

    db.query(sql, [email], callback);
};

// Find a user by ID
const getUserById = (user_id, callback) => {
    const sql = `
        SELECT *
        FROM users
        WHERE user_id = ?
    `;

    db.query(sql, [user_id], callback);
};

module.exports = {
    createUser,
    getUserByEmail,
    getUserById
};