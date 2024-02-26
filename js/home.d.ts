import React from 'react';
/**
 * Component providing the main/home screen
 */
declare class Home extends React.Component {
    context: {
        appbar: (title: string, leftElement?: HTMLElement, rightElement?: HTMLElement) => void;
    };
    props: {
        location: {
            query: {
                [x: string]: string;
            };
        };
    };
    static contextTypes: {
        snackbar: any;
        appbar: any;
    };
    constructor(props: any);
    componentWillMount(): void;
    render(): any;
}
export default Home;
