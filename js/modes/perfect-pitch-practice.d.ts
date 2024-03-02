import React from 'react';
import { PreferencesState, PreferenceGroup } from '../common/practice-intro';
import Synth from '../synth';
type PerfectPitchPracticeProps = {
    prefs: PreferencesState;
};
/**
 * Component providing the perfect pitch practice game (in entirety)
 */
export default class PerfectPitchPractice extends React.Component {
    static contextTypes: any;
    static prefsDefinitions: PreferenceGroup[];
    context: {
        snackbar: (message: string, duration?: number) => void;
        synth: Synth;
    };
    props: PerfectPitchPracticeProps;
    state: {
        key: any;
    };
    constructor(props: PerfectPitchPracticeProps);
    r(arr: any): any;
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
        key: {
            key: any;
            modifier: any;
        };
    };
    /**
     * Generate a new question to ask and update state
     */
    newQuestion(): void;
    playSound(event?: any, key?: any): void;
    /**
     * Handle a guessed answer and judge it to be right or wrong.
     *
     * Guesses should be sent here from multiple places:
     *  - The on-screen musical keyboard (KeyboardButtons component)
     *  - Keyboard input
     *  - Connected MIDI events
     *
     * @param {string} entry The name of the key being guessed.
     */
    handleGuess(entry: any): void;
    correctGuess(): void;
    incorrectGuess(): void;
    render(): React.JSX.Element;
}
export {};
