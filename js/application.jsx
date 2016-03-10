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
import Synth from './synth.js';

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

    // Create a Synth for children to share, so that only one AudioContext gets used
    // (The browser/OS limits the number of these)
    this.synth = new Synth();

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
    let text = e.target.textContent;
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
          style={{position: "fixed", top: 0, left: 0}}
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
        <div style={{padding: "74px 10px 10px 10px"}}>{this.props.children}</div>
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
  synth: React.PropTypes.object,
};
export default Application;
