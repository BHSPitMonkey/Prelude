import React from 'react';
/**
 * Component providing the About screen
 */
declare class About extends React.Component {
    static contextTypes: {
        snackbar: any;
        appbar: any;
    };
    context: {
        appbar: (title: string, leftElement?: HTMLElement, rightElement?: HTMLElement) => void;
    };
    constructor(props: any);
    componentWillMount(): void;
    clearSettings(): void;
    render(): any;
}
export default About;
