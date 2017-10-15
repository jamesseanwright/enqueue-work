'use strict';

const { expect } = require('chai');
const sinon = require('sinon');
const createQueue = require('../createQueue');
const createRouter = require('../createRouter');

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
});
