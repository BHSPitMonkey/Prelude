import React from 'react';
import RaisedButton from 'material-ui/lib/raised-button';
import Colors from 'material-ui/lib/styles/colors';

class Key extends React.Component {
  render() {
    var key = this.props.note;
    var showLabel = this.props.showLabel;
    var text = showLabel ? key : '';
    var accidental = (key.length > 1);
    var buttonWidth = "40px";
    var style = {
      width: buttonWidth,
      textTransform: "uppercase",
      height: accidental ? "70px" : "140px",
      background: accidental ? Colors.grey800 : Colors.grey200,
      color: accidental ? Colors.grey100 : Colors.grey800,
      border: "2px solid white",// + (accidental ? "#555" : "#CCC"),
      marginRight: "-2px",
      paddingTop: accidental ? "0" : "70px",
      zIndex: accidental ? "1" : "0"
    };
    if (this.props.held) {
      style.background = Colors.cyanA700;
      style.color = Colors.white;
    }
    if (key == 'd#') {
      style.marginRight = buttonWidth;
    }
    return <button onClick={this.props.onClick} style={style} key={key} data-key={key}>{text}</button>
  }
}

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
    var upperRow = ['c#', 'd#', 'f#', 'g#', 'a#'];
    var lowerRow = ['c', 'd', 'e', 'f', 'g', 'a', 'b'];
    var rootStyle = Object.assign({
      position: "relative",
      width: "266px",
      height: "140px"
    }, this.props.style);
    return (
      <div className="rx-keyboard-buttons" style={rootStyle}>
        <div className="rx-keyboard-buttons--accidentals" style={{position: "absolute", top: 0, left: "18px", zIndex: 1}}>
          {upperRow.map(note => {
            let held = this.props.keysDown ? this.props.keysDown.has(note) : false;
            return <Key note={note} onClick={this.onButtonPress} showLabel={this.props.showLabels} held={held} key={note} />;
          })}
        </div>
        <div style={{position: "absolute", top: 0}}>
          {lowerRow.map(note => {
            let held = this.props.keysDown ? this.props.keysDown.has(note) : false;
            return <Key note={note} onClick={this.onButtonPress} showLabel={this.props.showLabels} held={held} key={note} />;
          })}
        </div>
      </div>
    )
  }
}
KeyboardButtons.contextTypes = {
  synth: React.PropTypes.object,
};
export default KeyboardButtons;
