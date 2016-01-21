import React from 'react';
import Avatar from 'material-ui/lib/avatar';
import CardHeader from 'material-ui/lib/card/card-header';
import CardText from 'material-ui/lib/card/card-text';
import LightbulbIcon from 'material-ui/lib/svg-icons/action/lightbulb-outline';
import Colors from 'material-ui/lib/styles/colors';
import Card from './card.jsx';

/**
 * Special kind of Card for displaying tips on the home screen
 */
export default class extends React.Component {
  render() {
    return (
      <Card>
        <CardHeader
          title="Tip"
          subtitle={this.props.title}
          avatar={<Avatar icon={<LightbulbIcon />} color={Colors.white} backgroundColor={Colors.yellow600} />}
        />
        {this.props.children}
      </Card>
    )
  }
}
