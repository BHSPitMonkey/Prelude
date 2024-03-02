import React from 'react';
import CardHeader from 'material-ui/Card/CardHeader';
import FlatButton from 'material-ui/FlatButton';
import CardText from 'material-ui/Card/CardText';
import {List, ListItem} from 'material-ui/List';
import CodeIcon from 'material-ui/svg-icons/action/code';
import PersonIcon from 'material-ui/svg-icons/social/person';
import PropTypes from 'prop-types';
import OpenInNewIcon from 'material-ui/svg-icons/action/open-in-new';
import Card from './common/card';

/**
 * Component providing the About screen
 */
class About extends React.Component {
  static contextTypes: { snackbar: any; appbar: any; };
  context: { appbar: (title: string, leftElement?: Element, rightElement?: Element) => void };
  constructor(props) {
    super(props);

    // Prebind custom methods
    this.componentWillMount = this.componentWillMount.bind(this);
  }

  componentWillMount() {
    this.context.appbar("About");
  }

  clearSettings() {
    if (confirm("Clear all your custom settings and restore defaults?")) {
      localStorage.clear();
    }
  }

  render() {
    let linkDefs = [
      {
        text: "Source Code on GitHub",
        url: "https://github.com/BHSPitMonkey/Prelude",
        icon: <CodeIcon />
      },
      {
        text: "Stephen Eisenhauer's Homepage",
        url: "http://stepheneisenhauer.com",
        icon: <PersonIcon />
      },
    ];
    let buildString = "Build " + __BUILD__;
    return (
      <div>
        <Card style={{maxWidth: "600px", margin: "0 auto"}}>
          <CardHeader
            title="Prelude"
            subtitle={buildString}
            avatar="img/icon-square.svg"/>
            <CardText>
              <p>Prelude is a modern web application for helping you practice your musical abilities.</p>
              <p>The application was built by Stephen Eisenhauer using React, Material-UI, and VexFlow.</p>
            </CardText>
          <List>
            {
              linkDefs.map(function(item, i) {
                return (
                  <a href={item.url} target="_blank" style={{textDecoration: "none"}} key={i}>
                    <ListItem primaryText={item.text} leftIcon={item.icon} rightIcon={<OpenInNewIcon />} />
                  </a>
                );
              })
            }
          </List>
        </Card>
        <FlatButton label="Clear all settings" onTouchStart={this.clearSettings} style={{display: "block", margin: "40px auto 20px"}} />
      </div>
    )
  }
}
About.contextTypes = {
  snackbar: PropTypes.func,
  appbar: PropTypes.func,
};
export default About;
