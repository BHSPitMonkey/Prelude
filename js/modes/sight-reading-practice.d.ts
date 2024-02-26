/**
 * Component providing the sight reading practice game (in entirety)
 */
declare class SightReadingPractice {
    constructor(props: any);
    nosleep: any;
    clefs: any[];
    types: any[];
    state: {
        clef: any;
        keySignature: any;
        keys: any[];
        flatKeyboardLabels: boolean;
    };
    notesOn: {};
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
        clef: any;
        keySignature: any;
        keys: any[];
        flatKeyboardLabels: boolean;
    };
    correctGuess(): void;
    incorrectGuess(): void;
    render(): any;
}
declare namespace SightReadingPractice {
    namespace contextTypes {
        let snackbar: any;
        let appbar: any;
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
export default SightReadingPractice;
