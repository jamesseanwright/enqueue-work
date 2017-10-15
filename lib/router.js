'use strict';

const createQueue = require('./queue');

const createRouter = workerRepository => {
    const queue = createQueue();

    const enqueue = payload => {
        return new Promise(async (resolve, reject) => {
            queue.add({ payload, resolve });

            while (queue.head) {
                const { payload, resolve } = queue.poll();
                const worker = await workerRepository.getWorker();

                worker.run(payload).then(result => {
                    workerRepository.releaseWorker(worker);
                    resolve(result);
                });
            }
        });
    };

    return enqueue;
};

module.exports = createRouter;
