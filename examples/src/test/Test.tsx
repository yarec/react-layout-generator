import * as React from 'react';

export default class Test extends React.Component {
  public render() {
    console.log('Test', this.props);
    return (
      // tslint:disable-next-line:no-string-literal
      <div style={this.props['style'] }>
        <span>Test</span>
      </div>
    ); 
  }
}



