import React, { ReactElement } from 'react';
export type PreferenceItem = {
    type: string;
    label: string;
    pref: string;
    default: boolean;
};
export type PreferenceGroup = {
    header: string;
    items: PreferenceItem[];
};
export type PreferencesState = {
    [x: string]: any;
};
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
        component: React.ComponentType<{
            prefs: PreferencesState;
        }>;
        title: string;
        prefDefs: PreferenceGroup[];
        prefsNamespace: string;
    };
    state: {
        started: boolean;
        prefs: PreferencesState;
    };
    context: {
        appbar: (title: string, leftElement?: Element | ReactElement, rightElement?: Element | ReactElement) => void;
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
    render(): React.JSX.Element;
}
export default PracticeIntro;
