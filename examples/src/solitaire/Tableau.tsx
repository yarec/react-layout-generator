import * as React from 'react';

import { IGenerator } from '../../../src/generators/Generator';
import { IReactLayoutProps } from '../../../src/ReactLayout';
import Stock from './Stock';
import TableauStack from './TableauStack';

interface ITableauProps extends IReactLayoutProps {
  connect: (i: Tableau) => void;
  g: IGenerator;
}

export default class Tableau extends React.Component<ITableauProps> {

  private _tableauStack: TableauStack[] = [];
  private _g: IGenerator;

  constructor(props: ITableauProps) {
    super(props);
    this._g = this.props.g;
  }

  public componentDidMount = () => {
    this.props.connect(this);
  }

  public connect = (i: TableauStack) => {
    this._tableauStack.push(i);
  }

  public clear = () => {
    this._g.clear();
    this._tableauStack.forEach((tableau) => {
      tableau.clear();
    });
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