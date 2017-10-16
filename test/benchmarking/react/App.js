'use strict';

const React = require('react');

const App = ({ items }) => (
    React.createElement('ul', null, items.map(
        (item, key) => React.createElement('li', { key }, item)
    ))
);

module.exports = App;
