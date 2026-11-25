
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const CONCURRENCY_LEVELS = [10, 20, 50, 100];

const db = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 4000),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: true },
    waitForConnections: true,
    connectionLimit: 20,
    queueLimit: 0
});

async function databaseUser(userId) {
    const start = performance.now();

    try {
        const [rows] = await db.query(
            "SELECT COUNT(*) AS total_users FROM users"
        );

        return {
            success: true,
            duration: performance.now() - start
        };

    } catch (error) {
        console.error(`User ${userId} failed:`, error.message);

        return {
            success: false,
            duration: performance.now() - start
        };
    }
}

async function runConcurrencyTest(concurrentUsers) {

    console.log(`\n========== ${concurrentUsers} CONCURRENT USERS ==========`);

    const start = performance.now();

    const results = await Promise.all(
        Array.from(
            { length: concurrentUsers },
            (_, i) => databaseUser(i + 1)
        )
    );

    const totalDuration = (performance.now() - start) / 1000;

    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);

    const times = results
        .map(r => r.duration)
        .sort((a, b) => a - b);

    const average = times.length
        ? times.reduce((a, b) => a + b, 0) / times.length
        : 0;

    const p95 = times.length
        ? times[Math.ceil(times.length * 0.95) - 1]
        : 0;

    const throughput = results.length / totalDuration;

    console.log("Total Queries:", results.length);
    console.log("Successful:", successful.length);
    console.log("Failed:", failed.length);
    console.log("Total Duration:", totalDuration.toFixed(2), "seconds");
    console.log("Average Query Time:", average.toFixed(2), "ms");
    console.log("95th Percentile:", p95.toFixed(2), "ms");
    console.log("Throughput:", throughput.toFixed(2), "queries/second");

    return {
        users: concurrentUsers,
        successful: successful.length,
        failed: failed.length,
        average: average.toFixed(2),
        p95: p95.toFixed(2),
        throughput: throughput.toFixed(2)
    };
}

async function main() {

    console.log("========== DATABASE CONCURRENCY TEST ==========");

    const allResults = [];

    try {
        for (const users of CONCURRENCY_LEVELS) {
            const result = await runConcurrencyTest(users);
            allResults.push(result);
        }

        console.log("\n========== FINAL COMPARISON ==========");
        console.table(allResults);

    } catch (error) {
        console.error("Test failed:", error.message);
    } finally {
        await db.end();
    }
}

main();
