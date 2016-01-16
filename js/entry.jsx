var React = require('react');
var ReactDOM = require('react-dom');
var injectTapEventPlugin = require('react-tap-event-plugin');
var Application = require('./app.jsx');

// Needed by Material UI
injectTapEventPlugin();

// Render top-level component to page
ReactDOM.render(
  <Application />,
  document.getElementById('container')
);
