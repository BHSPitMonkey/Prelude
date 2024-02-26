import React from 'react';
import Card from 'material-ui/Card/Card';

/**
 * Wrapper around material-ui Card with some customizations
 */
export default class extends React.Component {
  props: {};
  render() {
    //var { children, ...other } = this.props;
    return (
      <Card style={{maxWidth: "600px", margin: "0 auto 10px"}} {...this.props} />
    )
  }
}
