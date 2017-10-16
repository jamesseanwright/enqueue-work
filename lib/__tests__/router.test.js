'use strict';

const { expect } = require('chai');
const sinon = require('sinon');
const createRouter = require('../router');

const delay = durationMs => new Promise(resolve => {
    setTimeout(resolve, durationMs);
});

// TODO: stub queue?
describe('the router', function () {
    const worker = {
        run: () => undefined,
    };

    const workerRepository = {
        getWorker: () => undefined,
        releaseWorker: () => undefined,
    };

    let mockWorkerRepository;

    beforeEach(function () {
        mockWorkerRepository = sinon.mock(workerRepository);
    });

    afterEach(function () {
        if (worker.run.restore) {
            worker.run.restore();
        }

        mockWorkerRepository.restore();
    });

    it('should take the oldest request, fulfil it, and forward the result to the requester', async function () {
        const expectedResult = 'foo result';
        const enqueue = createRouter(workerRepository);

        sinon.stub(worker, 'run')
            .returns(Promise.resolve(expectedResult));

        mockWorkerRepository.expects('getWorker')
            .returns(Promise.resolve(worker));

        const actualResult = await enqueue({ foo: 'bar' });
        expect(actualResult).to.equal(expectedResult);
    });

    it('should wait for more requests when the queue is empty', async function () {
        const expectedResult = 'foo result';
        const enqueue = createRouter(workerRepository);

        sinon.stub(worker, 'run')
            .returns(Promise.resolve(expectedResult));

        mockWorkerRepository.expects('getWorker')
            .thrice()
            .returns(Promise.resolve(worker));

        await enqueue({ foo: 'bar' });
        await enqueue({ foo: 'bar' });
        await delay(1500);
        const actualResult = await enqueue({ foo: 'bar' });

        expect(actualResult).to.equal(expectedResult);
    });

    it('should release a worker once a result has been returned', async function () {
        const expectedResult = 'foo result';
        const enqueue = createRouter(workerRepository);

        sinon.stub(worker, 'run')
            .returns(Promise.resolve(expectedResult));

        mockWorkerRepository.expects('getWorker')
            .returns(Promise.resolve(worker));

        mockWorkerRepository.expects('releaseWorker')
            .once()
            .withArgs(worker);

        const actualResult = await enqueue({ foo: 'bar' });

        expect(actualResult).to.equal(expectedResult);
        mockWorkerRepository.verify();
    });
});
