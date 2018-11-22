import * as React from 'react';

import { IReactLayoutProps } from '../../../src/ReactLayout';
import FoundationStack from './FoundationStack';



export interface IFoundationProps extends IReactLayoutProps {
  connect: (i: Foundation) => void;
}

export default class Foundation extends React.Component<IFoundationProps> {
  private foundationStacks: FoundationStack[] = [];

  constructor(props: IFoundationProps) {
    super(props);
  }

  public componentDidMount = () => {
    this.props.connect(this);
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
    this.foundationStacks.push(i);
  }

}