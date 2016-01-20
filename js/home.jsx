import React from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router'
import Card from 'material-ui/lib/card/card';
import CardTitle from 'material-ui/lib/card/card-title';
import CardText from 'material-ui/lib/card/card-text';

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
