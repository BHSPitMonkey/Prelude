import React from 'react';
import ListItem from 'material-ui/lib/lists/list-item';
import Checkbox from 'material-ui/lib/checkbox';

export default class extends React.Component {
  render() {
    return (
      <ListItem
        primaryText={this.props.text}
        leftCheckbox={<Checkbox
          name={this.props.name}
          defaultChecked={this.props.defaultState}
          onCheck={this.props.onSwitch}
        />}
      />
    );
  }
}
