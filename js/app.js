/**
 * Top-level application component
 */
class MyApplication extends React.Component {
  render() {
    return (
      <div>
        <h1>Quiz</h1>
        <SightReadingPractice />
      </div>
    );
  }
}

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
  }

  getRandomState() {
    // Choose random values
    var r = function(arr) { return arr[Math.floor(Math.random() * arr.length)]; };
    var clef = r(['treble', 'bass']);
    var keySignatures = Object.keys(Vex.Flow.keySignature.keySpecs);
    var keys = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
    var octaves = (clef == 'bass') ? ['2', '3'] : ['4', '5'];

    return {
      clef: clef,
      keySignature: r(keySignatures),
      key: r(keys) + '/' + r(octaves)
    };
  }

  /**
   * Generate a new question to ask and update state
   */
  newQuestion() {
    this.setState(this.getRandomState());
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
    if (this.state.key[0] == entry.toLowerCase()) {
      console.log("Winner!");
      this.newQuestion();
    } else {
      console.log("Wrong!");
    }
  }

  render() {
    return (
      <div className="rx-sight-reading-practice">
        <p><strong>What note is shown below?</strong></p>
        <SheetMusicView clef={this.state.clef} keySignature={this.state.keySignature} keys={[this.state.key]} />
        <KeyboardButtons onEntry={this.handleGuess} />
        <button onClick={this.newQuestion}>Skip</button>
      </div>
    )
  }
}

class KeyboardButtons extends React.Component {
  constructor(props) {
    super(props);

    // Prebind custom methods
    this.onButtonPress = this.onButtonPress.bind(this);
  }
  onButtonPress(event) {
    this.props.onEntry(event.target.innerText);
  }
  render() {
    var notes = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    return (
      <div className="rx-keyboard-buttons">
        {notes.map(function(item) {
          return <button onClick={this.onButtonPress} key={item}>{item}</button>
        }.bind(this))}
      </div>
    )
  }
}

/**
 * Visual display of a snippet of sheet music (wraps an engraving library)
 */
class SheetMusicView extends React.Component {
  constructor(props) {
    super(props);

    // Prebind custom methods
    this.drawMusic = this.drawMusic.bind(this);
  }

  componentDidMount() {
    this.drawMusic();
  }

  componentDidUpdate(prevProps, prevState) {
    this.drawMusic();
  }

  /**
   * Redraw the contents of the canvas
   */
  drawMusic() {
    // Clear the canvas
    var container = ReactDOM.findDOMNode(this);
    while (container.lastChild) {
      container.removeChild(container.lastChild);
    }

    // Prepare drawing objects
    var renderer = new Vex.Flow.Renderer(
      container,
      Vex.Flow.Renderer.Backends.SVG
    );
    var ctx = renderer.getContext();
    ctx.resize(this.props.width, this.props.height);

    // Set up and draw stave/clef/key
    var stave = new Vex.Flow.Stave(0, 0, this.props.width-1);
    stave.addClef(this.props.clef);
    var keySig = new Vex.Flow.KeySignature(this.props.keySignature);
        keySig.addToStave(stave);
    stave.setContext(ctx).draw();

    // Create the notes
    var notes = [
      new Vex.Flow.StaveNote({ clef: this.props.clef, keys: this.props.keys, duration: "q" }),
    ];

    // Create a voice in 1/4
    var voice = new Vex.Flow.Voice({
      num_beats: 1,
      beat_value: 4,
      resolution: Vex.Flow.RESOLUTION
    });

    // Add notes to voice
    voice.addTickables(notes);

    // Format and justify the notes to 500 pixels
    var formatter = new Vex.Flow.Formatter().
      joinVoices([voice]).format([voice], (this.props.width-1)/2);

    // Render voice
    voice.draw(ctx, stave);
  }

  render() {
    return (
      <div className="rx-sheet-music-view"></div>
    );
  }
}
SheetMusicView.defaultProps = {
  width: 150,
  height: 150,
  clef: "treble"
};

// Render top-level component to page
ReactDOM.render(
  <MyApplication />,
  document.getElementById('container')
);
