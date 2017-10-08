'use strict';

const { fork } = require('child_process');

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
        worker.process.res('message', resultHandler);
        worker.process.removeListener('error', handler);
        reject(result);
    };

    return handler;
};

class Worker {
    constructor(scriptPath) {
        this.scriptPath = scriptPath;

        this.process = fork(scriptPath, {
            stdio: [0, 'pipe', 'ipc'],
        }); // TODO: encapsulate?

        this.queueLength = 0;
        this.process.stdout.pipe(process.stdout);
    }

    kill() {
        this.process.kill();
    }

    run(payload) {
        return new Promise((resolve, reject) => {
            this.queueLength++;
            const resultHandler = createResultHandler(this, resolve);

            this.process.on('message', resultHandler);
            this.process.on('error', createErrorHandler(this, reject, resultHandler));
            this.process.send({ ...payload, requestId: this.queueLength }) // TODO: Handle instance?
        });
    }
}

module.exports = Worker;
