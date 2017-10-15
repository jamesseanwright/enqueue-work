'use strict';

const { fork } = require('child_process');
const Worker = require('./worker');
const createRouter = require('./createRouter');

const createWorker = scriptPath => new Worker(fork(scriptPath, {
    stdio: [0, 'pipe', 'ipc'],
}));

const createScheduler = enqueue => async payload => await enqueue(payload);

const createKiller = workers => () => {
    workers.forEach(worker => worker.kill());
};

const createQueue = (scriptPath, workerCount) => {
    const workers = Array(workerCount).fill(scriptPath).map(createWorker);
    const enqueue = createRouter(workers);

    return {
        schedule: createScheduler(enqueue),
        kill: createKiller(workers),
    };
};

module.exports = {
    createQueue,
};
