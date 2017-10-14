'use strict';

const { expect } = require('chai');
const createQueue = require('../createQueue');

describe('the queue', function () {
    let queue;

    beforeEach(function () {
        queue = createQueue();
    });

    describe('the add method', function () {
        it('should maintain the head of the queue', function () {
            queue.add('item 1');
            queue.add('item 2');

            expect(queue.head).to.equal('item 1');
        });
    });
});
