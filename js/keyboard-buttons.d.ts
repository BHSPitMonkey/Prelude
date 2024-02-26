export default KeyboardButtons;
declare class KeyboardButtons {
    constructor(props: any);
    onButtonPress(event: any): void;
    render(): any;
}
declare namespace KeyboardButtons {
    namespace contextTypes {
        let synth: any;
    }
}
