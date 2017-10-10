'use strict';

const path = require('path');
const { createQueue } = require('../../lib');

const MIN_WORKER_COUNT = 1;
const MAX_WORKER_COUNT = 8;
const BENCHMARK_COUNT = MAX_WORKER_COUNT - (MIN_WORKER_COUNT - 1);
const SORTER_PATH = path.join(__dirname, '..', 'sorter', 'index.js');
const NUMBERS_PATH = path.join(__dirname, '..', 'sorter', 'numbers-large.json');

const getWorkerText = workerCount => `${workerCount} worker${workerCount > 1 ? 's' : ''}`;

const runBenchmark = async workerCount => { // TODO: rerun a few times and take average
    console.log(`Testing with ${getWorkerText(workerCount)}...`);
    const queue = createQueue(SORTER_PATH, workerCount);
    const time = process.hrtime();
    await queue.schedule({ filename: NUMBERS_PATH });
    const [seconds, nanoseconds] = process.hrtime(time);

    queue.kill();

    return { workerCount, seconds, nanoseconds };
};

const sequentialRangeAsync = async (length, predicate) => {
    const results = Array(length);

    for (let i = 0; i < length; i++) {
        results[i] = await predicate(i + 1); // one-based due to its consumption
    }

    return results;
};

const printResults = results => (
    console.log(
        '\n\nResults\n',
        results.map(
            res => `${getWorkerText(res.workerCount)}: ${res.seconds}.${res.nanoseconds} secs`
        ).join('\n')
    )
);

(async () => {
    console.log('Capturing benchmarks...');
    const results = await sequentialRangeAsync(BENCHMARK_COUNT, runBenchmark);
    printResults(results);
})();
