var React = require('react');
var ReactDOM = require('react-dom');
var SightReadingPractice = require('./sight-reading-practice.jsx');

/**
 * Top-level application component
 */
class Application extends React.Component {
  constructor(props) {
    super(props);

    // Prebind custom methods
    this.componentDidMount = this.componentDidMount.bind(this);
    this.onMidiAccessGranted = this.onMidiAccessGranted.bind(this);
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
  render() {
    return (
      <div>
        <h1>Quiz</h1>
        <SightReadingPractice />
      </div>
    );
  }
}

// Render top-level component to page
ReactDOM.render(
  <Application />,
  document.getElementById('container')
);
