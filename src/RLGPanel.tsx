import * as React from 'react';
import Block from './components/Block';
import { IGenerator } from './generators/Generator';
import { DebugOptions, EditOptions, IRect } from './types';

export interface IRLGPanelArgs {
  container: IRect;
  block: Block;
  edit: EditOptions;
  debug: DebugOptions;
  g: IGenerator;
  context: Map<string,any>;
  // update: () => void;
}

// props must be optional to allow them to be injected
interface IRLGPanelProps extends React.HTMLProps<HTMLDivElement> {
  container?: IRect;
  block?: Block;
  edit?: EditOptions;
  debug?: DebugOptions;
  g?: IGenerator;
  context?: Map<string,any>;
  // update?: () => void;
}

interface IRLGPanelState {
  rect: IRect;
}

export class RLGPanel extends React.Component<IRLGPanelProps, IRLGPanelState> {
  constructor(props: IRLGPanelProps) {
    super(props);

    if (this.props.container) {
      this.state = {
        rect: this.props.container
      };
    } else {
      this.state = {
        rect: { x: 0, y: 0, width: 0, height: 0 }
      };
    }
  }

  public componentWillReceiveProps(props: IRLGPanelProps) {
    if (props.container !== this.state.rect) {
      if (props.container) {
        this.setState({
          rect: props.container
        });
      }
    }
  }

  public render() {
    const args: IRLGPanelArgs = {
      container: this.state.rect,
      block: this.props.block!,
      edit: this.props.edit!,
      debug: this.props.debug!,
      g: this.props.g!,
      context: this.props.context!,
      // update: this.props.update!
    }

    // React.Children.only(this.props.children);

    return (
      <div style={this.props.style}>
        {(this.props.children as (args: IRLGPanelArgs) => JSX.Element) (
          args)}
      </div>
    );
  }
}