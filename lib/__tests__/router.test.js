'use strict';

const { expect } = require('chai');
const sinon = require('sinon');
const createQueue = require('../queue');
const createRouter = require('../router');

const delay = durationMs => new Promise(resolve => {
    setTimeout(resolve, durationMs);
});

// TODO: stub queue?
describe('the router', function () {
    const worker = {
        run: () => undefined,
    };

    const workerRepository = { // TODO: mock to assert release?
        getWorker: () => undefined,
        releaseWorker: () => undefined,
    };

    afterEach(function () {
        [worker.run, workerRepository.getWorker, workerRepository.releaseWorker].forEach(stub => {
            if (stub.restore) {
                stub.restore();
            }
        });
    });

    it('should take the oldest request, fulfil it, and forward the result to the requester', async function () {
        const expectedResult = 'foo result';
        const enqueue = createRouter(workerRepository);

        sinon.stub(worker, 'run')
            .returns(Promise.resolve(expectedResult));

        sinon.stub(workerRepository, 'getWorker')
            .returns(Promise.resolve(worker));

        const actualResult = await enqueue({ foo: 'bar' });
        expect(actualResult).to.equal(expectedResult);
    });

    it('should wait for more requests when the queue is empty', async function () {
        const expectedResult = 'foo result';
        const enqueue = createRouter(workerRepository);

        sinon.stub(worker, 'run')
            .returns(Promise.resolve(expectedResult));

        sinon.stub(workerRepository, 'getWorker')
            .returns(Promise.resolve(worker));

        await enqueue({ foo: 'bar' });
        await enqueue({ foo: 'bar' });
        await delay(1500);
        const actualResult = await enqueue({ foo: 'bar' });

        expect(actualResult).to.equal(expectedResult);
    });
});
