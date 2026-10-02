import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export async function connectDB() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,

            // Required for TiDB Cloud public connection
            ssl: {
                minVersion: "TLSv1.2"
            }
        });

        console.log("DB CONNECTED SUCCESSFULLY");

        // Test the actual database
        const [rows] = await connection.query("SELECT DATABASE() AS database_name");

        console.log("Connected database:", rows[0].database_name);

        return connection;

    } catch (error) {
        console.error("DATABASE CONNECTION FAILED:", error.message);
        throw error;
    }
}