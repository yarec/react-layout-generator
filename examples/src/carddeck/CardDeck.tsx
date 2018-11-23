import * as React from 'react';
import styled from 'styled-components';

import { IUnit, PositionRef } from '../../../src/components/Layout';
import RLGDynamic from '../../../src/generators/RLGDynamic';
import ReactLayout from '../../../src/ReactLayout';
import Deck from '../algos/Deck';

const Description = styled.p`
  font-family: Arial, Helvetica, sans-serif;
  word-break: normal;
  white-space: normal;
`;

interface ICardDeckProps {
  name?: string;
}

interface ICardDeckState {
  update: number;
}

export default class CardDeck extends React.Component<ICardDeckProps, ICardDeckState> {

  private _g = RLGDynamic('example.CardDeck');
  private _deck = new Deck();

  constructor(props: ICardDeckProps) {
    super(props)
    this.state = {update: 0};
  }

  public render() {
    return (
      <ReactLayout
        name={'example.cardDeck'}
        editLayout={true}
        g={this._g}
      >
        {this.createElements()}
        <button data-layout={{
          name: 'shuffle',
          position: {
            units: { origin: { x: 0, y: 0 }, location: IUnit.percent, size: IUnit.pixel },
            location: { x: 80, y: 80 },
            size: { width: 100, height: 24 }
          }
        }}
          onClick={this.shuffle}
        >
          Shuffle
        </button>
        <div data-layout={{
          name: 'instructions',
          position: {
            units: { origin: { x: 0, y: 0 }, location: IUnit.percent, size: IUnit.pixel },
            location: { x: 80, y: 10 },
            size: { width: 100, height: 150 }
          }
        }}
        >
          <Description>
            Use the mouse to drag the cards around.
          </Description>
        </div>
      </ReactLayout>
    );
  }

  private createElement = (card: string) => {
    const e = require(`../assets/cards/${card}.jpg`);

    return (
      <div
        key={card}
        data-layout={{
          name: card,
          position: {
            units: { origin: { x: 0, y: 0 }, location: IUnit.pixel, size: IUnit.pixel },
            location: { x: 25, y: 25 },
            edit: [{ ref: PositionRef.position }],
            size: { width: 100, height: 150 }
          }
        }} >
        <img width={100} height={150} src={e} />
      </div >
    )
  }

  private createElements = (): any[] => {
    const a: JSX.Element[] = [];
    this._deck.cards.forEach((card) => {
      a.push(this.createElement(card));
    })
    return a;
  }

  private shuffle = (event: React.MouseEvent<HTMLButtonElement>) => {
    this._deck.shuffle();
    this._g.clear();
    this.setState({update: this.state.update + 1});
  }
}
