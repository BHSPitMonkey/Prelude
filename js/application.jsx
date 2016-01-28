import React from 'react';
import { Router, Route, Link } from 'react-router'
import AppBar from 'material-ui/lib/app-bar';
import LeftNav from 'material-ui/lib/left-nav';
import MenuItem from 'material-ui/lib/menus/menu-item';
import Snackbar from 'material-ui/lib/snackbar';
import HomeIcon from 'material-ui/lib/svg-icons/action/home';
import InfoIcon from 'material-ui/lib/svg-icons/action/info';
import MusicNoteIcon from 'material-ui/lib/svg-icons/image/music-note';
import HearingIcon from 'material-ui/lib/svg-icons/av/hearing';

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
      snackbarAutoHideDuration: 1000,
      appBarTitle: "Prelude",
      appBarLeftElement: null,
      appBarRightElement: null,
    };

    // Menu items to routes map
    this.menuItems = {
      "Home": { route: "/", icon: <HomeIcon /> },
      "Sight Reading Practice": { route: "/sightReading", icon: <MusicNoteIcon /> },
      "Perfect Pitch Practice": { route: "/perfectPitch", icon: <HearingIcon /> },
      "About": { route: "/about", icon: <InfoIcon /> }
    };

    // Prebind custom methods
    this.toggleLeftNav = this.toggleLeftNav.bind(this);
    this.leftNavRequestChange = this.leftNavRequestChange.bind(this);
    this.leftNavMenuItemTouched = this.leftNavMenuItemTouched.bind(this);
    this.snackbarRequestClose = this.snackbarRequestClose.bind(this);
  }
  getChildContext() {
    return {
      snackbar: this.displaySnackbar.bind(this),
      appbar: this.updateAppBar.bind(this),
    };
  }
  toggleLeftNav() {
    this.state.leftNavOpen = !this.state.leftNavOpen;
    this.setState(this.state);
  }
  leftNavRequestChange(open, reason) {
    this.setState({leftNavOpen: false});
  }
  leftNavChange(e, key, payload) {
    console.log("Change", e, key, payload);
  }
  leftNavMenuItemTouched(e) {
    // Lookup the route from our menu config object based on the menu item text
    // (I can't seem to find any better way to do this with the MenuItem component,
    // at least without building my own MenuItem wrapper class)
    let text = e.target.innerText;
    let route = this.menuItems[text].route;
    this.setState({leftNavOpen: false}); // Close the menu
    this.context.router.push(route); // Go to the route
  }
  snackbarRequestClose() {
    this.setState({snackbarOpen: false});
  }
  displaySnackbar(message, duration) {
    this.setState({
      snackbarOpen: true,
      snackbarMessage: message,
      snackbarAutoHideDuration: (typeof duration !== "undefined") ? duration : 1000
    });
  }
  /**
   * Used in child contexts to update the app bar
   */
  updateAppBar(title, leftElement, rightElement) {
    this.setState({
      appBarTitle: title,
      appBarLeftElement: leftElement,
      appBarRightElement: rightElement,
    });
  }
  render() {
    return (
      <div>
        <AppBar
          title={this.state.appBarTitle}
          iconElementLeft={this.state.appBarLeftElement}
          iconElementRight={this.state.appBarRightElement}
          onLeftIconButtonTouchTap={this.toggleLeftNav}
        />
        <LeftNav
          open={this.state.leftNavOpen}
          onRequestChange={this.leftNavRequestChange}
          docked={false}>
          {
            Object.keys(this.menuItems).map(function (text) {
              let item = this.menuItems[text];
              return <MenuItem onTouchTap={this.leftNavMenuItemTouched} key={text} leftIcon={item.icon}>{text}</MenuItem>
            }.bind(this))
          }
        </LeftNav>
        <div style={{padding: "10px"}}>{this.props.children}</div>
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
Application.contextTypes = {
  router: React.PropTypes.object
};
Application.childContextTypes = {
  snackbar: React.PropTypes.func,
  appbar: React.PropTypes.func,
};
export default Application;
