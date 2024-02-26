import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { grey100, grey200, grey800, cyanA700, white } from 'material-ui/styles/colors';

// Private constants
const upperRow = ['c#', 'd#', 'f#', 'g#', 'a#'];
const upperRowFlats = ['d♭', 'e♭', 'g♭', 'a♭', 'b♭'];
const upperRowSharps = ['c♯', 'd♯', 'f♯', 'g♯', 'a♯'];
const lowerRow = ['c', 'd', 'e', 'f', 'g', 'a', 'b'];

// Component representing a single key
class Key extends React.Component {
  render() {
    var key = this.props.note;
    //var showLabel = this.props.showLabel;
    //var text = showLabel ? key : '';
    var accidental = (key.length > 1);
    var buttonWidth = "40px";
    var style = {
      width: buttonWidth,
      textTransform: "uppercase",
      height: accidental ? "70px" : "140px",
      background: accidental ? grey800 : grey200,
      color: accidental ? grey100 : grey800,
      border: "2px solid white",// + (accidental ? "#555" : "#CCC"),
      marginRight: "-2px",
      paddingTop: accidental ? "0" : "70px",
      zIndex: accidental ? "1" : "0"
    };
    if (this.props.held) {
      style.background = cyanA700;
      style.color = white;
    }
    if (key == 'd#') {
      style.marginRight = buttonWidth;
    }
    return <button onClick={this.props.onClick} style={style} key={key} data-key={key}>{this.props.label}</button>
  }
}

// Component representing an interactive piano keyboard
class KeyboardButtons extends React.Component {
  constructor(props) {
    super(props);

    // Prebind custom methods
    this.onButtonPress = this.onButtonPress.bind(this);
  }

  // Click handler for keys
  onButtonPress(event) {
    let key = event.target.getAttribute('data-key');

    // Report all currently-down key(s) to parent's callback
    this.props.onEntry(key);

    // Play sound (TODO: Unless key is going from down to up)
    if (this.props.enableSound) {
      this.context.synth.play(key, 0.25);
    }
  }

  render() {
    let rootStyle = Object.assign({
      position: "relative",
      width: "266px",
      height: "140px"
    }, this.props.style);
    let rows = [
      {
        notes: upperRow,
        labels: this.props.useFlats ? upperRowFlats : upperRowSharps,
        className: "rx-keyboard-buttons--accidentals",
        style: {position: "absolute", top: 0, left: "18px", width: "max-content", zIndex: 1},
      },
      {
        notes: lowerRow,
        labels: lowerRow,
        className: "rx-keyboard-buttons--naturals",
        style: {position: "absolute", top: 0, width: "max-content"},
      }
    ];
    return (
      <div className="rx-keyboard-buttons" style={rootStyle}>
        {rows.map(row => {
          return <div className={row.className} style={row.style}>
            {row.notes.map((note, i) => {
              let held = this.props.keysDown ? this.props.keysDown.has(note) : false;
              let label = this.props.showLabels ? row.labels[i] : '';
              return <Key note={note} onClick={this.onButtonPress} label={label} held={held} key={note} />;
            })}
          </div>;
        })}
      </div>
    )
  }
}
KeyboardButtons.contextTypes = {
  synth: React.PropTypes.object,
};
export default KeyboardButtons;
