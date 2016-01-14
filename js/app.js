/**
 * Top-level application component
 */
class MyApplication extends React.Component {
  render() {
    return (
      <div>
        <h1>MyApplication</h1>
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
    this.state = {keySignature: 'A', music: 'abcde'};

    // Prebind custom methods
    this.newQuestion = this.newQuestion.bind(this);
  }

  /**
   * Generate a new question to ask and update state
   */
  newQuestion() {
    this.setState({keySignature: 'Bb', music: 'defga'});
  }

  render() {
    return (
      <div className="rx-sight-reading-practice">
        <p><strong>What is being shown?</strong></p>
        <SheetMusicView keySignature={this.state.keySignature} music={this.state.music} />
        <button onClick={this.newQuestion}>Guess</button>
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
    // Prepare drawing objects and clear the canvas
    var canvas = ReactDOM.findDOMNode(this);
    var renderer = new Vex.Flow.Renderer(
      canvas,
      Vex.Flow.Renderer.Backends.CANVAS
    );
    var ctx = renderer.getContext();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set up and draw stave/clef/key
    var stave = new Vex.Flow.Stave(0, 0, canvas.width-1);
    stave.addClef("treble");
    var keySig = new Vex.Flow.KeySignature(this.props.keySignature);
        keySig.addToStave(stave);
    stave.setContext(ctx).draw();

    // Create the notes
    var notes = [
      // A C-Major chord.
      new Vex.Flow.StaveNote({ keys: ["c/4", "e/4", "g/4"], duration: "q" }),
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
      joinVoices([voice]).format([voice], (canvas.width-1)/2);

    // Render voice
    voice.draw(ctx, stave);
  }

  render() {
    return (
      <canvas className="rx-sheet-music-view">
        ♫ TODO: {this.props.music} ♫
      </canvas>
    );
  }
}

// Render top-level component to page
ReactDOM.render(
  <MyApplication />,
  document.getElementById('container')
);
