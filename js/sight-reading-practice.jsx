import React from 'react';
import FlatButton from 'material-ui/lib/flat-button';
import Card from 'material-ui/lib/card/card';
import CardTitle from 'material-ui/lib/card/card-title';
import CardText from 'material-ui/lib/card/card-text';
import SheetMusicView from './sheet-music-view.jsx';
import KeyboardButtons from './keyboard-buttons.jsx';
import * as Midi from './midi';

/**
 * Component providing the sight reading practice game (in entirety)
 */
class SightReadingPractice extends React.Component {
  constructor(props) {
    super(props);

    // Initial state
    this.state = this.getRandomState();

    // Prebind custom methods
    this.newQuestion = this.newQuestion.bind(this);
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
        if (this.state.key.octave == octave) {
          this.correctGuess();
        } else {
          this.context.snackbar("Check your octave...");
        }
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

    // Pick a clef (probably should just do this once in the constructor or componentWillMount)
    let allClefs = ['treble', 'bass'];
    let clefs = [];
    allClefs.forEach((clef) => {
      if (this.props.prefs["clefs." + clef] == true) {
        clefs.push(clef);
      }
    });
    if (clefs.length == 0) {
      console.log("No clefs were selected; Defaulting to all clefs.");
      clefs = allClefs;
    }
    let clef = r(clefs);

    // Pick a suitable octave for the clef
    var octaves = (clef == 'bass') ? ['2', '3'] : ['4', '5'];
    var octave = r(octaves);

    // Pick a key signature
    if (this.props.prefs.randomizeKeySignature) {
      var keySignatures = Object.keys(Vex.Flow.keySignature.keySpecs);
      var keySignature = r(keySignatures);
    } else {
      var keySignature = 'C';
    }

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
      //if (['c', ''])
      //var keys = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'];
      //var keys = ['c#', 'd#', 'f#', 'g#', 'a#'];
      //var key = r(keys);
    }

    return {
      clef: clef,
      keySignature: keySignature,
      key: {key:key, modifier:modifier, octave:octave}
    };
  }

  /**
   * Generate a new question to ask and update state
   */
  newQuestion() {
    var newState = this.getRandomState();
    this.setState(newState);
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
    this.newQuestion();
    var snack = this.r([
      "Nice job!",
      "Correct!",
      "That's right!",
      "Very good!",
      "Way to go!"
    ]);
    this.context.snackbar(snack, 500);
  }

  incorrectGuess() {
    var snack = this.r([
      "Nope :(",
      "Not quite...",
      "Keep trying!",
      "I don't think so...",
      "Getting warmer..."
    ]);
    this.context.snackbar(snack, 500);
  }

  render() {
    return (
      <Card className="rx-sight-reading-practice" style={{maxWidth: "600px", margin: "0 auto"}}>
        <CardTitle title="What note is shown below?" />
        <CardText>
          <SheetMusicView clef={this.state.clef} keySignature={this.state.keySignature} keys={[this.state.key]} />
          <KeyboardButtons onEntry={this.handleGuess} style={{margin: "10px auto"}} showLabels={this.props.prefs["keyboardLabels"]} />
          <FlatButton label="Skip" onTouchTap={this.newQuestion} style={{display: "block", margin: "40px auto 20px"}} />
        </CardText>
      </Card>
    )
  }
}
SightReadingPractice.contextTypes = {
  snackbar: React.PropTypes.func,
  appbar: React.PropTypes.func,
};
export default SightReadingPractice;
