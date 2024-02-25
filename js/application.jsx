import React from 'react';
import { Router, Route, Link } from 'react-router'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { cyan700, cyan900 } from 'material-ui/styles/colors';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import Snackbar from 'material-ui/Snackbar';
import HomeIcon from 'material-ui/svg-icons/action/home';
import InfoIcon from 'material-ui/svg-icons/action/info';
import MusicNoteIcon from 'material-ui/svg-icons/image/music-note';
import HearingIcon from 'material-ui/svg-icons/av/hearing';
import PianoIcon from 'material-ui/svg-icons/av/play-circle-outline'
import Synth from './synth.ts';

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: cyan700,
    primary2Color: cyan900,
  },
});

/**
 * Top-level application component
 */
class Application extends React.Component {

  constructor(props) {
    super(props);

    // Default state
    this.state = {
      drawerOpen: false,
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
      "Free Play": { route: "/freePlay", icon: <PianoIcon /> },
      "About": { route: "/about", icon: <InfoIcon /> }
    };

    // Create a Synth for children to share, so that only one AudioContext gets used
    // (The browser/OS limits the number of these)
    this.synth = new Synth();

    // Prebind custom methods
    this.toggleDrawer = this.toggleDrawer.bind(this);
    this.drawerMenuItemTouched = this.drawerMenuItemTouched.bind(this);
    this.snackbarRequestClose = this.snackbarRequestClose.bind(this);
  }
  getChildContext() {
    return {
      snackbar: this.displaySnackbar.bind(this),
      appbar: this.updateAppBar.bind(this),
      synth: this.synth,
    };
  }
  componentDidMount() {
    // Register the serviceworker
    var snackbar = this.displaySnackbar.bind(this);
    if ('serviceWorker' in navigator) {
      // Your service-worker.js *must* be located at the top-level directory relative to your site.
      // It won't be able to control pages unless it's located at the same level or higher than them.
      // *Don't* register service worker file in, e.g., a scripts/ sub-directory!
      // See https://github.com/slightlyoff/ServiceWorker/issues/468
      navigator.serviceWorker.register('service-worker.js').then(function(reg) {
        // updatefound is fired if service-worker.js changes.
        reg.onupdatefound = function() {
          // The updatefound event implies that reg.installing is set; see
          // https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-container-updatefound-event
          var installingWorker = reg.installing;

          installingWorker.onstatechange = function() {
            switch (installingWorker.state) {
              case 'installed':
                if (navigator.serviceWorker.controller) {
                  // At this point, the old content will have been purged and the fresh content will
                  // have been added to the cache.
                  // It's the perfect time to display a "New content is available; please refresh."
                  // message in the page's interface.
                  snackbar("Updates are available! Refresh the page to see.", 10000);
                } else {
                  // At this point, everything has been precached.
                  // It's the perfect time to display a "Content is cached for offline use." message.
                  snackbar("Prelude is now ready to be used offline!", 4000);
                }
                break;

              case 'redundant':
                console.error('The installing service worker became redundant.');
                break;
            }
          };
        };
      }).catch(function(e) {
        console.error('Error during service worker registration:', e);
      });
    }
  }
  toggleDrawer() {
    console.log("Toggling drawerOpen");
    this.state.drawerOpen = !this.state.drawerOpen;
    this.setState(this.state);
  }
  leftNavChange(e, key, payload) {
    console.log("Change", e, key, payload);
  }
  drawerMenuItemTouched(e) {
    // Lookup the route from our menu config object based on the menu item text
    // (I can't seem to find any better way to do this with the MenuItem component,
    // at least without building my own MenuItem wrapper class)
    let text = e.target.textContent;
    let route = this.menuItems[text].route;
    this.setState({drawerOpen: false}); // Close the menu
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
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
        <AppBar
          title={this.state.appBarTitle}
          iconElementLeft={this.state.appBarLeftElement}
          iconElementRight={this.state.appBarRightElement}
          onLeftIconButtonTouchTap={this.toggleDrawer}
          style={{position: "fixed", top: 0, left: 0}}
        />
        <Drawer
          open={this.state.drawerOpen}
          onRequestChange={(open) => this.setState({drawerOpen: open})}
          docked={false}>
          {
            Object.keys(this.menuItems).map(function (text) {
              let item = this.menuItems[text];
              return <MenuItem onTouchTap={this.drawerMenuItemTouched} key={text} leftIcon={item.icon}>{text}</MenuItem>
            }.bind(this))
          }
        </Drawer>
        <div style={{padding: "74px 10px 10px 10px"}}>{this.props.children}</div>
        <Snackbar
          open={this.state.snackbarOpen}
          message={this.state.snackbarMessage}
          autoHideDuration={this.state.snackbarAutoHideDuration}
          onRequestClose={this.snackbarRequestClose}
        />
        </div>
      </MuiThemeProvider>
    );
  }
}
Application.contextTypes = {
  router: React.PropTypes.object
};
Application.childContextTypes = {
  snackbar: React.PropTypes.func,
  appbar: React.PropTypes.func,
  synth: React.PropTypes.object,
};
export default Application;
