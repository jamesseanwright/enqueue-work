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
        worker.isBusy = false;
    };

    return handler;
};

const createErrorHandler = (worker, reject, resultHandler) => {
    const handler = error => {
        worker.process.removeListener('message', resultHandler);
        worker.process.removeListener('error', handler);
        reject(result);
        worker.isBusy = false;
    };

    return handler;
};

class Worker {
    constructor(prcss) {
        this.process = prcss;
        this.isBusy = false;
        this.process.stdout.pipe(process.stdout); // TODO: configure?
    }

    kill() {
        this.process.kill();
    }

    run(payload) {
        return new Promise((resolve, reject) => {
            this.isBusy = true;

            const requestId = getRequestId();
            const resultHandler = createResultHandler(this, requestId, resolve);

            this.process.on('message', resultHandler);
            this.process.on('error', createErrorHandler(this, reject, resultHandler));
            this.process.send({ ...payload, requestId });
        });
    }
}

module.exports = Worker; // TODO: factory func
