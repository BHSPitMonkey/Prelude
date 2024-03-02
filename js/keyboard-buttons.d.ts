import React, { CSSProperties, MouseEvent } from 'react';
declare class KeyboardButtons extends React.Component {
    props: {
        onEntry: Function;
        enableSound: boolean;
        keysDown: any;
        showLabels: boolean;
        useFlats: boolean;
        style: CSSProperties;
    };
    context: any;
    static contextTypes: {
        synth: any;
    };
    constructor(props: any);
    onButtonPress(event: MouseEvent<HTMLElement>): void;
    render(): React.JSX.Element;
}
export default KeyboardButtons;
