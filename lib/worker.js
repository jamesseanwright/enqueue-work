'use strict';

// TODO: remove error handler!
const createResultHandler = (worker, resolve) => {
    const handler = result => {
        if (result.requestId !== worker.length) {
            return;
        }

        worker.process.removeListener('message', handler);
        worker.length--;
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
        this.length = 0;
        this.process.stdout.pipe(process.stdout); // TODO: configure?
    }

    kill() {
        this.process.kill();
    }

    run(payload) {
        return new Promise((resolve, reject) => {
            const requestId = ++this.length;
            const resultHandler = createResultHandler(this, resolve);

            this.process.on('message', resultHandler);
            this.process.on('error', createErrorHandler(this, reject, resultHandler));
            this.process.send({ ...payload, requestId });
        });
    }
}

module.exports = Worker;
