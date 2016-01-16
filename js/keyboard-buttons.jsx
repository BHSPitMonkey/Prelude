var React = require('react');
var ReactDOM = require('react-dom');

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
module.exports = KeyboardButtons;
