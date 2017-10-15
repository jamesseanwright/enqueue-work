'use strict';

const { expect } = require('chai');
const sinon = require('sinon');
const createQueue = require('../createQueue');
const createRouter = require('../createRouter');

const delay = durationMs => new Promise(resolve => {
    setTimeout(resolve, durationMs);
});

// TODO: stub queue?
describe('the router', function () {
    const worker = {
        isBusy: false,
        run: () => undefined,
    };

    afterEach(function () {
        if (worker.run.restore) {
            worker.run.restore();
        }
    });

    it('should take the oldest request, fulfil it, and forward the result to the requester', async function () {
        const expectedResult = 'foo result';
        const enqueue = createRouter([worker]);

        sinon.stub(worker, 'run')
            .returns(Promise.resolve(expectedResult));

        const actualResult = await enqueue({ foo: 'bar' });
        expect(actualResult).to.equal(expectedResult);
    });

    it('should wait for more requests when the queue is empty', async function () {
        const expectedResult = 'foo result';
        const enqueue = createRouter([worker]);

        sinon.stub(worker, 'run')
            .returns(Promise.resolve(expectedResult));

        await enqueue({ foo: 'bar' });
        await enqueue({ foo: 'bar' });
        await delay(1500);
        const actualResult = await enqueue({ foo: 'bar' });

        expect(actualResult).to.equal(expectedResult);
    });
});
