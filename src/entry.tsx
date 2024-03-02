import React from 'react';
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, hashHistory } from 'react-router'
import injectTapEventPlugin from 'react-tap-event-plugin';
import Application from './application';
import Home from './home';
import About from './about';
import SightReadingPracticeIntro from './modes/sight-reading-practice-intro';
import PerfectPitchPracticeIntro from './modes/perfect-pitch-practice-intro';
import FreePlayIntro from './modes/free-play-intro';

// Needed by Material UI
console.log("Injecting tap");
injectTapEventPlugin();

// Render top-level component to page
render(
  <Router history={hashHistory}>
    <Route path="/" component={Application}>
      <IndexRoute component={Home} />
      <Route path="about" component={About}/>
      <Route path="sightReading" component={SightReadingPracticeIntro}/>
      <Route path="perfectPitch" component={PerfectPitchPracticeIntro}/>
      <Route path="freePlay" component={FreePlayIntro}/>
      <Route path="*" component={Home}/>
    </Route>
  </Router>,
  document.getElementById('container')
);
