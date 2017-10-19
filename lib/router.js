'use strict';

const createQueue = require('./queue');

const createRouter = workerPool => {
    const queue = createQueue();

    const onResult = (worker, result, resolve) => {
        workerPool.releaseWorker(worker);
        resolve(result);
    };

    const enqueue = payload => {
        return new Promise(async (resolve, reject) => {
            queue.add({ payload, resolve });

            while (queue.head) {
                const { payload, resolve } = queue.poll();
                const worker = await workerPool.getWorker();

                worker.run(payload)
                    .then(result => onResult(worker, result, resolve))
                    .catch(reject); // TODO: poll the rejection handler from the queue! This is the wrong reject!
            }
        });
    };

    return enqueue;
};

module.exports = createRouter;
