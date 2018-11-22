import * as React from 'react';

import { IUnit } from '../../../src/components/Layout';
import ReactLayout, { IReactLayoutProps } from '../../../src/ReactLayout';

import { cardWidth, foundationPosition } from './config';

import Stock from './Stock';

export interface IFoundationStackProps extends IReactLayoutProps {
  stack: number;
  connect: (i: FoundationStack) => void;
}

export default class FoundationStack extends React.Component<IFoundationStackProps> {

  private stack: string[] = [];

  constructor(props: IFoundationStackProps) {
    super(props);
  }

  public componentDidMount = () => {
    this.props.connect(this);
  }

  public populate(stock: Stock) {
    this.stack = [];
    for (let i = 1; i < this.props.stack; i++) {
      const card = stock.dealOne();
      if (card) {
        this.stack.push(card);
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
    return this.stack.map((name, i) => {
      return (
        <div
          key={`${name}${i}`}
          data-layout={{
            name,
            position: {
              units: { origin: { x: 0, y: 0 }, location: IUnit.percent, size: IUnit.percent },
              location: { x: foundationPosition.x + this.props.stack * cardWidth, y: foundationPosition.y },
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