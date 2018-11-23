import * as React from 'react';

import { IUnit, PositionRef } from '../../../src/components/Layout';
import RLGDynamic from '../../../src/generators/RLGDynamic';
import ReactLayout from '../../../src/ReactLayout';
import Deck from '../algos/Deck'
import { cardHeight, cardWidth, stockPosition } from './config';

interface IStockProps {
  connect: (i: Stock) => void;
}

interface IStockState {
  update: number;
}

export default class Stock extends React.Component<IStockProps, IStockState> {

  private _g = RLGDynamic('example.solitaire.stock');
  private _deck: Deck = new Deck();

  constructor(props: IStockProps) {
    super(props);
    this.state = {
      update: 0
    }
    this._deck.reset();
    this._deck.shuffle();
  }

  public componentDidMount = () => {
    this.props.connect(this);
  }

  public shuffle = () => {
    this._deck.shuffle();
    this._g.clear();
    this.setState({ update: this.state.update + 1 });
  }

  public dealOne = () => {
    return this._deck.cards.pop();
  }

  public render = () => {
    return (
      <ReactLayout
        name={'example.solitaire.stock'}
        editLayout={true}
        g={this._g}
      >
        {this.createElements()}
      </ReactLayout>
    )
  }

  private createElement = (card: string) => {
    const e = require(`../assets/cards/${card}.jpg`);

    return (
      <div
        key={card}
        data-layout={{
          name: card,
          position: {
            units: { origin: { x: 0, y: 0 }, location: IUnit.percent, size: IUnit.percent },
            location: { x: 0, y: 0 },
            size: { width: 100, height: 100 }
          }
        }} >
        <img width={'100%'} height={'100%'} src={e} />
      </div >
    )
  }

  private createElements = () => {
    return this._deck.cards.map((card) => {
      return this.createElement(card);
    })
  }
}