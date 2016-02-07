import React from 'react';
import FlatButton from 'material-ui/lib/flat-button';
import FloatingActionButton from 'material-ui/lib/floating-action-button';
import PlayArrow from 'material-ui/lib/svg-icons/av/play-arrow';
import Card from 'material-ui/lib/card/card';
import CardTitle from 'material-ui/lib/card/card-title';
import CardText from 'material-ui/lib/card/card-text';
import KeyboardButtons from './keyboard-buttons.jsx';
import * as Midi from './midi';

/**
 * Component providing the perfect pitch practice game (in entirety)
 */
class PerfectPitchPractice extends React.Component {
  constructor(props) {
    super(props);

    // Initial state
    this.state = this.getRandomState();

    // Prebind custom methods
    this.newQuestion = this.newQuestion.bind(this);
    this.playSound = this.playSound.bind(this);
    this.handleGuess = this.handleGuess.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.onMidiAccessGranted = this.onMidiAccessGranted.bind(this);
  }

  // Pick random element from an array; TODO: Move this into a utility module
  r(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  componentDidMount() {
    // Initialize Web MIDI
    if (navigator.requestMIDIAccess) {
        navigator.requestMIDIAccess().then(this.onMidiAccessGranted.bind(this));
    } else {
        console.note("Web MIDI not supported in this browser. Try Chrome!");
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
        input.value.onmidimessage = this.onMidiMessage.bind(this);
        this.context.snackbar("MIDI device connected!");
      }
    }
  }

  /**
   * Handler for when a new MIDI message arrives from an input port
   */
  onMidiMessage(message) {
    var type     = message.data[0],
        note     = message.data[1],
        velocity = message.data[2];

    // 144 means Note On
    if (type == Midi.Types.NoteOn) {
      // Handle MIDI guess
      var keys = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'];
      var key = keys[note % 12];
      var octave = Math.floor(note/12) - 1;
      if (this.state.key.key == key) {
        this.correctGuess();
      } else {
        this.incorrectGuess();
      }
    }
  }

  /**
   * Randomly generate a new question and return a state object
   */
  getRandomState() {
    var r = this.r;

    // Now we know a key signature; Do we want to just choose a key within it, or allow for accidentals?
    var baseKeys = ['c', 'd', 'e', 'f', 'g', 'a', 'b'];
    var key = r(baseKeys);
    var modifier = null;
    if (this.props.prefs.accidentals) {
      var useAccidental = r([true, false]);
      if (useAccidental) {
        // Only add a sharp to a key that can receive it
        if (['c', 'd', 'f', 'g', 'a'].includes(key)) {
          key += '#';
        }
        // TODO: key += r(['#', 'b']) (Guess checker can't handle flats yet)
      }
    }

    return {
      key: {key:key, modifier:modifier}
    };
  }

  /**
   * Generate a new question to ask and update state
   */
  newQuestion() {
    let oldStateJson = JSON.stringify(this.state);
    let newState = undefined;

    // Keep generating new questions until we come up with one that's actually new
    // (We don't want duplicate consecutive questions)
    do {
      newState = this.getRandomState();
    } while (JSON.stringify(newState) == oldStateJson);

    this.setState(newState);
    this.playSound(null, newState.key.key);
  }

  playSound(event, key) {
    if (key === undefined) {
      key = this.state.key.key;
    }
    this.context.synth.play(key, 1.0);
  }

  /**
   * Handle a guessed answer and judge it to be right or wrong.
   *
   * Guesses should be sent here from multiple places:
   *  - The on-screen musical keyboard (KeyboardButtons component)
   *  - Keyboard input
   *  - Connected MIDI events
   *
   * @param {string} entry The name of the key being guessed.
   */
  handleGuess(entry) {
    // Compare entry with what's in state
    if (this.state.key.key == entry) {
      this.correctGuess();
    } else {
      this.incorrectGuess();
    }
  }

  correctGuess() {
    var snack = this.r([
      "Nice job!",
      "Correct!",
      "That's right!",
      "Very good!",
      "Way to go!"
    ]);
    this.context.snackbar(snack, 1000);

    if (this.props.prefs.autoAdvance) {
      // Jump to the next question
      this.newQuestion();
    } else {
      // Just play the current note again and wait for user to move on
      this.playSound();
    }
  }

  incorrectGuess() {
    var snack = this.r([
      "Nope :(",
      "Not quite...",
      "Keep trying!",
      "I don't think so...",
      "Getting warmer..."
    ]);
    this.context.snackbar(snack, 1000);
  }

  render() {
    return (
      <Card className="rx-perfect-pitch-practice" style={{maxWidth: "600px", margin: "0 auto"}}>
        <CardTitle title="What note is being played?" />
        <CardText>
          <div style={{textAlign: "center"}}>
            <FloatingActionButton onTouchTap={this.playSound} style={{textAlign: "center", margin: "20px auto 40px"}}>
              <PlayArrow />
            </FloatingActionButton>
          </div>
          <KeyboardButtons onEntry={this.handleGuess} style={{margin: "10px auto"}} showLabels={this.props.prefs["keyboardLabels"]} enableSound={false} />
          <FlatButton label="Next" onTouchTap={this.newQuestion} style={{display: "block", margin: "40px auto 20px"}} />
        </CardText>
      </Card>
    )
  }
}
PerfectPitchPractice.contextTypes = {
  snackbar: React.PropTypes.func,
  appbar: React.PropTypes.func,
  synth: React.PropTypes.object,
};
export default PerfectPitchPractice;
