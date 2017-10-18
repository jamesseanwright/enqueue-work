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

### `Array.prototype.sort` (merge sort in V8 when n > 10)

![Array.prototype.sort()](https://i.imgur.com/wwEEQHu.png)


### React Server-Side Rendering (SSR)

Please note that React 16 provides Node.js stream rendering, which will substantially reduce the time to first byte (TTFB) of your markup!

![React SSR](https://i.imgur.com/Sy9xEM3.png)

## Running locally

* `git clone https://github.com/jamesseanwright/enqueue-work.git`
* `cd enqueue-work`
* `nvm install`/`nvm use`
* `npm i`
* `npm run benchmark`
