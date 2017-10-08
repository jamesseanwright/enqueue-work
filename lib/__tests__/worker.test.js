'use strict';

const { expect } = require('chai');
const sinon = require('sinon');
const Worker = require('../worker');

describe('Worker', function () {
    let worker;
    let mockProcess;

    beforeEach(function () {
        const process = {
            stdout: {
                pipe: () => undefined,
            },

            on: () => undefined,
            send: () => undefined,
            removeListener: () => undefined,
            kill: () => undefined,
        };

        mockProcess = sinon.mock(process);
        worker = new Worker(process);
    });

    afterEach(function () {
        mockProcess.restore();
    });

    describe('the kill method', function () {
        it('should kill the underlying child process', function () {
            mockProcess.expects('kill')
                .once();

            worker.kill();
            mockProcess.verify();
        });
    });

    describe('the run method', function () {
        it('should send the payload to the child process and proxy the result', async function () {
            const requestId = 1;
            const payload = { foo: 'bar' };
            const expectedResult = { bar: 'baz', requestId };

            mockProcess.expects('on')
                .withArgs('message', sinon.match.func)
                .once()
                .callsArgWith(1, expectedResult);

            mockProcess.expects('on')
                .withArgs('error', sinon.match.func)
                .once();

            mockProcess.expects('send')
                .once()
                .withArgs({ ...payload, requestId });

            const actualResult = await worker.run(payload);

            expect(actualResult).to.deep.equal(expectedResult);
            mockProcess.verify();
        });

        it.skip('should remove event listeners once a result is received', async function () {
            const requestId = 1;
            const payload = { foo: 'bar' };
            const expectedResult = { bar: 'baz', requestId };

            mockProcess.expects('on')
                .withArgs('message', sinon.match.func)
                .once()
                .callsArgWith(1, expectedResult);

            mockProcess.expects('on')
                .withArgs('error', sinon.match.func)
                .once();

            mockProcess.expects('send')
                .once()
                .withArgs({ ...payload, requestId });

            const actualResult = await worker.run(payload);

            expect(actualResult).to.deep.equal(expectedResult);
            mockProcess.verify();
        });

        it.skip('should reject when the child process throws an error', async function () {
            const requestId = 1;
            const payload = { foo: 'bar' };
            const expectedResult = { bar: 'baz', requestId };

            mockProcess.expects('on')
                .withArgs('message', sinon.match.func)
                .once()
                .callsArgWith(1, expectedResult);

            mockProcess.expects('on')
                .withArgs('error', sinon.match.func)
                .once();

            mockProcess.expects('send')
                .once()
                .withArgs({ ...payload, requestId });

            const actualResult = await worker.run(payload);

            expect(actualResult).to.deep.equal(expectedResult);
            mockProcess.verify();
        });
    });
});
