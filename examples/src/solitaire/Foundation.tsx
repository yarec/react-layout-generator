import * as React from 'react';
import { ReactLayoutProps } from '../../../src/ReactLayout';

import FoundationStack from './FoundationStack';

export interface FoundationProps {
  connect: (i: Foundation) => void;
}

export default class Foundation extends React.Component<ReactLayoutProps & FoundationProps> {
  _foundationStacks: Array<FoundationStack> = [];

  constructor(props: ReactLayoutProps & FoundationProps) {
    super(props);
  }

  componentDidMount = () => {
    this.props.connect(this);
  }

  connect = (i: FoundationStack) => {
    this._foundationStacks.push(i);
  }

  render() {
    return (
      <>
        <FoundationStack g={this.props.g} stack={1} connect={this.connect} />
        <FoundationStack g={this.props.g} stack={2} connect={this.connect} />
        <FoundationStack g={this.props.g} stack={3} connect={this.connect} />
        <FoundationStack g={this.props.g} stack={4} connect={this.connect} />
      </>
    )
  }
}