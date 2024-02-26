import React from 'react';
import PracticeIntro from '../common/practice-intro';
import FreePlay from './free-play.jsx';

/**
 * Intro screen for the Free Play mode
 *
 * Intended to show user-configurable settings for the session
 * before starting, along with a button to begin.
 */
export default class FreePlayIntro extends React.Component {
  render() {
    return <PracticeIntro title="Free Play" component={FreePlay} prefsNamespace="freePlay" prefDefs={FreePlay.prefsDefinitions} />;
  }
}
