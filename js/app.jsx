import React from 'react';
import AppBar from 'material-ui/lib/app-bar';
import LeftNav from 'material-ui/lib/left-nav';
import MenuItem from 'material-ui/lib/menus/menu-item';
import Snackbar from 'material-ui/lib/snackbar';
import SightReadingPractice from './sight-reading-practice.jsx';

/**
 * Top-level application component
 */
class Application extends React.Component {
  constructor(props) {
    super(props);

    // Default state
    this.state = {
      leftNavOpen: false,
      snackbarOpen: false,
      snackbarMessage: "Hi! ^_^",
      snackbarAutoHideDuration: 1000
    };

    // Prebind custom methods
    this.toggleLeftNav = this.toggleLeftNav.bind(this);
    this.leftNavRequestChange = this.leftNavRequestChange.bind(this);
    this.snackbarRequestClose = this.snackbarRequestClose.bind(this);
  }
  getChildContext() {
    return {
      snackbar: this.displaySnackbar.bind(this)
    };
  }
  toggleLeftNav() {
    this.state.leftNavOpen = !this.state.leftNavOpen;
    this.setState(this.state);
  }
  leftNavRequestChange(open, reason) {
    this.setState({leftNavOpen: false});
  }
  snackbarRequestClose() {
    this.setState({snackbarOpen: false});
  }
  displaySnackbar(message, duration) {
    console.log("Type: ", typeof duration);
    this.setState({
      snackbarOpen: true,
      snackbarMessage: message,
      snackbarAutoHideDuration: (typeof duration !== "undefined") ? duration : 1000
    });
  }
  render() {
    return (
      <div>
        <AppBar
          title="Music Trainer"
          onLeftIconButtonTouchTap={this.toggleLeftNav}
          iconClassNameRight="muidocs-icon-navigation-expand-more"
        />
        <LeftNav
          open={this.state.leftNavOpen}
          onRequestChange={this.leftNavRequestChange}
          docked={false}>
          <MenuItem>Sight Reading Practice</MenuItem>
          <MenuItem>Settings</MenuItem>
          <MenuItem>About</MenuItem>
          <MenuItem disabled={true}>Hi!</MenuItem>
        </LeftNav>
        <SightReadingPractice />
        <Snackbar
          open={this.state.snackbarOpen}
          message={this.state.snackbarMessage}
          autoHideDuration={this.state.snackbarAutoHideDuration}
          onRequestClose={this.snackbarRequestClose}
        />
      </div>
    );
  }
}
Application.childContextTypes = {
  snackbar: React.PropTypes.func
};
export default Application;
