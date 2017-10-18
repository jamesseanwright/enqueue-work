'use strict';

const createQueue = require('./queue');

const createWorkersMap = workers => new Map(
    workers.map(worker => [worker, false]),
);

class WorkerPool {
    constructor(workers) {
        this.workers = createWorkersMap(workers);
        this.workerRequests = createQueue();
    }

    getFreeWorker() {
        for (let [worker, isBusy] of this.workers) {
            if (!isBusy) {
                this.workers.set(worker, true);
                return worker;
            }
        }

        return null;
    }

    getWorker() {
        return new Promise(resolve => {
            const worker = this.getFreeWorker();

            if (worker) {
                resolve(worker);
                return;
            }

            this.workerRequests.add(resolve);
        });
    }

    releaseWorker(worker) {
        if (this.workerRequests.head) {
            this.workerRequests.poll()(worker);
        } else {
            this.workers.set(worker, false);
        }
    }
}

const createWorkerPool = workers => new WorkerPool(workers);

module.exports = createWorkerPool;
