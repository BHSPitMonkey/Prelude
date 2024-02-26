import React from 'react';
export default class extends React.Component {
    props: {
        text: string;
        name: string;
        defaultState: boolean;
        onSwitch: Function;
    };
    render(): any;
}
