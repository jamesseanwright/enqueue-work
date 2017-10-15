'use strict';

const path = require('path');
const { createQueue } = require('../../lib');

const MIN_WORKER_COUNT = 1;
const MAX_WORKER_COUNT = 4;

const BENCHMARK_COUNT = MAX_WORKER_COUNT - (MIN_WORKER_COUNT - 1);
const BENCHMARK_ITERATION_COUNT = 4;
const SORTER_PATH = path.join(__dirname, '..', 'sorter', 'index.js');
const NUMBERS_PATH = path.join(__dirname, '..', 'sorter', 'numbers-large.json');

const getWorkerText = workerCount => `${workerCount} worker${workerCount > 1 ? 's' : ''}`;

const runBenchmark = async workerCount => {
    console.log(`Testing with ${getWorkerText(workerCount)}...`);

    const queue = createQueue(SORTER_PATH, workerCount);
    const time = process.hrtime();

    await runParallel(BENCHMARK_ITERATION_COUNT, async() => await queue.schedule({ filename: NUMBERS_PATH }));

    const [seconds, nanoseconds] = process.hrtime(time);

    queue.kill();

    return { workerCount, seconds, nanoseconds };
};

const runParallel = (length, predicate) => (
    Promise.all(Array(length).fill(null).map(async () => await predicate()))
);

const runSequentially = async (length, predicate) => {
    const results = Array(length);

    for (let i = 0; i < length; i++) {
        results[i] = await predicate(i + 1); // one-based due to its consumption
    }

    return results;
};

const printResults = results => {
    console.log('\n\nResults');

    console.log(results.map(
        res => `${getWorkerText(res.workerCount)}: ${res.seconds}.${res.nanoseconds} secs`
    ).join('\n'));
};

(async () => {
    console.log('Capturing benchmarks...');
    const results = await runSequentially(BENCHMARK_COUNT, runBenchmark);
    printResults(results);
})();
