'use strict';

const { fork } = require('child_process');

const createScheduler = workers => async payload => {
    const [worker] = workers; // TODO: least busy queue algorithm
    return await worker.run(payload);
};

const createResultHandler = (childProcess, resolve, requestId) => {
    const handler = result => {
        if (result.requestId !== requestId) {
            return;
        }

        childProcess.removeListener('message', handler);
        resolve(result);
    };

    return handler;
};

const createErrorHandler = (childProcess, reject, resultHandler) => {
    const handler = error => {
        childProcess.res('message', resultHandler);
        childProcess.removeListener('error', handler);
        reject(result);
    };

    return handler;
};

const createWorker = scriptPath => {
    const childProcess = fork(scriptPath, {
        stdio: [0, 'pipe', 'ipc'],
    });

    let queueLength = 0; // TODO: linked list
    childProcess.stdout.pipe(process.stdout);

    return {
        get queueLength() {
            return queueLength;
        },

        kill() {
            childProcess.kill();
        },

        run(payload) {
            return new Promise((resolve, reject) => {
                const requestId = queueLength++;
                const resultHandler = createResultHandler(childProcess, resolve, requestId);

                childProcess.on('message', resultHandler);
                childProcess.on('error', createErrorHandler(childProcess, reject, resultHandler));
                childProcess.send({ ...payload, requestId }) // TODO: Handle instance?
            });
        },
    };
};

const createKiller = workers => () => {
    workers.forEach(worker => worker.kill());
};

const createQueue = (scriptPath, workerCount) => {
    const workers = Array(workerCount).fill(scriptPath).map(createWorker);

    return {
        schedule: createScheduler(workers),
        kill: createKiller(workers),
    };
};

module.exports = {
    createQueue,
};
