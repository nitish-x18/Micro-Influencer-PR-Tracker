
const BASE_URL = "http://localhost:8000/api/v1/health/";

const CONCURRENCY_LEVELS = [10, 25, 50, 100, 200, 500];
const REQUESTS_PER_USER = 10;

async function virtualUser() {
    for (let i = 0; i < REQUESTS_PER_USER; i++) {
        const start = performance.now();

        try {
            const response = await fetch(BASE_URL);
            const duration = performance.now() - start;

            if (response.ok) {
                responseTimes.push(duration);
                successful++;
            } else {
                failed++;
            }
        } catch (error) {
            failed++;
        }
    }
}

let responseTimes = [];
let successful = 0;
let failed = 0;

async function runStressTest(concurrency) {
    responseTimes = [];
    successful = 0;
    failed = 0;

    console.log(`\n========== ${concurrency} CONCURRENT USERS ==========`);

    const start = performance.now();

    const users = [];

    for (let i = 0; i < concurrency; i++) {
        users.push(virtualUser());
    }

    await Promise.all(users);

    const totalDuration = (performance.now() - start) / 1000;

    responseTimes.sort((a, b) => a - b);

    const average = responseTimes.length
        ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
        : 0;

    const p95 = responseTimes.length
        ? responseTimes[Math.ceil(responseTimes.length * 0.95) - 1]
        : 0;

    const totalRequests = concurrency * REQUESTS_PER_USER;

    console.log("Total Requests:", totalRequests);
    console.log("Successful:", successful);
    console.log("Failed:", failed);
    console.log("Duration:", totalDuration.toFixed(2), "seconds");
    console.log("Average Response Time:", average.toFixed(2), "ms");
    console.log("95th Percentile:", p95.toFixed(2), "ms");
    console.log(
        "Throughput:",
        (totalRequests / totalDuration).toFixed(2),
        "requests/second"
    );
}

async function main() {
    console.log("========== STRESS TEST ==========");

    for (const concurrency of CONCURRENCY_LEVELS) {
        await runStressTest(concurrency);
    }

    console.log("\n========== STRESS TEST COMPLETED ==========");
}

main();
