'use strict';

const { expect } = require('chai');
const createWorkerRepository = require('../workerRepository');

describe('the worker repository', function () {
    const workers = [{}, {}, {}];
    let repository;

    beforeEach(function () {
        repository = createWorkerRepository(workers);
    });

    it('should return the first available worker', async function () {
        const worker = await repository.getWorker();
        expect(worker).to.equal(workers[0]);
    });

    it('should wait for the next free worker to become available if all are busy', async function () {
        await repository.getWorker();
        await repository.getWorker();
        await repository.getWorker();

        repository.releaseWorker(workers[1]);

        const worker = await repository.getWorker();

        expect(worker).to.equal(workers[1]);
    });
});
