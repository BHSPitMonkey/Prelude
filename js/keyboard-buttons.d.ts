import React from 'react';
declare class KeyboardButtons extends React.Component {
    props: any;
    context: any;
    static contextTypes: {
        synth: any;
    };
    constructor(props: any);
    onButtonPress(event: any): void;
    render(): any;
}
export default KeyboardButtons;
