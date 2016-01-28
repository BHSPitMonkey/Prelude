import React from 'react';
import RaisedButton from 'material-ui/lib/raised-button';
import Colors from 'material-ui/lib/styles/colors';
import Synth from './synth.js';

export default class extends React.Component {
  constructor(props) {
    super(props);

    this.synth = new Synth();

    // Prebind custom methods
    this.onButtonPress = this.onButtonPress.bind(this);
  }
  onButtonPress(event) {
    let key = event.target.getAttribute('data-key');
    this.props.onEntry(key);
    this.synth.play(key, 0.25);
  }
  renderKey(key) {
    var showLabels = this.props.showLabels;
    var text = showLabels ? key : '';
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
    if (key == 'd#') {
      style.marginRight = buttonWidth;
    }
    return <button onClick={this.onButtonPress} style={style} key={key} data-key={key}>{text}</button>
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
          {upperRow.map(this.renderKey.bind(this))}
        </div>
        <div style={{position: "absolute", top: 0}}>
          {lowerRow.map(this.renderKey.bind(this))}
        </div>
      </div>
    )
  }
}
