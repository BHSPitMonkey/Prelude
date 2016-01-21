import React from 'react';
import FlatButton from 'material-ui/lib/flat-button';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Divider from 'material-ui/lib/divider';
import Checkbox from 'material-ui/lib/checkbox';
import Toggle from 'material-ui/lib/toggle';
import SightReadingPractice from './sight-reading-practice.jsx';
import Card from './common/card.jsx';

/**
 * Intro screen for the Sight Reading practice mode
 *
 * Intended to show user-configurable settings for the practice session
 * before starting, along with a button to begin.
 */
class SightReadingPracticeIntro extends React.Component {
  constructor(props) {
    super(props);

    // Initial state (TODO: Load the preferences from persistent storage somehow)
    this.state = {
      started: false,
    };

    // Prebind custom methods
    this.componentWillMount = this.componentWillMount.bind(this);
    this.start = this.start.bind(this);
  }
  componentWillMount() {
    this.context.appbar(
      "Sight Reading",
      null,
      <FlatButton label="Start" onTouchTap={this.start} />
    );
  }
  start() {
    this.setState({started: true});
    // TODO: Persist chosen settings
  }
  render() {
    if (this.state.started) {
      // TODO: Bind settings state to props
      return (
        <SightReadingPractice />
      );
    } else {
      return (
        <Card>
          <List subheader="Which clef(s) would you like to practice?">
            <ListItem primaryText="Treble clef" leftCheckbox={<Checkbox />} />
            <ListItem primaryText="Bass clef" leftCheckbox={<Checkbox />} />
          </List>
          <Divider />
          <List subheader="Which would you like to include?">
            <ListItem primaryText="Single notes" leftCheckbox={<Checkbox />} />
            <ListItem primaryText="Chords" leftCheckbox={<Checkbox />} />
            <ListItem primaryText="Non-chordal clusters" leftCheckbox={<Checkbox />} />
          </List>
          <Divider />
          <List subheader="Other options">
            <ListItem primaryText="Randomize key signature" rightToggle={<Toggle />} />
            <ListItem primaryText="Include accidentals" rightToggle={<Toggle />} />
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
