'use strict';

const createQueue = require('./createQueue');

const createWorkersMap = workers => new Map([
    ...workers.map(worker => [worker, false])
]);

class WorkerRepository {
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
    };

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

const createWorkerRepository = workers => new WorkerRepository(workers);

module.exports = createWorkerRepository;
