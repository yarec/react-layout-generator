import * as React from 'react';

import RLGDynamic from '../../../src/generators/RLGDynamic';
import ReactLayout from '../../../src/ReactLayout';
import Deck from './Deck';

export default class CardDeck extends React.Component {

  private _g = RLGDynamic('rlg.CardDeck.example');

  public render() {

    return (
      <ReactLayout
        name={'reactLayout.content'}
        editLayout={true}
        g={this._g}
      >
        <Deck />
      </ReactLayout>
    );
  }
}
