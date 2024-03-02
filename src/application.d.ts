import React from 'react';
import { Router } from 'react-router';
import Synth from './synth';
/**
 * Top-level application component
 */
declare class Application extends React.Component {
    state: {
        drawerOpen: boolean;
        snackbarOpen: boolean;
        snackbarMessage: string;
        snackbarAutoHideDuration: number;
        appBarTitle: string;
        appBarLeftElement: any;
        appBarRightElement: any;
    };
    menuItems: {
        Home: {
            route: string;
            icon: any;
        };
        "Sight Reading Practice": {
            route: string;
            icon: any;
        };
        "Perfect Pitch Practice": {
            route: string;
            icon: any;
        };
        "Free Play": {
            route: string;
            icon: any;
        };
        About: {
            route: string;
            icon: any;
        };
    };
    synth: Synth;
    context: {
        router: Router;
    };
    props: {
        children: any;
    };
    static contextTypes: {
        router: Router;
    };
    static childContextTypes: any;
    constructor(props: any);
    getChildContext(): {
        snackbar: any;
        appbar: any;
        synth: Synth;
    };
    componentDidMount(): void;
    toggleDrawer(): void;
    leftNavChange(e: any, key: any, payload: any): void;
    drawerMenuItemTouched(e: any): void;
    snackbarRequestClose(): void;
    displaySnackbar(message: any, duration: any): void;
    /**
     * Used in child contexts to update the app bar
     */
    updateAppBar(title: any, leftElement: any, rightElement: any): void;
    render(): React.JSX.Element;
}
export default Application;
