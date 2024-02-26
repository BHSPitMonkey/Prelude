import React from 'react';
/**
 * Wrapper component for practice modes, containing general functionality for
 * displaying an initial options screen with a "start" button to begin an
 * exercise.
 *
 * See SightReadingPracticeIntro and PerfectPitchPracticeIntro for examples of
 * how to use.
 */
declare class PracticeIntro extends React.Component {
    props: {
        component: React.Component;
        title: string;
        prefDefs: {
            header: string;
            items: {
                type: string;
                label: string;
                pref: string;
                default: boolean;
            }[];
        }[];
        prefsNamespace: string;
    };
    state: {
        started: boolean;
        prefs: any;
    };
    context: {
        appbar: (title: string, leftElement?: HTMLElement, rightElement?: HTMLElement) => void;
    };
    static contextTypes: {
        snackbar: any;
        appbar: any;
    };
    constructor(props: any);
    /**
     * Save the prefs currently in the state into localStorage
     */
    persistPrefs(): void;
    /**
     * Overridden setState which persists prefs changes to localStorage
     */
    setState(changes: any): void;
    componentWillMount(): void;
    /**
     * Begin the practice session
     * TODO: Possibly do this using routing in the future
     * TODO: If we use routing, maybe pass the options as query params in the URL (would allow deep-linking to specific modes)
     */
    start(): void;
    /**
     * End the practice session and return to the intro/prefs screen
     */
    end(): void;
    /**
     * Handler for all toggle switches and checkboxes
     */
    onToggle(e: any, enabled: any): void;
    render(): any;
}
export default PracticeIntro;
