import * as React from 'react';
import { ISize } from './types';

interface IRLGPanelProps extends React.HTMLProps<HTMLDivElement> {
  viewport?: ISize;
}

interface IRLGPanelState {
  viewport: ISize;
}


export default class RLGPanel extends React.Component<IRLGPanelProps, IRLGPanelState> {
  constructor(props: IRLGPanelProps) {
    super(props);

    if (this.props.viewport) {
      this.state = {
        viewport: this.props.viewport
      };
    } else {
      this.state = {
        viewport: {width: 0, height: 0}
      };
    }
  }

  public componentWillReceiveProps(props: IRLGPanelProps) {
    if (props.viewport !== this.state.viewport) {
      if (props.viewport) {
        this.setState({
          viewport: props.viewport
        });
      }
    }
  }

  public render() {
    return (
      <div {...this.props}>
        {(this.props.children as (viewport: ISize) => JSX.Element)(this.state.viewport)}
      </div>
    );
  }
}