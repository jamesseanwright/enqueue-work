'use strict';

const { fork } = require('child_process');
const Worker = require('./worker');
const findQuietestWorker = require('./findQuietestWorker');

const createWorker = scriptPath => new Worker(fork(scriptPath, {
    stdio: [0, 'pipe', 'ipc'],
}));

const createScheduler = workers => async payload => {
    const worker = findQuietestWorker(workers);
    return await worker.enqueue(payload);
};

const createKiller = workers => () => {
    workers.forEach(worker => worker.kill());
};

const createQueue = (scriptPath, workerCount) => {
    const workers = Array(workerCount).fill(scriptPath).map(createWorker);

    return {
        schedule: createScheduler(workers),
        kill: createKiller(workers),
    };
};

module.exports = {
    createQueue,
};
