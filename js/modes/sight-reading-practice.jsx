import React from 'react';
import NoSleep from 'nosleep';
import Teoria from 'teoria';
import FlatButton from 'material-ui/FlatButton';
import Card from 'material-ui/Card/Card';
import CardTitle from 'material-ui/Card/CardTitle';
import CardText from 'material-ui/Card/CardText';
import SheetMusicView from '../sheet-music-view.jsx';
import KeyboardButtons from '../keyboard-buttons.jsx';
import * as Midi from '../midi';
import PD from 'probability-distributions';

// Private constants
const possibleClefs = ['treble', 'bass'];
const possibleChordTypes = ['M', 'm', 'dim', 'aug', '7', 'M7', 'm7', 'mM7']; // TODO: Others?
const possibleQuestionTypes = ['single', 'chords']; // TODO: , 'clusters'];
const scaleDegrees = [0, 1, 2, 3, 4, 5, 6];
const baseKeys = ['c', 'd', 'e', 'f', 'g', 'a', 'b'];
const upOctave = Teoria.interval('P8');

/**
 * Component providing the sight reading practice game (in entirety)
 */
class SightReadingPractice extends React.Component {
  constructor(props) {
    super(props);

    this.nosleep = new NoSleep();

    // Preload clefs
    this.clefs = [];
    possibleClefs.forEach((clef) => {
      if (this.props.prefs["clefs." + clef] == true) {
        this.clefs.push(clef);
      }
    });
    if (this.clefs.length == 0) {
      console.log("No clefs were selected; Defaulting to all clefs.");
      this.clefs = possibleClefs;
    }

    // Prepare types
    this.types = [];
    possibleQuestionTypes.forEach((type) => {
      if (this.props.prefs["types." + type] == true) {
        this.types.push(type);
      }
    });
    if (this.types.length == 0) {
      console.log("No types were selected; Defaulting to all types.");
      this.types = possibleQuestionTypes;
    }

    // Initial state
    this.state = this.getRandomState();

    // Dirty way of storing pressed MIDI notes
    this.notesOn = {};

    // Dirty way of storing on-screen keyboard keys down
    //this.keysDown = new Set();
    this.state.keysDown = new Set();

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
    const r = this.r;

    // Default setting for
    let flatKeyboardLabels = false;

    // Pick a clef
    let clef = r(this.clefs);

    // Pick a suitable octave for the clef
    let octaves = (clef == 'bass') ? ['2', '3'] : ['4', '5'];
    let octave = r(octaves);

    // Based on the chosen clef, define a min/max allowable note
    let minNote = Teoria.note((clef == 'bass') ? 'C2' : 'A3');
    let maxNote = Teoria.note((clef == 'bass') ? 'E4' : 'C6');

    // Pick a key signature
    let keySignature, scaleType, tonic;
    if (this.props.prefs.randomizeKeySignature) {
      // Choose a number of sharps/flats, from 0 to 7, favoring lower amounts
      var numAccidentals = Math.floor(PD.rbeta(1, 1, 3)[0] * 8);
      var candidateSignatures = [];
      var keySignatures = Object.keys(Vex.Flow.keySignature.keySpecs);
      keySignatures.forEach((key) => {
        if (Vex.Flow.keySignature.keySpecs[key]['num'] == numAccidentals) {
          candidateSignatures.push(key);
        }
      });
      keySignature = r(candidateSignatures);
      if (Vex.Flow.keySignature.keySpecs[keySignature].acc == "b") {
        flatKeyboardLabels = true;
      }

      // Pick a Scale for use with Teoria
      if (keySignature[keySignature.length-1] == 'm') {
        // Strip the trailing 'm' for minor key signatures
        tonic = Teoria.note(keySignature.substr(0, keySignature.length-1));
        scaleType = 'minor';
      } else {
        tonic = Teoria.note(keySignature);
        scaleType = 'major';
      }
    } else {
      keySignature = 'C';
      tonic = Teoria.note('C');
      scaleType = 'major';
    }
    let scale = Teoria.scale(tonic, scaleType);

    // Branch based on type (single, chord, cluster)
    let type = r(this.types);
    switch (type) {
      case 'single':
        // Now we know a key signature; Do we want to just choose a key within it, or allow for accidentals?
        let key = r(baseKeys);
        let accidental = "";
        if (this.props.prefs.accidentals) {
          // TODO: Make this logic less naive
          var useAccidental = r([null, 'sharp', 'flat']);
          if (useAccidental) {
            // Only add a sharp to a key that can receive it
            if (useAccidental == 'sharp' && ['c', 'd', 'f', 'g', 'a'].includes(key)) {
              accidental = '#';
              flatKeyboardLabels = false;
            }
            else if (useAccidental == 'flat' && ['d', 'e', 'g', 'a', 'b'].includes(key)) {
              accidental = 'b';
              flatKeyboardLabels = true;
            }
          }
        }
        var notes = [Teoria.note(key + accidental + octave)];
        break;
      case 'chords':
        // First pick a root Note from the chosen Scale...
        let scaleNotes = scale.notes();
        let scaleDegree = r(scaleDegrees);
        let root = scaleNotes[scaleDegree];

        // If accidentals are enabled, choose a random chord quality
        var notes;
        if (this.props.prefs.accidentals) {
          // Then pick a chord type...
          let chordType = r(possibleChordTypes);
          let chord = Teoria.chord(root, chordType);
          notes = chord.notes();
        } else {
          // Accidentals are disabled; Build a chord within the scale.
          notes = [root];
          for (var i=1; i<r([3,4]); i++) {
            var distance = i * 2;
            var degree = scaleDegree + distance;
            var note = scaleNotes[degree % 7];
            if (degree >= 7) {
              note.transpose(upOctave);
            }
            notes.push(note);
          }
        }

        // Transpose notes into valid range
        while (Teoria.interval(notes[0], minNote).semitones() > 0) {
          notes.forEach((note) => {
            note.transpose(upOctave);
          });
        }

        // Invert the chord manually
        let inversion = r([0, 1, 2]);
        for (var i=0; i<inversion; i++) {
          // If this note has room to shift up an octave, transpose it
          if (Teoria.interval(notes[0], maxNote).semitones() >= 12) {
            notes[0].transpose(upOctave);
            // Disgusting hack to maintain note order (TODO: currently doesn't support 5 note chords!)
            notes.splice(3, 0, notes.shift());
          }
        }

        break;
      case 'cluster':
        // TODO
        break;
      default:
        console.error("Invalid question type selected:", type);
    }

    return {
      clef: clef,
      keySignature: keySignature,
      keys: notes,
      flatKeyboardLabels: flatKeyboardLabels,
    };
  }

  /**
   * Generate a new question to ask and update state
   */
  newQuestion() {
    let oldStateJson = JSON.stringify(this.state.keys);
    let newState = undefined;
    let newStateJson = undefined;
    let tries = 0;

    // Keep generating new questions until we come up with one that's actually new
    // (We don't want duplicate consecutive questions)
    // Just comparing state.keys is sufficient. Full state contains things we don't care about
    do {
      newState = this.getRandomState();
      newStateJson = JSON.stringify(newState.keys);
      tries++;

      if (tries > 25) {
        console.log("Gave up trying to generate a different question!");
        break;
      }
    } while (newStateJson == oldStateJson);

    this.setState(newState);

    // Clear the on-screen keyboard selections
    this.state.keysDown.clear();
    // TODO: Repersist keysDown?
  }

  /**
   * Handle a guessed answer and judge it to be right or wrong.
   *
   * Guesses could be sent here from multiple places:
   *  - The on-screen musical keyboard (KeyboardButtons component)
   *  - Keyboard input
   *
   * @param {Set} entries The names of the key(s) being guessed.
   */
  handleGuess(entry) {
    let keysDown = this.state.keysDown;

    // If there are multiple notes in this question, toggle this key in keysDown
    if (this.state.keys.length > 1) {
      if (keysDown.has(entry)) {
        // Key is being un-pressed
        keysDown.delete(entry);
      } else {
        // Key is being pressed
        keysDown.add(entry);
      }
    } else {
      // Clear keysDown and just add this key
      keysDown.clear();
      keysDown.add(entry);
    }

    // Save changed keysDown to state
    this.setState({ keysDown: keysDown });

    // Convert

    // If number of keysDown matches number of keys in this question, compare all notes
    // TODO: Since the on-screen keyboard is only one octave, this logic will fail if we allow chords containing two of the same note
    if (keysDown.size === this.state.keys.length) {
      // Convert keysDown to Teoria notes
      var notesDown = [];
      keysDown.forEach(key => {
        notesDown.push(Teoria.note(key));
      });

      // Loop over each note in the question, looking for a match in notesDown
      var allMatched = true;
      this.state.keys.forEach(note => {
        // Check against all the notes that are down
        var match = false;
        notesDown.forEach(noteDown => {
          let interval = Teoria.interval(note, noteDown);
          if (interval.semitones() % 12 == 0) {
            match = true;
          }
        });
        if (!match) {
          allMatched = false;
        }
      });

      if (allMatched) {
        this.correctGuess();
      } else {
        this.incorrectGuess();
      }
    }

    // // Convert keysDown keys (e.g. "d#", "g") to Teoria Notes
    // // TODO: Extract all entries
    // var note = Teoria.note(entry);
    //
    // // Compare entry with what's in state
    // let firstNote = this.state.keys[0]; // TODO: Multi-note handling
    // let interval = Teoria.interval(note, firstNote);
    // if (interval.semitones() % 12 == 0) { // Octave doesn't matter
    //   this.correctGuess();
    // } else {
    //   this.incorrectGuess();
    // }
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

    // Debug logging to troubleshoot occasional false judgments
    console.log("Guess was deemed incorrect!");
    console.log("State:", this.state);
  }

  render() {
    return (
      <Card className="rx-sight-reading-practice" style={{maxWidth: "600px", margin: "0 auto"}}>
        <CardTitle title="What note is shown below?" />
        <CardText>
          <SheetMusicView
            clef={this.state.clef}
            keySignature={this.state.keySignature}
            keys={this.state.keys}
          />
          <KeyboardButtons
            onEntry={this.handleGuess}
            style={{margin: "10px auto"}}
            showLabels={this.props.prefs["keyboardLabels"]}
            useFlats={this.state.flatKeyboardLabels}
            enableSound={true}
            keysDown={this.state.keysDown}
          />
          <FlatButton
            label="Skip"
            onTouchTap={this.newQuestion}
            style={{display: "block", margin: "40px auto 20px"}}
          />
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
      // {
      //   type: "checkbox",
      //   label: "Non-chordal clusters",
      //   pref: "types.clusters",
      //   default: false,
      // },
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
