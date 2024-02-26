import React from 'react';
import NoSleep from 'nosleep';
import Teoria from 'teoria';
import Card from 'material-ui/Card/Card';
import CardTitle from 'material-ui/Card/CardTitle';
import CardText from 'material-ui/Card/CardText';
import SheetMusicView from '../sheet-music-view.jsx';
import KeyboardButtons from '../keyboard-buttons.jsx';
import * as Midi from '../midi'

/**
 * Component providing the free play mode
 */
export default class FreePlay extends React.Component {
  constructor(props) {
    super(props);

    this.nosleep = new NoSleep();

    // Initial state
    this.state = {clef: 'grand'};

    // Dirty way of storing pressed MIDI notes
    this.notesOn = {};

    // Dirty way of storing on-screen keyboard keys down
    //this.keysDown = new Set();
    /** @var Set Set of MIDI note numbers (integers) currently down/active */
    this.state.keysDown = new Set();

    // Prebind custom methods
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.componentWillUnmount = this.componentWillUnmount.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.onMidiAccessGranted = this.onMidiAccessGranted.bind(this);
  }

  /**
   * We need to disable nosleep on unmount in case the user leaves the practice session by some other means than by
   * using the back button in the AppBar (e.g. by using their browser navigation)
   */
  componentWillUnmount() {
    console.log("No longer preventing device from sleep.");
    this.nosleep.disable();
  }

  componentDidMount() {
    // Prevent device from going to sleep
    if (this.props.prefs.preventSleep) {
      console.log("Preventing device from sleep.");
      this.nosleep.enable();
    }

    // Initialize Web MIDI
    if (navigator.requestMIDIAccess) {
        navigator.requestMIDIAccess().then(this.onMidiAccessGranted.bind(this));
    } else {
        console.log("Web MIDI not supported in this browser. Try Chrome!");
    }
  }

  /**
   * Handler for after we've been granted the MIDI access we requested at launch
   */
  onMidiAccessGranted(midi) {
    // Loop over all midi inputs
    var inputs = midi.inputs.values();
    var connected = false;
    for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
      input.value.onmidimessage = this.onMidiMessage.bind(this);
      connected = true;
    }

    // Tell the user if we found something
    if (connected) {
      this.context.snackbar("Found a MIDI input device!", 4000);
    }

    // Subscribe to port changes so we can handle new connections
    midi.onstatechange = this.onMidiStateChange.bind(this);
  }

  /**
   * Handler for new MIDI devices connected after launch
   */
  onMidiStateChange(event) {
    // We currently only care about inputs
    if (event.port.type == "input") {
      if (event.port.connection == "open") {
        event.port.onmidimessage = this.onMidiMessage.bind(this);
        this.context.snackbar("MIDI device connected!");
      }
    }
  }

  /**
   * Handler for when a new MIDI message arrives from an input port
   */
  onMidiMessage(message) {
    var type     = message.data[0],
        midiNote = message.data[1],
        velocity = message.data[2];

    const keysDown = this.state.keysDown;
    if (type == Midi.Types.NoteOn) {
      keysDown.add(midiNote);
      this.setState(keysDown);

      // Update NotesOn
      this.notesOn[midiNote] = true;
    } else if (type == Midi.Types.NoteOff) {
      keysDown.delete(midiNote);
      this.setState(keysDown);

      delete this.notesOn[midiNote];
    }

    this.setState({
      keysDown: keysDown
    });
  }

  /**
   * Handle a pressed key.
   *
   * Presses could be sent here from multiple places:
   *  - The on-screen musical keyboard (KeyboardButtons component)
   *  - Keyboard input
   *
   * @param {Set} entries The names of the key(s) being pressed.
   */
  handleKeyPress(entry) {
    const keysDown = this.state.keysDown;
    const autoHold = this.props.prefs['keyboardAutoHold'];
    const note = Teoria.note(entry);
    const midiNote = note.midi();

    // If there are multiple notes in this question, toggle this key in keysDown
    if (autoHold) {
      if (keysDown.has(midiNote)) {
        // Key is being un-pressed
        keysDown.delete(midiNote);
      } else {
        // Key is being pressed
        keysDown.add(midiNote);
      }
    } else {
      // Clear keysDown and just add this key
      keysDown.clear();
      keysDown.add(midiNote);
    }

    // Save changed keysDown to state
    this.setState({ keysDown: keysDown });
  }

  render() {
    // Map this.state.keysDown into Teoria notes
    const notesDown = [];
    this.state.keysDown.forEach(midiNote => {
      notesDown.push(Teoria.note.fromMIDI(midiNote));
    });

    return (
      <Card className="rx-free-play" style={{maxWidth: "600px", margin: "0 auto"}}>
        <CardTitle title="Press keys to see them on the staff." />
        <CardText>
          <SheetMusicView
            clef={this.state.clef}
            keySignature={'C'}
            keys={notesDown}
          />
          <KeyboardButtons
            onEntry={this.handleKeyPress}
            style={{margin: "10px auto"}}
            showLabels={this.props.prefs["keyboardLabels"]}
            useFlats={this.state.flatKeyboardLabels}
            enableSound={this.props.prefs["keyboardSound"]}
            keysDown={this.state.keysDown}
          />
        </CardText>
      </Card>
    )
  }
}
FreePlay.contextTypes = {
  snackbar: React.PropTypes.func,
  appbar: React.PropTypes.func,
};
FreePlay.prefsDefinitions = [
  {
    header: "On-screen keyboard",
    items: [
      {
        type: "toggle",
        label: "Auto-hold keys",
        pref: "keyboardAutoHold",
        default: true,
      },
      {
        type: "toggle",
        label: "Show keyboard labels",
        pref: "keyboardLabels",
        default: true,
      },
      {
        type: "toggle",
        label: "Sound",
        pref: "keyboardSound",
        default: true,
      },
    ]
  },
  {
    header: "Other options",
    items: [
      {
        type: "toggle",
        label: "Prevent screen from dimming",
        pref: "preventSleep",
        default: true,
      },
    ]
  },
];
