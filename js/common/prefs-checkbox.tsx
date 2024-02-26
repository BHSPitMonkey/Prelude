import React from 'react';
import ListItem from 'material-ui/List/ListItem';
import Checkbox from 'material-ui/Checkbox';

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
