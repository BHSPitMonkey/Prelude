/**
 * Component providing the free play mode
 */
declare class FreePlay {
    constructor(props: any);
    nosleep: any;
    state: {
        clef: string;
    };
    notesOn: {};
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
    render(): any;
}
declare namespace FreePlay {
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
export default FreePlay;
