'use strict';

const { expect } = require('chai');
const findQuietestWorker = require('../findQuietestWorker');

describe('findQuietestWorker', function () {
    it('should return the worker with the shortest queue', function () {
        const workers = [
            { length: 5 },
            { length: 2 },
            { length: 3 },
            { length: 4 },
        ];

        const result = findQuietestWorker(workers);

        expect(result).to.equal(workers[1]);
    });
});
