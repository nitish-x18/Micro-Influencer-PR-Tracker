
import { createHash } from "node:crypto";
import { getDB } from "../config/databaseConfig.js";

// Generate SHA-256 hash of access token
const hashToken = (token) => {
    return createHash("sha256")
        .update(token)
        .digest("hex");
};

// Store revoked token
export const revokeAccessToken = async (token, userId, expiresAt) => {
    const db = getDB();

    const tokenHash = hashToken(token);

    const [result] = await db.query(
        `INSERT INTO revoked_access_tokens
         (token_hash, user_id, expires_at)
         VALUES (?, ?, ?)`,
        [tokenHash, userId, expiresAt]
    );

    return result;
};

// Check whether token has been revoked
export const isAccessTokenRevoked = async (token) => {
    const db = getDB();

    const tokenHash = hashToken(token);

    const [rows] = await db.query(
        `SELECT token_id
         FROM revoked_access_tokens
         WHERE token_hash = ?
         AND expires_at > NOW()
         LIMIT 1`,
        [tokenHash]
    );

    return rows.length > 0;
};
