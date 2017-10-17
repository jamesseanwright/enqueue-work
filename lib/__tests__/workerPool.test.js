'use strict';

const { expect } = require('chai');
const createWorkerPool = require('../workerPool');

describe('the worker pool', function () {
    const workers = [{}, {}, {}];
    let pool;

    beforeEach(function () {
        pool = createWorkerPool(workers);
    });

    it('should return the first available worker', async function () {
        const worker = await pool.getWorker();
        expect(worker).to.equal(workers[0]);
    });

    it('should wait for the next free worker to become available if all are busy', async function () {
        await pool.getWorker();
        await pool.getWorker();
        await pool.getWorker();

        pool.releaseWorker(workers[1]);

        const worker = await pool.getWorker();

        expect(worker).to.equal(workers[1]);
    });
});
