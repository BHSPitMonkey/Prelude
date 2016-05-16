import React from 'react';
import {ListItem} from 'material-ui/List';
import Toggle from 'material-ui/Toggle';

export default class extends React.Component {
  render() {
    return (
      <ListItem
        primaryText={this.props.text}
        rightToggle={<Toggle
          name={this.props.name}
          defaultToggled={this.props.defaultState}
          onToggle={this.props.onSwitch}
        />}
      />
    );
  }
}
