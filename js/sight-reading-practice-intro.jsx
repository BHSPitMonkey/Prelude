import React from 'react';
import FlatButton from 'material-ui/lib/flat-button';
import IconButton from 'material-ui/lib/icon-button';
import NavigationBackIcon from 'material-ui/lib/svg-icons/navigation/arrow-back';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Divider from 'material-ui/lib/divider';
import Checkbox from 'material-ui/lib/checkbox';
import Toggle from 'material-ui/lib/toggle';
import SightReadingPractice from './sight-reading-practice.jsx';
import Card from './common/card.jsx';

class PrefsToggle extends React.Component {
  render() {
    return (
      <ListItem
        primaryText={this.props.text}
        rightToggle={<Toggle
          name={this.props.name}
          defaultToggled={this.props.defaultState}
          onToggle={this.props.onSwitch}
        />}
      />
    );
  }
}

class PrefsCheckbox extends React.Component {
  render() {
    return (
      <ListItem
        primaryText={this.props.text}
        leftCheckbox={<Checkbox
          name={this.props.name}
          defaultChecked={this.props.defaultState}
          onCheck={this.props.onSwitch}
        />}
      />
    );
  }
}

/**
 * Intro screen for the Sight Reading practice mode
 *
 * Intended to show user-configurable settings for the practice session
 * before starting, along with a button to begin.
 */
class SightReadingPracticeIntro extends React.Component {
  constructor(props) {
    super(props);

    // If localStorage doesn't have prefs yet, pre-populate with defaults
    let prefs = localStorage["prefs.sightReading"];
    if (prefs === undefined) {
        prefs = JSON.stringify({
            "clefs.treble": true,
            "clefs.bass": true,
            "types.single": true,
            "types.chords": false,
            "types.clusters": false,
            randomizeKeySignature: false,
            accidentals: true,
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
    localStorage["prefs.sightReading"] = JSON.stringify(this.state.prefs);
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
      "Sight Reading",
      <IconButton onTouchTap={this.end}><NavigationBackIcon /></IconButton>
    );
  }

  /**
   * End the practice session and return to the intro/prefs screen
   */
  end() {
    this.setState({started: false});
    this.context.appbar(
      "Sight Reading",
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
        <SightReadingPractice prefs={this.state.prefs} />
      );
    } else {
      return (
        <Card>
          <List subheader="Which clef(s) would you like to practice?">
            <PrefsCheckbox text="Treble clef" name="clefs.treble" defaultState={this.state.prefs["clefs.treble"]} onSwitch={this.onToggle} />
            <PrefsCheckbox text="Bass clef" name="clefs.bass" defaultState={this.state.prefs["clefs.bass"]} onSwitch={this.onToggle} />
          </List>
          <Divider />
          <List subheader="Which would you like to include?">
            <PrefsCheckbox text="Single notes" name="types.single" defaultState={this.state.prefs["types.single"]} onSwitch={this.onToggle} />
            <PrefsCheckbox text="Chords" name="types.chords" defaultState={this.state.prefs["types.chords"]} onSwitch={this.onToggle} />
            <PrefsCheckbox text="Non-chordal clusters" name="types.clusters" defaultState={this.state.prefs["types.clusters"]} onSwitch={this.onToggle} />
          </List>
          <Divider />
          <List subheader="Other options">
            <PrefsToggle text="Randomize key signature" name="randomizeKeySignature" defaultState={this.state.prefs.randomizeKeySignature} onSwitch={this.onToggle} />
            <PrefsToggle text="Include accidentals" name="accidentals" defaultState={this.state.prefs.accidentals} onSwitch={this.onToggle} />
          </List>
        </Card>
      );
    }
  }
}
SightReadingPracticeIntro.contextTypes = {
  snackbar: React.PropTypes.func,
  appbar: React.PropTypes.func,
};
export default SightReadingPracticeIntro;
