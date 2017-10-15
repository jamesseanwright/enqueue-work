'use strict';

const fs = require('fs');

const onError = err => {
    console.err(err);
    process.exit(1);
};

const onFileRead = (buffer, requestId) => {
    const numbers = JSON.parse(buffer);
    const result = sort(numbers);
    console.log('******* sorted!');
    process.send({ result, requestId });
};

const sort = numbers => [].concat(numbers).sort();

process.on('message', ({ filename, requestId }) => {
    fs.readFile(filename, (err, buffer) => err ? onError(err) : onFileRead(buffer, requestId));
});
