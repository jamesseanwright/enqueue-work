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

    describe('the poll method', function () {
        it('should return the current head and set the previous node as the new head', function () {
            queue.add('item 1');
            queue.add('item 2');
            queue.add('item 3');
            queue.add('item 4');

            const item = queue.poll();

            expect(item).to.equal('item 1');
            expect(queue.head).to.equal('item 2');
            expect(queue.tail).to.equal('item 4');
        });
    });
});
