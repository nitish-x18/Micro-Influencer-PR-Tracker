import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

let db;

export async function connectDB() {
    try {
        db = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,

            ssl: {
                minVersion: "TLSv1.2"
            }
        });

        console.log("DB CONNECTED SUCCESSFULLY");

        const [rows] = await db.query(
            "SELECT DATABASE() AS database_name"
        );

        console.log("Connected database:", rows[0].database_name);

        return db;

    } catch (error) {
        console.error("DATABASE CONNECTION FAILED:", error.message);
        throw error;
    }
}

export function getDB() {
    if (!db) {
        throw new Error("Database is not connected yet.");
    }

    return db;
}