var React = require('react');
var ReactDOM = require('react-dom');
var SheetMusicView = require('./sheet-music-view.jsx');
var KeyboardButtons = require('./keyboard-buttons.jsx');
var RaisedButton = require('material-ui/lib/raised-button');
var Card = require('material-ui/lib/card/card');
var CardTitle = require('material-ui/lib/card/card-title');
var CardText = require('material-ui/lib/card/card-text');

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

  componentDidMount() {
    // Subscribe to MIDI (and keyboard?) events and process them as guesses

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
      <Card className="rx-sight-reading-practice">
        <CardTitle title="What note is shown below?" />
        <CardText>
          <SheetMusicView clef={this.state.clef} keySignature={this.state.keySignature} keys={[this.state.key]} />
          <KeyboardButtons onEntry={this.handleGuess} />
          <button onClick={this.newQuestion}>Skip</button>
          <div><RaisedButton label="Skip" onTouchTap={this.newQuestion} /></div>
        </CardText>
      </Card>
    )
  }
}
module.exports = SightReadingPractice;
