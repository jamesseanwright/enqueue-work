'use strict';

const createRouter = require('../router');

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

    it('should take the oldest request, fulfill it, and forward the result to the requester', function (done) {
        const queue = [
            { requestId: 1, payload: 'bar' },
        ];

        const router = createRouter(queue, [worker]);

        router.on('result', (requestId, result) => {
            expect(requestId).to.equal(1);
            expect(result).to.equal('something'); // TODO

            done();
        });
    });
});
