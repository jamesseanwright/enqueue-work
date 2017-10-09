'use strict';

const path = require('path');
const { createQueue } = require('../../lib');

const MIN_WORKER_COUNT = 1;
const MAX_WORKER_COUNT = 8;
const BENCHMARK_COUNT = MAX_WORKER_COUNT - (MIN_WORKER_COUNT - 1);
const SORTER_PATH = path.join(__dirname, '..', 'sorter', 'index.js');
const NUMBERS_PATH = path.join(__dirname, '..', 'sorter', 'numbers-large.json');

const runBenchmark = async workerCount => { // TODO: rerun a few times and take average
    const queue = createQueue(SORTER_PATH, workerCount + 1);
    const time = process.hrtime();
    await queue.schedule({ filename: NUMBERS_PATH });
    const [resultSeconds] = process.hrtime(time);

    queue.kill();

    return { workerCount, resultSeconds };
};

const runPromisesSequentially = promises => (
    promises.reduce((prev, cur) => prev.then(() => cur), Promise.resolve())
);

const forRangeAsync = async (length, predicate) => (
    await runPromisesSequentially(Array(length).fill(null).map((_, i) => predicate(i)))
);

const printResults = results => console.log('***** done', results);

(async () => {
    console.log('Capturing benchmarks...');
    const results = await forRangeAsync(BENCHMARK_COUNT, runBenchmark);
    printResults(results);
})();
