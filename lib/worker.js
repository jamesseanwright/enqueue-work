'use strict';

const getRequestId = () => process.hrtime().join('');

// TODO: remove error handler!
const createResultHandler = (worker, requestId, resolve) => {
    const handler = result => {
        if (result.requestId !== requestId) {
            return;
        }

        worker.process.removeListener('message', handler);
        resolve(result);
    };

    return handler;
};

const createErrorHandler = (worker, reject, resultHandler) => {
    const handler = error => {
        worker.process.removeListener('message', resultHandler);
        worker.process.removeListener('error', handler);
        reject(result);
    };

    return handler;
};

class Worker {
    constructor(prcss) {
        this.process = prcss;
    }

    kill() {
        this.process.kill();
    }

    run(payload) {
        return new Promise((resolve, reject) => {
            const requestId = getRequestId();
            const resultHandler = createResultHandler(this, requestId, resolve);

            this.process.on('message', resultHandler);
            this.process.on('error', createErrorHandler(this, reject, resultHandler));
            this.process.send({ ...payload, requestId });
        });
    }
}

const createWorker = process => new Worker(process);

module.exports = createWorker;
