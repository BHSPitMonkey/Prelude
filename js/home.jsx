import React from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router'
import CardTitle from 'material-ui/lib/card/card-title';
import CardText from 'material-ui/lib/card/card-text';
import CardHeader from 'material-ui/lib/card/card-header';
import Card from './common/card.jsx';
import TipCard from './common/tip-card.jsx';

/**
 * Component providing the main/home screen
 */
class Home extends React.Component {
  constructor(props) {
    super(props);

    // Prebind custom methods
    this.componentWillMount = this.componentWillMount.bind(this);
  }
  componentWillMount() {
    this.context.appbar("Prelude");
  }
  render() {
    // Logic behind display of Add To Home Screen cards
    let addToHomeCard = null;
    let { query } = this.props.location;
    if (window.navigator.standalone !== undefined) {
      // Assume Safari for iOS
      if (window.navigator.standalone === false) {
        addToHomeCard = (
          <TipCard title="Add to home screen">
            <CardText>
              Tap the Share icon below (<img src="img/ios-share-icon.svg" width="16" height="16" />) and choose "Add to Home Screen" to get the best full-screen experience!
            </CardText>
          </TipCard>
        );
      } else {
        addToHomeCard = (
          <Card>
            <CardText>Thanks for adding Prelude to your home screen!</CardText>
          </Card>
        );
      }
    } else {
      // Assume Chrome for Android
      if (query.homescreen == "1") {
        addToHomeCard = (
          <Card>
            <CardText>Thanks for adding Prelude to your home screen!</CardText>
          </Card>
        );
      } else {
        addToHomeCard = (
          <TipCard title="Add to home screen">
            <CardText>
              Open the Chrome menu and select "Add to Home Screen" to get the best full-screen experience!
            </CardText>
          </TipCard>
        );
      }
    }

    return (
      <div>
        <Card>
          <CardTitle title="Welcome!" subtitle="Use the menu to the upper-left to get started."/>
        </Card>
        <TipCard title="Connect a MIDI device">
          <CardText>
            You can connect your favorite MIDI instrument and use it to answer note identification challenges!
          </CardText>
        </TipCard>
        { addToHomeCard }
      </div>
    )
  }
}
Home.contextTypes = {
  snackbar: React.PropTypes.func,
  appbar: React.PropTypes.func,
};
export default Home;
