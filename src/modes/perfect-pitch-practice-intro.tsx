import React from 'react';
import PracticeIntro from '../common/practice-intro';
import PerfectPitchPractice from './perfect-pitch-practice';

/**
 * Intro screen for the Perfect Pitch practice mode
 *
 * Intended to show user-configurable settings for the practice session
 * before starting, along with a button to begin.
 */
export default class PerfectPitchPracticeIntro extends React.Component {
  render() {
    return <PracticeIntro title="Perfect Pitch" component={PerfectPitchPractice} prefsNamespace="perfectPitch" prefDefs={PerfectPitchPractice.prefsDefinitions} />;
  }
}
