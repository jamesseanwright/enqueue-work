'use strict';

const http = require('http');
const path = require('path');
const { createQueue } = require('../../../lib');

const PORT = 8001;
const RENDERER_PATH = path.join(__dirname, 'renderer.js');
const WORKER_COUNT = 3;

const queue = createQueue(RENDERER_PATH, WORKER_COUNT);

const notFound = res => {
    res.writeHead(404, {
        'Content-Type': 'text/plain'
    });

    res.end('Not found');
};

const renderHtml = appMarkup => `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="utf-8" />
            <title>My React App</title>
        </head>
        <body>
            ${appMarkup}
        </body>
    </html>
`;

const server = http.createServer(async (req, res) => {
    if (req.url !== '/') {
        notFound(res);
        return;
    }

    const { appMarkup } = await queue.schedule();
    const markup = renderHtml(appMarkup);

    res.writeHead(200, {
        'Content-Type': 'text/html'
    });

    res.end(markup);
});

server.listen(PORT, () => console.log('Listening on', PORT));
