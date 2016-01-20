import React from 'react';
import Card from 'material-ui/lib/card/card';
import CardTitle from 'material-ui/lib/card/card-title';
import CardText from 'material-ui/lib/card/card-text';
import CardHeader from 'material-ui/lib/card/card-header';
import CardMedia from 'material-ui/lib/card/card-media';
import HandIcon from 'material-ui/lib/svg-icons/action/pan-tool';
import Colors from 'material-ui/lib/styles/colors';

/**
 * Component providing the main/home screen
 */
export default class extends React.Component {
  render() {
    return (
      <Card style={{maxWidth: "600px", margin: "0 auto"}}>
        <CardTitle title="Welcome!" subtitle="Use the menu to the upper-left to get started."/>
      </Card>
    )
  }
}
