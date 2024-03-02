import React from 'react';
import NoSleep from 'nosleep';
import { PreferencesState, PreferenceGroup } from '../common/practice-intro';
type FreePlayProps = {
    prefs: PreferencesState;
};
/**
 * Component providing the free play mode
 */
export default class FreePlay extends React.Component {
    static contextTypes: any;
    static prefsDefinitions: PreferenceGroup[];
    context: {
        snackbar: (message: string, duration?: number) => void;
    };
    props: FreePlayProps;
    nosleep: NoSleep;
    state: {
        clef: 'bass' | 'alto' | 'treble' | 'grand';
        flatKeyboardLabels?: boolean;
        keysDown?: Set<number>;
    };
    notesOn: {
        [x: number]: true;
    };
    constructor(props: any);
    /**
     * We need to disable nosleep on unmount in case the user leaves the practice session by some other means than by
     * using the back button in the AppBar (e.g. by using their browser navigation)
     */
    componentWillUnmount(): void;
    componentDidMount(): void;
    /**
     * Handler for after we've been granted the MIDI access we requested at launch
     */
    onMidiAccessGranted(midi: any): void;
    /**
     * Handler for new MIDI devices connected after launch
     */
    onMidiStateChange(event: any): void;
    /**
     * Handler for when a new MIDI message arrives from an input port
     */
    onMidiMessage(message: any): void;
    /**
     * Handle a pressed key.
     *
     * Presses could be sent here from multiple places:
     *  - The on-screen musical keyboard (KeyboardButtons component)
     *  - Keyboard input
     *
     * @param {Set} entries The names of the key(s) being pressed.
     */
    handleKeyPress(entry: any): void;
    render(): React.JSX.Element;
}
export {};
