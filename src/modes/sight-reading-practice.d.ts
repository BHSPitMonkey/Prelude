import React from 'react';
import NoSleep from 'nosleep';
import { PreferencesState, PreferenceGroup } from '../common/practice-intro';
import Synth from '../synth';
type SightReadingPracticeProps = {
    prefs: PreferencesState;
};
/**
 * Component providing the sight reading practice game (in entirety)
 */
export default class SightReadingPractice extends React.Component {
    static contextTypes: any;
    static prefsDefinitions: PreferenceGroup[];
    clefs: string[];
    context: {
        snackbar: (message: string, duration?: number) => void;
        synth: Synth;
    };
    props: SightReadingPracticeProps;
    nosleep: NoSleep;
    notesOn: {
        [x: number]: true;
    };
    state: {
        clef: 'bass' | 'alto' | 'treble' | 'grand';
        flatKeyboardLabels: boolean;
        keys: any;
        keysDown?: any;
        keySignature: any;
    };
    types: string[];
    constructor(props: SightReadingPracticeProps);
    r(arr: any): any;
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
     * Randomly generate a new question and return a state object
     */
    getRandomState(): {
        clef: any;
        keySignature: any;
        keys: any[];
        flatKeyboardLabels: boolean;
    };
    /**
     * Generate a new question to ask and update state
     */
    newQuestion(): void;
    /**
     * Handle a guessed answer and judge it to be right or wrong.
     *
     * Guesses could be sent here from multiple places:
     *  - The on-screen musical keyboard (KeyboardButtons component)
     *  - Keyboard input
     *
     * @param {Set} entries The names of the key(s) being guessed.
     */
    handleGuess(entry: any): void;
    correctGuess(): void;
    incorrectGuess(): void;
    render(): React.JSX.Element;
}
export {};
