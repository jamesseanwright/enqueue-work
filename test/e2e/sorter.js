'use strict';

const fs = require('fs');

const onError = err => {
    console.err(err);
    process.exit(1);
};

const onFileRead = buffer => {
    const numbers = JSON.parse(buffer);
    const result = sort(numbers);
    process.send({ result });
};

const sort = numbers => [].concat(numbers).sort();

process.on('message', ({ path }) => {
    fs.readFile(path, (err, buffer) => err ? onError(err) : onFileRead(buffer));
});
