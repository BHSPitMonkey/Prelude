import React from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router'
import Card from 'material-ui/lib/card/card';
import CardTitle from 'material-ui/lib/card/card-title';
import CardText from 'material-ui/lib/card/card-text';
import CardHeader from 'material-ui/lib/card/card-header';
import Avatar from 'material-ui/lib/avatar';
import LightbulbIcon from 'material-ui/lib/svg-icons/action/lightbulb-outline';
import Colors from 'material-ui/lib/styles/colors';

/**
 * Component providing the main/home screen
 */
export default class extends React.Component {
  render() {
    let cardStyle = {maxWidth: "600px", margin: "0 auto 10px"};
    return (
      <div>
        <Card style={cardStyle}>
          <CardTitle title="Welcome!" subtitle="Use the menu to the upper-left to get started."/>
        </Card>
        <Card style={cardStyle}>
          <CardHeader
            title="Tip"
            subtitle="Connect a MIDI device"
            avatar={<Avatar icon={<LightbulbIcon />} color={Colors.white} backgroundColor={Colors.yellow600} />}
          />
          <CardText>
            You can connect your favorite MIDI instrument and use it to answer note identification challenges!
          </CardText>
        </Card>
        { /* TODO: Only display this tip where supported, and don't show it if user is already in webapp mode */ }
        <Card style={cardStyle}>
          <CardHeader
            title="Tip"
            subtitle="Add to home screen on mobile"
            avatar={<Avatar icon={<LightbulbIcon />} color={Colors.white} backgroundColor={Colors.yellow600} />}
          />
          <CardText>
            Open the Chrome menu and select "Add to Home Screen" to access the best full-screen experience for this web app!
          </CardText>
        </Card>
      </div>
    )
  }
}
