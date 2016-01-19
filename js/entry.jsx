import React from 'react';
import { render } from 'react-dom'
import injectTapEventPlugin from 'react-tap-event-plugin';
import Application from './app.jsx';

// Needed by Material UI
injectTapEventPlugin();

// Render top-level component to page
render(
  <Application />,
  document.getElementById('container')
);
