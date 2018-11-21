import * as React from 'react';

import RLGColumns from '../../src/generators/RLGColumns'
import ReactLayout from '../../src/ReactLayout'

export default class NavBar extends React.Component {
  private n = RLGColumns('navbar');
  public render() {

    return (
      <ReactLayout name='navbar' g={this.n}>
        <div data-layout={{ name: '1' }} >
          <span>DeskTop</span>
        </div>
        <div data-layout={{ name: '2' }}>
          <span>CardDeck</span>
        </div>
        <div data-layout={{ name: '3' }} >
            <span>Solitaire</span>
          </div>
      </ReactLayout>
    );
  }
}