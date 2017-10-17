'use strict';

const { fork } = require('child_process');
const createWorker = require('./worker');
const createRouter = require('./router');
const createWorkerPool = require('./workerPool');

const createWorkerWithProcess = scriptPath => createWorker(fork(scriptPath, {
    stdio: [0, 'pipe', 'ipc'],
}));

const createScheduler = enqueue => async payload => await enqueue(payload);

const createKiller = workers => () => {
    workers.forEach(worker => worker.kill());
};

const createQueue = (scriptPath, workerCount) => {
    const workers = Array(workerCount).fill(scriptPath).map(createWorkerWithProcess);
    const enqueue = createRouter(createWorkerPool(workers));

    return {
        schedule: createScheduler(enqueue),
        kill: createKiller(workers),
    };
};

module.exports = {
    createQueue,
};
