'use strict';

const createQueue = require('./createQueue');

const findFreeWorker = async workers => {
    const worker = workers.find(worker => !worker.isBusy);

    if (worker) {
        return Promise.resolve(worker);
    }
};

const createRouter = workers => {
    const queue = createQueue();

    const enqueue = payload => {
        return new Promise(async resolve => { // TODO: error handling
            queue.add({ payload, resolve });

            while (queue.head) {
                const { payload, resolve } = queue.poll();
                const worker = await findFreeWorker(workers);

                lockWorker(worker);

                worker.run(payload).then(result => {
                    unlockWorker(worker);
                    resolve(result);
                });
            }
        });
    };

    return enqueue;
};

module.exports = createRouter;
