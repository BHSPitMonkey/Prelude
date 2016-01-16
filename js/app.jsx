var React = require('react');
var ReactDOM = require('react-dom');
var SightReadingPractice = require('./sight-reading-practice.jsx');
var AppBar = require('material-ui/lib/app-bar');
var LeftNav = require('material-ui/lib/left-nav');
var MenuItem = require('material-ui/lib/menus/menu-item');

/**
 * Top-level application component
 */
class Application extends React.Component {
  constructor(props) {
    super(props);

    this.state = {leftNavOpen: false};

    // Prebind custom methods
    this.componentDidMount = this.componentDidMount.bind(this);
    this.onMidiAccessGranted = this.onMidiAccessGranted.bind(this);
    this.toggleLeftNav = this.toggleLeftNav.bind(this);
    this.leftNavRequestChange = this.leftNavRequestChange.bind(this);
  }
  componentDidMount() {
    // Initialize Web MIDI
    if (navigator.requestMIDIAccess) {
        navigator.requestMIDIAccess().then(this.onMidiAccessGranted.bind(this));
    } else {
        console.note("Web MIDI not supported in this browser. Try Chrome!");
    }
  }
  onMidiAccessGranted(midi) {
    console.log("Got midi access: ", midi);

    // Loop over all midi inputs
    var inputs = midi.inputs.values();
    for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
      input.value.onmidimessage = this.onMidiMessage;
    }

    // Subscribe to port changes so we can handle new connections
    // TODO
  }
  onMidiMessage(message) {
    console.log("Got message", message, this);
  }
  toggleLeftNav() {
    this.state.leftNavOpen = !this.state.leftNavOpen;
    this.setState(this.state);
  }
  leftNavRequestChange(open, reason) {
    this.state.leftNavOpen = false;
    this.setState(this.state);
  }
  render() {
    return (
      <div>
        <AppBar
          title="Music Trainer"
          onLeftIconButtonTouchTap={this.toggleLeftNav}
          iconClassNameRight="muidocs-icon-navigation-expand-more"
        />
        <LeftNav
          open={this.state.leftNavOpen}
          onRequestChange={this.leftNavRequestChange}
          docked={false}>
          <MenuItem>Sight Reading Practice</MenuItem>
        </LeftNav>
        <SightReadingPractice />
      </div>
    );
  }
}
module.exports = Application;
