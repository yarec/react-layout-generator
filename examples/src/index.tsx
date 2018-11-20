import * as React from 'react';
import { render } from 'react-dom';

import ReactLayout from '../../src/ReactLayout';


import DeskTop from './DeskTop/index';
import CardDeck from './CardDeck';
import Solitaire from './Solitaire';
import { IGenerator } from '../../src/generators/Generator';
import RLGColumns from '../../src/generators/RLGColumns';
import RLGDesktop from '../../src/generators/RLGDesktop';

export class Examples extends React.Component<{}, { app: any }> {

  g: IGenerator;
  n: IGenerator;

  constructor(props: any) {
    super(props);
    this.state = { app: undefined }

    this.g = RLGDesktop('');
    const p = this.g.params();

    // Set variables to 0 to hide section
    p.set('titleHeight', 80);
    p.set('headerHeight', 24);
    p.set('footerHeight', 0);
    p.set('leftSideWidth', 0);
    p.set('rightSideWidth', 0);

    // Show full width header and footer
    p.set('fullWidthHeaders', 1);

    this.n = RLGColumns('navbar');
    // const pn = this.n.params();
    // pn.set('')

  }

  navbar = () => {
    // return null;

    return (
      <ReactLayout name='navbar' g={this.n}>
        <div data-layout={{ name: '1' }} onClick={() => { this.setState({ app: DeskTop }) }} >
          <span>DeskTop</span>
        </div>
        <div data-layout={{ name: '2' }} onClick={() => { this.setState({ app: CardDeck }) }}>
          <span>CardDeck</span>
        </div>
        <div data-layout={{ name: '3' }} onClick={() => { this.setState({ app: Solitaire }) }}>
          <span>Solitaire</span>
        </div>
      </ReactLayout>
    );
  }

  render() {
    if (!this.state.app) {

      return (
        <ReactLayout name='desktop' g={this.g}>
          <div data-layout={{ name: 'title' }} >
            <h1>React Layout Generator Examples</h1>
          </div>
          <div data-layout={{ name: 'header' }}>
            {this.navbar()}
          </div>
          <div data-layout={{name: 'content'}}>
          <h1>Content</h1>
          </div>
        </ReactLayout >
      );
    }
    return <this.state.app />
  }
}

render(<Examples />, document.getElementById("root"));

