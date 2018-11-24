import * as React from 'react';

import { IGenerator } from '../../../src/generators/Generator';
import { IReactLayoutProps } from '../../../src/ReactLayout';
import FoundationStack from './FoundationStack';

export interface IFoundationProps extends IReactLayoutProps {
  connect: (i: Foundation) => void;
  g: IGenerator;
}

export default class Foundation extends React.Component<IFoundationProps> {
  private _foundationStacks: FoundationStack[] = [];
  private _g: IGenerator;

  constructor(props: IFoundationProps) {
    super(props);
    this._g = this.props.g;
  }

  public componentDidMount = () => {
    this.props.connect(this);
  }

  public clear = () => {
    this._g.clear();
    this._foundationStacks.forEach((foundation) => {
      foundation.clear();
    });
  }

  public render() {
    return (
      <>
        <FoundationStack g={this.props.g} stack={1} connect={this.connect} />
        <FoundationStack g={this.props.g} stack={2} connect={this.connect} />
        <FoundationStack g={this.props.g} stack={3} connect={this.connect} />
        <FoundationStack g={this.props.g} stack={4} connect={this.connect} />
      </>
    )
  }

  private connect = (i: FoundationStack) => {
    this._foundationStacks.push(i);
  }

}