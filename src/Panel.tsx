import * as React from 'react';

import { Block } from './components/Block';
import { IGenerator } from './generators/Generator';
import { DebugOptions, IRect, ServiceOptions } from './types';

export interface IMetaDataArgs {
  container: IRect;
  block: Block;
  service: ServiceOptions;
  debug: DebugOptions;
  g: IGenerator;
  context: Map<string, any>;
  // update: () => void;
}

// props must be optional to allow them to be injected
interface IPanelProps extends React.HTMLProps<HTMLDivElement> {
  container?: IRect;
  block?: Block;
  service?: ServiceOptions;
  debug?: DebugOptions;
  g?: IGenerator;
  context?: Map<string, any>;
  // update?: () => void;
}

interface IPanelState {
  rect: IRect;
}

export class Panel extends React.Component<IPanelProps, IPanelState> {
  constructor(props: IPanelProps) {
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

  public componentWillReceiveProps(props: IPanelProps) {
    if (props.container !== this.state.rect) {
      if (props.container) {
        this.setState({
          rect: props.container
        });
      }
    }
  }

  public render() {
    const args: IMetaDataArgs = {
      container: this.state.rect,
      block: this.props.block!,
      service: this.props.service!,
      debug: this.props.debug!,
      g: this.props.g!,
      context: this.props.context!,
      // update: this.props.update!
    }

    // React.Children.only(this.props.children);

    return (
      <div style={this.props.style}>
        {(this.props.children as (args: IMetaDataArgs) => JSX.Element)(
          args)}
      </div>
    );
  }
}