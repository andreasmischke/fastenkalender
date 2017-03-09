document.addEventListener('DOMContentLoaded', function() {
    const React = require('react'),
          ReactDOM = require('react-dom'),
          Calendar = require('calendar');

    ReactDOM.render(
        <Calendar />,
        document.getElementById('app')
    );

    window._ = require('lodash');
});
