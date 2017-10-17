'use strict';

const React = require('react');

const App = ({ items }) => (
    React.createElement('ul', null, items.map(
        (item, key) => React.createElement(
            'li',
            { key },
            React.createElement(
                'div',
                null,
                React.createElement(
                    'h2',
                    null,
                    `Item ${key}`,
                ),

                React.createElement(
                    'p',
                    null,
                    'Hi!',
                ),
            ),
        )
    ))
);

module.exports = App;
