import React, { ReactElement } from 'react';
/**
 * Wrapper around material-ui Card with some customizations
 */
export default class extends React.Component {
    props: {
        children?: Element | Element[] | ReactElement | ReactElement[];
        style?: React.CSSProperties;
    };
    render(): React.JSX.Element;
}
