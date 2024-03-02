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
        appbar: (title: string, leftElement?: Element, rightElement?: Element) => void;
    };
    constructor(props: any);
    componentWillMount(): void;
    clearSettings(): void;
    render(): React.JSX.Element;
}
export default About;
