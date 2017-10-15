'use strict';

const createQueue = require('./queue');

const createRouter = workerRepository => {
    const queue = createQueue();

    const onResult = (worker, result, resolve) => {
        workerRepository.releaseWorker(worker);
        resolve(result);
    };

    const enqueue = payload => {
        return new Promise(async (resolve, reject) => {
            queue.add({ payload, resolve });

            while (queue.head) {
                const { payload, resolve } = queue.poll();
                const worker = await workerRepository.getWorker();

                worker.run(payload)
                    .then(result => onResult(worker, result, resolve))
                    .catch(reject);
            }
        });
    };

    return enqueue;
};

module.exports = createRouter;
