import React from 'react';
import PracticeIntro from '../common/practice-intro.jsx';
import SightReadingPractice from './sight-reading-practice.jsx';

/**
 * Intro screen for the Sight Reading practice mode
 *
 * Intended to show user-configurable settings for the practice session
 * before starting, along with a button to begin.
 */
export default class SightReadingPracticeIntro extends React.Component {
  render() {
    return <PracticeIntro title="Sight Reading" component={SightReadingPractice} prefsNamespace="sightReading" prefDefs={SightReadingPractice.prefsDefinitions} />;
  }
}
