'use strict';

const getRequestId = () => process.hrtime().join('');

class Worker {
    constructor(prcss) {
        this.process = prcss;
    }

    // TODO: HOC for managing subscriptions?
    listen(requestId, resolve, reject) {
        const resultHandler = result => {
            if (result.requestId !== requestId) {
                return;
            }

            this.process.removeListener('message', resultHandler);
            this.process.removeListener('error', errorHandler);

            resolve(result);
        };

        // TODO: request ID for errors?
        const errorHandler = e => {
            this.process.removeListener('message', resultHandler);
            this.process.removeListener('error', errorHandler);

            reject(e);
        };

        this.process.on('message', resultHandler);
        this.process.on('error', errorHandler);
    }

    kill() {
        this.process.kill();
    }

    run(payload) {
        return new Promise((resolve, reject) => {
            const requestId = getRequestId();
            this.listen(requestId, resolve, reject);
            this.process.send({ ...payload, requestId });
        });
    }
}

const createWorker = process => new Worker(process);

module.exports = createWorker;
