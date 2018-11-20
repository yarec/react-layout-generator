import * as React from 'react';
import { ReactLayoutProps } from '../../../src/ReactLayout';

import TableauStack from './TableauStack';
import Stock from './Stock';

interface TableauProps extends ReactLayoutProps {
  connect: (i: Tableau) => void;
}

export default class Tableau extends React.Component<TableauProps> {

  _tableauStack: Array<TableauStack> = [];

  constructor(props: TableauProps) {
    super(props);
  }

  connect = (i: TableauStack) => {
    this._tableauStack.push(i);
  }

  populate(stock: Stock) {
    this._tableauStack.forEach((stack) => {
      stack.populate(stock);
    })
  }

  render = () => {
    return (
      <>
        <TableauStack stack={1} g={this.props.g} connect={this.connect} />
        <TableauStack stack={2} g={this.props.g} connect={this.connect} />
        <TableauStack stack={3} g={this.props.g} connect={this.connect} />
        <TableauStack stack={4} g={this.props.g} connect={this.connect} />
        <TableauStack stack={5} g={this.props.g} connect={this.connect} />
        <TableauStack stack={6} g={this.props.g} connect={this.connect} />
        <TableauStack stack={7} g={this.props.g} connect={this.connect} />
      </>
    );
  }
}