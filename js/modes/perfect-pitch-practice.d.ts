/**
 * Component providing the perfect pitch practice game (in entirety)
 */
declare class PerfectPitchPractice {
    constructor(props: any);
    state: {
        key: {
            key: any;
            modifier: any;
        };
    };
    /**
     * Generate a new question to ask and update state
     */
    newQuestion(): void;
    playSound(event: any, key: any): void;
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
    handleGuess(entry: string): void;
    componentDidMount(): void;
    /**
     * Handler for after we've been granted the MIDI access we requested at launch
     */
    onMidiAccessGranted(midi: any): void;
    r(arr: any): any;
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
    correctGuess(): void;
    incorrectGuess(): void;
    render(): any;
}
declare namespace PerfectPitchPractice {
    namespace contextTypes {
        let snackbar: any;
        let appbar: any;
        let synth: any;
    }
    let prefsDefinitions: {
        header: string;
        items: {
            type: string;
            label: string;
            pref: string;
            default: boolean;
        }[];
    }[];
}
export default PerfectPitchPractice;
