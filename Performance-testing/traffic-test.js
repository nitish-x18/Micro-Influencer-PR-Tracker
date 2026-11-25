
const BASE_URL = "http://localhost:8000/api/v1/health/";

async function sendRequests(totalRequests, concurrency, testName) {
    const responseTimes = [];
    let successful = 0;
    let failed = 0;
    let completed = 0;

    console.log(`\n========== ${testName} ==========`);

    const startTime = performance.now();

    async function worker() {
        while (completed < totalRequests) {
            completed++;

            const requestStart = performance.now();

            try {
                const response = await fetch(BASE_URL);
                const requestEnd = performance.now();

                responseTimes.push(requestEnd - requestStart);

                if (response.ok) successful++;
                else failed++;
            } catch (error) {
                failed++;
            }
        }
    }

    const workers = [];

    for (let i = 0; i < concurrency; i++) {
        workers.push(worker());
    }

    await Promise.all(workers);

    const duration = (performance.now() - startTime) / 1000;

    responseTimes.sort((a, b) => a - b);

    const average = responseTimes.length
        ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
        : 0;

    const p95 = responseTimes.length
        ? responseTimes[Math.ceil(responseTimes.length * 0.95) - 1]
        : 0;

    console.log("Total Requests:", totalRequests);
    console.log("Successful:", successful);
    console.log("Failed:", failed);
    console.log("Duration:", duration.toFixed(2), "seconds");
    console.log("Average Response Time:", average.toFixed(2), "ms");
    console.log("95th Percentile:", p95.toFixed(2), "ms");
    console.log("Throughput:", (totalRequests / duration).toFixed(2), "requests/second");
}

async function runTrafficTests() {
    await sendRequests(100, 5, "NORMAL TRAFFIC");
    await sendRequests(500, 25, "PEAK TRAFFIC");
    await sendRequests(1000, 100, "BURST TRAFFIC");
}

runTrafficTests();
