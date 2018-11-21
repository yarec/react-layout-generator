import * as React from 'react';

import { IReactLayoutProps } from '../../../src/ReactLayout';
import Stock from './Stock';
import TableauStack from './TableauStack';

interface ITableauProps extends IReactLayoutProps {
  connect: (i: Tableau) => void;
}

export default class Tableau extends React.Component<ITableauProps> {

  private _tableauStack: TableauStack[] = [];

  constructor(props: ITableauProps) {
    super(props);
  }

  public connect = (i: TableauStack) => {
    this._tableauStack.push(i);
  }

  public populate(stock: Stock) {
    this._tableauStack.forEach((stack) => {
      stack.populate(stock);
    })
  }

  public render = () => {
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