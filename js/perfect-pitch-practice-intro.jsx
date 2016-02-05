import React from 'react';
import FlatButton from 'material-ui/lib/flat-button';
import IconButton from 'material-ui/lib/icon-button';
import NavigationBackIcon from 'material-ui/lib/svg-icons/navigation/arrow-back';
import List from 'material-ui/lib/lists/list';
import Divider from 'material-ui/lib/divider';
import PerfectPitchPractice from './perfect-pitch-practice.jsx';
import Card from './common/card.jsx';
import PrefsToggle from './common/prefs-toggle.jsx';
import PrefsCheckbox from './common/prefs-checkbox.jsx';

/**
 * Intro screen for the Perfect Pitch practice mode
 *
 * Intended to show user-configurable settings for the practice session
 * before starting, along with a button to begin.
 */
class PerfectPitchPracticeIntro extends React.Component {
  constructor(props) {
    super(props);

    // If localStorage doesn't have prefs yet, pre-populate with defaults
    let prefs = localStorage["prefs.perfectPitch"];
    if (prefs === undefined) {
        prefs = JSON.stringify({
            accidentals: true,
            keyboardLabels: true,
            autoAdvance: true,
        });
    }

    // Initial state (TODO: Load the preferences from persistent storage somehow)
    this.state = {
      started: false,
      prefs: JSON.parse(prefs),
    };

    // Prebind custom methods
    this.componentWillMount = this.componentWillMount.bind(this);
    this.start = this.start.bind(this);
    this.end = this.end.bind(this);
    this.onToggle = this.onToggle.bind(this);
  }

  /**
   * Save the prefs currently in the state into localStorage
   */
  persistPrefs() {
    localStorage["prefs.perfectPitch"] = JSON.stringify(this.state.prefs);
  }

  /**
   * Overridden setState which persists prefs changes to localStorage
   */
  setState(changes) {
    super.setState(changes);
    if ('prefs' in changes) {
      this.persistPrefs();
    }
  }

  componentWillMount() {
    this.end();
  }

  /**
   * Begin the practice session
   * TODO: Possibly do this using routing in the future
   * TODO: If we use routing, maybe pass the options as query params in the URL (would allow deep-linking to specific modes)
   */
  start() {
    this.setState({started: true});
    this.context.appbar(
      "Perfect Pitch",
      <IconButton onTouchTap={this.end}><NavigationBackIcon /></IconButton>
    );
  }

  /**
   * End the practice session and return to the intro/prefs screen
   */
  end() {
    this.setState({started: false});
    this.context.appbar(
      "Perfect Pitch",
      null,
      <FlatButton label="Start" onTouchTap={this.start} />
    );
  }

  /**
   * Handler for all toggle switches and checkboxes
   */
  onToggle(e, enabled) {
    let name = e.target.name;
    let prefs = this.state.prefs;
    prefs[name] = enabled;
    this.setState({prefs: prefs});
  }

  render() {
    if (this.state.started) {
      return (
        <PerfectPitchPractice prefs={this.state.prefs} />
      );
    } else {
      return (
        <Card>
          <List subheader="Options">
            <PrefsToggle text="Include accidentals" name="accidentals" defaultState={this.state.prefs.accidentals} onSwitch={this.onToggle} />
            <PrefsToggle text="Show keyboard labels" name="keyboardLabels" defaultState={this.state.prefs.keyboardLabels} onSwitch={this.onToggle} />
            <PrefsToggle text="Auto-advance after correct guess" name="autoAdvance" defaultState={this.state.prefs.autoAdvance} onSwitch={this.onToggle} />
          </List>
        </Card>
      );
    }
  }
}
PerfectPitchPracticeIntro.contextTypes = {
  snackbar: React.PropTypes.func,
  appbar: React.PropTypes.func,
};
export default PerfectPitchPracticeIntro;
