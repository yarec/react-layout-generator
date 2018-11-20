import * as React from 'react';
import ReactLayout, { ReactLayoutProps } from '../../../src/ReactLayout';
import { IUnit } from '../../../src/components/Layout';

import Stock from './Stock';

export interface TableauStackProps extends ReactLayoutProps {
  stack: number;
  connect: (i: TableauStack) => void;
}

export default class TableauStack extends React.Component<TableauStackProps> {

  stack: Array<string> = [];

  constructor(props: TableauStackProps) {
    super(props);
  }

  componentDidMount = () => {
    this.props.connect(this);
  }

  populate(stock: Stock) {
    this.stack = [];
    let card;
    for (let i = 1; i < this.props.stack; i++) {
      if (card = stock.dealOne()) {
        this.stack.push(card);
      }
    }
  }

  path = (name: string) => {
    return require(`../assets/cards/${name}.jpg`)
  }

  createElements() {
    const height = 7.5;
    const width = 5;
    const visible = 2;
    return this.stack.map((name, i) => {
      <div
        key={`${name}${i}`}
        data-layout={{
          name: name,
          position: {
            units: { origin: { x: 0, y: 0 }, location: IUnit.percent, size: IUnit.percent },
            location: { x: 20 + this.props.stack * width, y: 20 + i * visible },
            size: { width: width, height: height }
          }
        }}
      >
        <img src={this.path(name)} />
      </div >
    })
  }

  render() {
    return (
      <ReactLayout g={this.props.g} >
        {this.createElements()}
      </ReactLayout>
    )
  }
}