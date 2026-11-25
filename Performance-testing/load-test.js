
const BASE_URL = "http://localhost:8000/api/v1/health/";

const TOTAL_USERS = 100;
const REQUESTS_PER_USER = 10;

const responseTimes = [];
let successfulRequests = 0;
let failedRequests = 0;

async function virtualUser(userId) {
    for (let i = 0; i < REQUESTS_PER_USER; i++) {
        const startTime = performance.now();

        try {
            const response = await fetch(BASE_URL);

            const endTime = performance.now();
            responseTimes.push(endTime - startTime);

            if (response.ok) {
                successfulRequests++;
            } else {
                failedRequests++;
            }
        } catch (error) {
            failedRequests++;
            console.error(`User ${userId}:`, error.message);
        }
    }
}

async function runLoadTest() {
    console.log("========== LOAD TEST ==========");
    console.log(`Virtual Users: ${TOTAL_USERS}`);
    console.log(`Requests per User: ${REQUESTS_PER_USER}`);

    const startTime = performance.now();

    const users = [];

    for (let i = 1; i <= TOTAL_USERS; i++) {
        users.push(virtualUser(i));
    }

    await Promise.all(users);

    const totalTime = (performance.now() - startTime) / 1000;

    responseTimes.sort((a, b) => a - b);

    const totalRequests = TOTAL_USERS * REQUESTS_PER_USER;

    const average =
        responseTimes.length > 0
            ? responseTimes.reduce((a, b) => a + b, 0) /
              responseTimes.length
            : 0;

    const percentile95 =
        responseTimes.length > 0
            ? responseTimes[Math.ceil(responseTimes.length * 0.95) - 1]
            : 0;

    console.log("\n========== RESULTS ==========");
    console.log("Total Requests:", totalRequests);
    console.log("Successful:", successfulRequests);
    console.log("Failed:", failedRequests);
    console.log("Total Duration:", totalTime.toFixed(2), "seconds");
    console.log("Average Response Time:", average.toFixed(2), "ms");
    console.log("95th Percentile:", percentile95.toFixed(2), "ms");
    console.log(
        "Throughput:",
        (totalRequests / totalTime).toFixed(2),
        "requests/second"
    );
}

runLoadTest();
