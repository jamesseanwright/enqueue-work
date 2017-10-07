'use strict';

const fs = require('fs');
const path = require('path');
const { expect } = require('chai');
const { createQueue } = require('../../lib');

describe('the end-to-end tests', function () {
    const filename = path.join(__dirname, 'numbers.json');
    const numbers = JSON.parse(fs.readFileSync(filename));
    const sortedNumbers = [].concat(numbers).sort();
    let queue;

    beforeEach(function () {
        queue = createQueue(path.join(__dirname, 'sorter.js'), 4);
    });

    afterEach(function () {
        queue.kill();
    });

    it('should delegate an operation to a child process and return the result to the parent', async function () {
        const { result } = await queue.schedule({ filename });

        expect(result).to.deep.equal(sortedNumbers);
    });
});
