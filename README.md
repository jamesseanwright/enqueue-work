# Enqueue Work

A Node.js child process worker library for my London Node Meetup talk.

**This is a proof of concept!** Do not use this library in production.

## Example Usage

```js
'use strict';

const { createQueue } = require('enqueue-work');

const WORKER_SCRIPT = 'sorter.js';
const WORKER_COUNT = 4;

const queue = createQueue(WORKER_SCRIPT, WORKER_COUNT);
const { result } = await queue.schedule({ filename: 'numbers-large.json' });
```

## Benchmarks

Graphs coming soon, otherwise:

* `git clone https://github.com/jamesseanwright/enqueue-work.git`
* `cd enqueue-work`
* `nvm install`/`nvm use`
* `npm i`
* `npm run benchmark`
