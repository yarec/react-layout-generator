import * as React from 'react';

import { IUnit } from '../../../src/components/Layout';
import ReactLayout, { IReactLayoutProps } from '../../../src/ReactLayout';
import { cardWidth, tableauPosition } from './config';
import Stock from './Stock';

export interface ITableauStackProps extends IReactLayoutProps {
  stack: number;
  connect: (i: TableauStack) => void;
}

export default class TableauStack extends React.Component<ITableauStackProps> {

  private _stack: string[] = [];

  constructor(props: ITableauStackProps) {
    super(props);
  }

  public componentDidMount = () => {
    this.props.connect(this);
  }

  public populate(stock: Stock) {
    this._stack = [];
    for (let i = 1; i < this.props.stack; i++) {
      const card = stock.dealOne();
      if (card) {
        this._stack.push(card);
      }
    }
  }

  public render() {
    return (
      <ReactLayout g={this.props.g} >
        {this.createElements()}
      </ReactLayout>
    )
  }

  private path = (name: string) => {
    return require(`../assets/cards/${name}.jpg`)
  }

  private createElements() {
    const height = 7.5;
    const width = 5;
    const visible = 2;
    return this._stack.map((name, i) => {
      return (
      <div
        key={`${name}${i}`}
        data-layout={{
          name,
          position: {
            units: { origin: { x: 0, y: 0 }, location: IUnit.percent, size: IUnit.percent },
            location: { x: tableauPosition.x + this.props.stack * cardWidth, y: tableauPosition.y + i * visible },
            size: { width, height }
          }
        }}
      >
        <img src={this.path(name)} />
      </div >
      );
    })
  }
}