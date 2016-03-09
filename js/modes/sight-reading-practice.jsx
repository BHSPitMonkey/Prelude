import React from 'react';
import NoSleep from 'nosleep';
import Teoria from 'teoria';
import FlatButton from 'material-ui/lib/flat-button';
import Card from 'material-ui/lib/card/card';
import CardTitle from 'material-ui/lib/card/card-title';
import CardText from 'material-ui/lib/card/card-text';
import SheetMusicView from '../sheet-music-view.jsx';
import KeyboardButtons from '../keyboard-buttons.jsx';
import * as Midi from '../midi';

/**
 * Component providing the sight reading practice game (in entirety)
 */
class SightReadingPractice extends React.Component {
  constructor(props) {
    super(props);

    this.nosleep = new NoSleep();

    // Preload clefs
    let allClefs = ['treble', 'bass'];
    this.clefs = [];
    allClefs.forEach((clef) => {
      if (this.props.prefs["clefs." + clef] == true) {
        this.clefs.push(clef);
      }
    });
    if (this.clefs.length == 0) {
      console.log("No clefs were selected; Defaulting to all clefs.");
      this.clefs = allClefs;
    }

    // Prepare types
    let allTypes = ['single', 'chords', 'clusters'];
    this.types = [];
    allTypes.forEach((type) => {
      if (this.props.prefs["types." + type] == true) {
        this.types.push(type);
      }
    });
    if (this.types.length == 0) {
      console.log("No types were selected; Defaulting to all types.");
      this.types = allTypes;
    }

    // Initial state
    this.state = this.getRandomState();

    // Dirty way of storing pressed MIDI notes
    this.notesOn = {};

    // Prebind custom methods
    this.newQuestion = this.newQuestion.bind(this);
    this.handleGuess = this.handleGuess.bind(this);
    this.componentWillUnmount = this.componentWillUnmount.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.onMidiAccessGranted = this.onMidiAccessGranted.bind(this);
  }

  // Pick random element from an array; TODO: Move this into a utility module
  r(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
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
        midiNote = message.data[1],
        velocity = message.data[2];

    if (type == Midi.Types.NoteOn) {
      // Update NotesOn
      this.notesOn[midiNote] = true;

      let pressedNotes = new Set(Object.keys(this.notesOn).map(key => parseInt(key))); // Set of MIDI note numbers down
      let correctNotes = this.state.keys.map(note => note.midi()); // Arr of correct MIDI note numbers

      // If number of keys down matches number of notes on staff, evaluate answer
      if (pressedNotes.size === correctNotes.length) {
        console.log("Keys down:", [...pressedNotes], "Correct notes:", correctNotes);
        let diff = correctNotes.filter(note => !pressedNotes.has(note));
        if (diff.length == 0) {
          this.correctGuess();
        } else if (correctNotes.length == 1 && ((correctNotes[0] - midiNote) % 12 == 0)) {
          this.context.snackbar("Check your octave...");
        } else {
          this.incorrectGuess();
        }
      }
    } else if (type == Midi.Types.NoteOff) {
      delete this.notesOn[midiNote];
    }
  }

  /**
   * Randomly generate a new question and return a state object
   */
  getRandomState() {
    var r = this.r;

    // Pick a clef
    let clef = r(this.clefs);

    // Pick a suitable octave for the clef
    let octaves = (clef == 'bass') ? ['2', '3'] : ['4', '5'];
    let octave = r(octaves);

    // Pick a key signature
    if (this.props.prefs.randomizeKeySignature) {
      var keySignatures = Object.keys(Vex.Flow.keySignature.keySpecs);
      var keySignature = r(keySignatures);

      // Pick a Scale for use with Teoria
      var scaleType = 'major';
      if (keySignature[keySignature.length-1] == 'm') {
        // Strip the trailing 'm' for minor key signatures
        var tonic = Teoria.note(keySignature.substr(0, keySignature.length-1));
        var scaleType = 'minor';
      } else {
        var tonic = Teoria.note(keySignature);
        var scaleType = 'major';
      }
    } else {
      var keySignature = 'C';
      var tonic = Teoria.note('C');
      var scaleType = 'major';
    }
    var scale = Teoria.scale(tonic, scaleType);

    // Branch based on type (single, chord, cluster)
    let type = r(this.types);
    switch (type) {
      case 'single':
        // Now we know a key signature; Do we want to just choose a key within it, or allow for accidentals?
        var baseKeys = ['c', 'd', 'e', 'f', 'g', 'a', 'b'];
        var key = r(baseKeys);
        var accidental = "";
        if (this.props.prefs.accidentals) {
          // TODO: Make this logic less naive
          var useAccidental = r([null, 'sharp', 'flat']);
          if (useAccidental) {
            // Only add a sharp to a key that can receive it
            if (useAccidental == 'sharp' && ['c', 'd', 'f', 'g', 'a'].includes(key)) {
              accidental = '#';
            }
            else if (useAccidental == 'sharp' && ['d', 'e', 'g', 'a', 'b'].includes(key)) {
              accidental = 'b';
            }
          }
        }
        var keys = [Teoria.note(key + accidental + octave)];
        break;
      case 'chords':
        // TODO: Confine random chord to appropriate subset of chosen clef
        // First pick a root Note from the chosen Scale...
        let root = r(scale.notes()); // TODO: Better list?

        // Then pick a chord type...
        let chordType = r(['M', 'm', 'dim', 'aug', '7', 'M7', 'm7', 'mM7', '9sus4']); // TODO: Other types?
        let chord = Teoria.chord(root, chordType);

        // Then pick a bass note (for different inversions)
        // TODO

        var keys = chord.notes();
        break;
      case 'cluster':
        //
        break;
      default:
        console.error("Invalid question type selected:", type);
    }

    return {
      clef: clef,
      keySignature: keySignature,
      keys: keys,
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
    // Convert entry (e.g. "d#", "g") to a Teoria Note
    let note = Teoria.note(entry);

    // Compare entry with what's in state
    let firstNote = this.state.keys[0]; // TODO: Multi-note handling

    if (firstNote.name() == note.name() && firstNote.accidentalValue() == note.accidentalValue()) {
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
    this.context.snackbar(snack, 1000);
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
      <Card className="rx-sight-reading-practice" style={{maxWidth: "600px", margin: "0 auto"}}>
        <CardTitle title="What note is shown below?" />
        <CardText>
          <SheetMusicView clef={this.state.clef} keySignature={this.state.keySignature} keys={this.state.keys} />
          <KeyboardButtons onEntry={this.handleGuess} style={{margin: "10px auto"}} showLabels={this.props.prefs["keyboardLabels"]} enableSound={true} />
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
SightReadingPractice.prefsDefinitions = [
  {
    header: "Which clef(s) would you like to practice?",
    items: [
      {
        type: "checkbox",
        label: "Treble clef",
        pref: "clefs.treble",
        default: true,
      },
      {
        type: "checkbox",
        label: "Bass clef",
        pref: "clefs.bass",
        default: true,
      },
    ]
  },
  {
    header: "Which would you like to include?",
    items: [
      {
        type: "checkbox",
        label: "Single notes",
        pref: "types.single",
        default: true,
      },
      {
        type: "checkbox",
        label: "Chords",
        pref: "types.chords",
        default: false,
      },
      {
        type: "checkbox",
        label: "Non-chordal clusters",
        pref: "types.clusters",
        default: false,
      },
    ]
  },
  {
    header: "Other options",
    items: [
      {
        type: "toggle",
        label: "Randomize key signature",
        pref: "randomizeKeySignature",
        default: false,
      },
      {
        type: "toggle",
        label: "Include accidentals",
        pref: "accidentals",
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
        label: "Prevent screen from dimming",
        pref: "preventSleep",
        default: true,
      },
    ]
  },
];
export default SightReadingPractice;
