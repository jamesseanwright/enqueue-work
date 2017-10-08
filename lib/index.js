'use strict';

const Worker = require('./worker');

const createScheduler = workers => async payload => {
    const [worker] = workers; // TODO: least busy queue algorithm
    return await worker.run(payload);
};


const createKiller = workers => () => {
    workers.forEach(worker => worker.kill());
};

const createQueue = (scriptPath, workerCount) => {
    const workers = Array(workerCount).fill(scriptPath).map(path => new Worker(path));

    return {
        schedule: createScheduler(workers),
        kill: createKiller(workers),
    };
};

module.exports = {
    createQueue,
};
