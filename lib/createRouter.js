'use strict';

const createQueue = require('./createQueue');

const areAllWorkersFree = workers => workers.every(worker => !worker.isBusy);
const findFreeWorker = workers => workers.find(worker => !worker.isBusy);

const createRouter = workers => {
    const next = async queue => {
        const worker = findFreeWorker(workers);
        const request = queue.poll();

        if (!request) {
            return;
        }

        request.resolve(await worker.run(request.payload));
        next(queue);
    };

    const queue = createQueue();

    const enqueue = payload => {
        return new Promise(resolve => { // TODO: error handling
            queue.add({ payload, resolve });

            if (areAllWorkersFree(workers)) {
                next(queue);
            }
        });
    };

    return enqueue;
};

module.exports = createRouter;
