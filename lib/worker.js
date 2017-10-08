'use strict';

// TODO: remove error handler!
const createResultHandler = (worker, resolve) => {
    const handler = result => {
        if (result.requestId !== worker.queueLength) {
            return;
        }

        worker.process.removeListener('message', handler);
        worker.queueLength--;
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
    constructor(process) {
        this.process = process;
        this.queueLength = 0;
        this.process.stdout.pipe(process.stdout); // TODO: configure?
    }

    kill() {
        this.process.kill();
    }

    run(payload) {
        return new Promise((resolve, reject) => {
            const requestId = ++this.queueLength;
            const resultHandler = createResultHandler(this, resolve);

            this.process.on('message', resultHandler);
            this.process.on('error', createErrorHandler(this, reject, resultHandler));
            this.process.send({ ...payload, requestId }) // TODO: Handle instance?
        });
    }
}

module.exports = Worker;
