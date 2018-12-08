import * as React from 'react';

import Layout from './components/Layout';
import { IGenerator } from './generators/Generator';
import { ILayoutParent } from './RLGPanel';
import { ISize } from './types';

interface IRLGUpdaterProps extends React.HTMLProps<HTMLDivElement> {
  viewport?: ISize;
  parent?: ILayoutParent;
  edit?: boolean;
  g?: IGenerator;
}

interface IRLGUpdaterState {
  update: number;
}

export default class RLGUpdater extends React.Component<IRLGUpdaterProps, IRLGUpdaterState> {

  private _computed: ISize = { width: 0, height: 0 };
  private _layout: Layout | undefined;

  constructor(props: IRLGUpdaterProps) {
    super(props);
    if (this.props.parent) {
      this._layout = this.props.g ? this.props.g.lookup(this.props.parent.name) : undefined
    }
  }

  public render() {
    return this.createElement(this.props.children);
  }

  protected createElement(children: React.ReactNode) {
    // if (this._layout) {
    //   return (
    //     <div
    //       ref={this.setSize}
    //     >
    //     {this.props.children}
    //     </div>
    //   )
    // };

    return null;
  }

  protected setSize = (element: HTMLElement) => {
    if (element && this._layout) {
      if (element.offsetWidth !== this._computed.width ||
        element.offsetHeight !== this._computed.height) {
        this._computed.width = element.offsetWidth;
        this._computed.height = element.offsetHeight;
        this._layout.updateSize({ width: this._computed.width, height: this._computed.height });
        setTimeout(() => { this.setState({ update: this.state.update + 1 }) }, 1);
      }
    }
  }
}
