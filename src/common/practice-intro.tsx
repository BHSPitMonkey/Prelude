import React, { ReactElement } from 'react';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import NavigationBackIcon from 'material-ui/svg-icons/navigation/arrow-back';
import List from 'material-ui/List/List';
import Subheader from 'material-ui/Subheader';
import Card from './card';
import PrefsToggle from './prefs-toggle';
import PrefsCheckbox from './prefs-checkbox';
import PropTypes from 'prop-types';

export type PreferenceItem = {
  type: string;
  label: string;
  pref: string;
  default: boolean;
};
export type PreferenceGroup = {
  header: string;
  items: PreferenceItem[];
};
export type PreferencesState = {
  [x: string]: any
};

/**
 * Wrapper component for practice modes, containing general functionality for
 * displaying an initial options screen with a "start" button to begin an
 * exercise.
 *
 * See SightReadingPracticeIntro and PerfectPitchPracticeIntro for examples of
 * how to use.
 */
class PracticeIntro extends React.Component {
  props: { component: React.ComponentType<{ prefs: PreferencesState }>, title: string, prefDefs: PreferenceGroup[], prefsNamespace: string };
  state: { started: boolean; prefs: PreferencesState; };
  context: { appbar: (title: string, leftElement?: Element | ReactElement, rightElement?: Element | ReactElement) => void };
  static contextTypes: { snackbar: any; appbar: any; };

  constructor(props) {
    super(props);

    // If localStorage doesn't have prefs yet, pre-populate with defaults
    let prefs = localStorage["prefs." + this.props.prefsNamespace];
    if (prefs === undefined) {
      var defaults: { [x: string]: any } = {};
      this.props.prefDefs.forEach(section => {
        section.items.forEach(item => {
          defaults[item.pref] = item.default;
        });
      });
      prefs = JSON.stringify(defaults);
    }

    // Initial state
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
    localStorage["prefs." + this.props.prefsNamespace] = JSON.stringify(this.state.prefs);
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
      this.props.title,
      <IconButton onClick={this.end}><NavigationBackIcon /></IconButton>
    );
  }

  /**
   * End the practice session and return to the intro/prefs screen
   */
  end() {
    this.setState({started: false});
    this.context.appbar(
      this.props.title,
      null,
      <FlatButton label="Start" onClick={this.start} />
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
        <this.props.component prefs={this.state.prefs} />
      );
    } else {
      return (
        <Card>
          {
            this.props.prefDefs.map((section, i) => {
              return (
                <List key={i}>
                  <Subheader>{section.header}</Subheader>
                  {
                    section.items.map((item, j) => {
                      if (item.type == "checkbox") return (
                        <PrefsCheckbox text={item.label} name={item.pref} defaultState={this.state.prefs[item.pref]} onSwitch={this.onToggle} key={j} />
                      );
                      if (item.type == "toggle") return (
                        <PrefsToggle text={item.label} name={item.pref} defaultState={this.state.prefs[item.pref]} onSwitch={this.onToggle} key={j} />
                      );
                    })
                  }
                </List>
              );
            })
          }
        </Card>
      );
    }
  }
}
PracticeIntro.contextTypes = {
  snackbar: PropTypes.func,
  appbar: PropTypes.func,
};
export default PracticeIntro;
