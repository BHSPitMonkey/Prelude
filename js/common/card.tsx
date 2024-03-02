import React, { ReactElement } from 'react';
import Card from 'material-ui/Card/Card';

/**
 * Wrapper around material-ui Card with some customizations
 */
export default class extends React.Component {
  props: { children?: Element | Element[] | ReactElement | ReactElement[], style?: React.CSSProperties };
  render() {
    //var { children, ...other } = this.props;
    return (
      <Card style={{maxWidth: "600px", margin: "0 auto 10px"}} {...this.props} />
    )
  }
}
