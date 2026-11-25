
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const POOL_LIMITS = [10, 20, 50];
const TOTAL_QUERIES = 100;

async function runPoolTest(connectionLimit) {
    console.log(`\n========== POOL LIMIT: ${connectionLimit} ==========`);

    const db = mysql.createPool({
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT || 4000),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        ssl: { rejectUnauthorized: true },
        waitForConnections: true,
        connectionLimit,
        queueLimit: 0
    });

    try {
        // Warm-up query (not included in measurements)
        await db.query("SELECT 1");

        const responseTimes = [];
        let successful = 0;
        let failed = 0;

        const start = performance.now();

        const queries = Array.from(
            { length: TOTAL_QUERIES },
            async () => {
                const queryStart = performance.now();

                try {
                    await db.query(
                        "SELECT COUNT(*) AS total_users FROM users"
                    );

                    responseTimes.push(performance.now() - queryStart);
                    successful++;
                } catch (error) {
                    failed++;
                    console.error("Query failed:", error.message);
                }
            }
        );

        await Promise.all(queries);

        const duration = (performance.now() - start) / 1000;

        responseTimes.sort((a, b) => a - b);

        const average = responseTimes.length
            ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
            : 0;

        const p95 = responseTimes.length
            ? responseTimes[Math.ceil(responseTimes.length * 0.95) - 1]
            : 0;

        const throughput = successful / duration;

        console.log("Pool Limit:", connectionLimit);
        console.log("Total Queries:", TOTAL_QUERIES);
        console.log("Successful:", successful);
        console.log("Failed:", failed);
        console.log("Duration:", duration.toFixed(2), "seconds");
        console.log("Average Query Time:", average.toFixed(2), "ms");
        console.log("95th Percentile:", p95.toFixed(2), "ms");
        console.log("Throughput:", throughput.toFixed(2), "queries/second");

        return {
            poolLimit: connectionLimit,
            successful,
            failed,
            average: average.toFixed(2),
            p95: p95.toFixed(2),
            throughput: throughput.toFixed(2)
        };

    } finally {
        await db.end();
    }
}

async function main() {
    console.log("========== DATABASE CONNECTION POOL TEST ==========");

    const results = [];

    try {
        for (const limit of POOL_LIMITS) {
            results.push(await runPoolTest(limit));
        }

        console.log("\n========== FINAL COMPARISON ==========");
        console.table(results);

    } catch (error) {
        console.error("Pool test failed:", error.message);
    }
}

main();
