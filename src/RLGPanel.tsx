import * as React from 'react';
import { IGenerator } from './generators/Generator';
import { ISize } from './types';

export interface IRLPanelArgs {
  viewport: ISize;
  edit: boolean;
  g: IGenerator;
}

interface IRLGPanelProps extends React.HTMLProps<HTMLDivElement> {
  viewport?: ISize;
  edit?: boolean;
  g?: IGenerator;
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
    const args: IRLPanelArgs = {
      viewport: this.state.viewport, 
      edit: this.props.edit!, 
      g: this.props.g!
    }
    return (
      <div {...this.props}>
        {(this.props.children as (args: IRLPanelArgs) => JSX.Element)(
          args)}
      </div>
    );
  }
}