import React from 'react';
import Avatar from 'material-ui/Avatar';
import CardHeader from 'material-ui/Card/CardHeader';
import LightbulbIcon from 'material-ui/svg-icons/action/lightbulb-outline';
import { white, yellow600 } from 'material-ui/styles/colors';
import Card from './card';

/**
 * Special kind of Card for displaying tips on the home screen
 */
export default class extends React.Component {
  props: { children: any, title: string };
  render() {
    return (
      <Card>
        <CardHeader
          title="Tip"
          subtitle={this.props.title}
          avatar={<Avatar icon={<LightbulbIcon />} color={white} backgroundColor={yellow600} />}
          style={{paddingBottom:'0px'}}
        />
        {this.props.children}
      </Card>
    )
  }
}
