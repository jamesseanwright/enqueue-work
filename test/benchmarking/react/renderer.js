'use strict';

const React = require('react');
const ReactDOMServer = require('react-dom/server');
const App = require('./App');

const items = Array(250).fill('Item');

process.on('message', ({ requestId }) => {
    const appMarkup = ReactDOMServer.renderToString(React.createElement(App, { items }, null));
    process.send({ appMarkup, requestId });
});
