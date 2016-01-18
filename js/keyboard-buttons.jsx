var React = require('react');
var ReactDOM = require('react-dom');
var RaisedButton = require('material-ui/lib/raised-button');
var Colors = require('material-ui/lib/styles/colors');

class KeyboardButtons extends React.Component {
  constructor(props) {
    super(props);

    // Prebind custom methods
    this.onButtonPress = this.onButtonPress.bind(this);
  }
  onButtonPress(event, arg2) {
    this.props.onEntry(event.target.getAttribute('data-key'));
  }
  renderKey(key) {
    var showLabels = true; // TODO: Make setting
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
module.exports = KeyboardButtons;
