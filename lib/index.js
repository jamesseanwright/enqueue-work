'use strict';

const createQueue = () => ({
    schedule: () => Promise.resolve({}),
});

module.exports = {
    createQueue,
};
