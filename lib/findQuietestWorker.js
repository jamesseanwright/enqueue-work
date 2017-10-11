'use strict';

const findQuietestWorker = workers => [].concat(workers).sort((a, b) => a.length - b.length)[0];

module.exports = findQuietestWorker;
