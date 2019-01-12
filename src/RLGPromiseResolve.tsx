import * as React from 'react';

import { Block } from './components/Block';
import { IGenerator } from './generators/Generator';
import { DebugOptions, EditOptions, IRect } from './types';

// interface IRLGAppProps {
//   name: string;
// }

interface IPromise {
  update: () => void;
  content: any;
}

interface IRLGPromiseResolveProps extends React.HTMLProps<HTMLDivElement> {
  name: string;
  jsx: string[];
  container?: IRect;
  block?: Block;
  edit?: EditOptions;
  debug?: DebugOptions;
  g?: IGenerator;
  context?: Map<string, any>;
}

export class RLGPromiseResolve extends React.Component<IRLGPromiseResolveProps> {

  constructor(props: IRLGPromiseResolveProps) {
    super(props)
  }

  public componentDidMount() {
    const c = this.props.context;
    console.log('RLGPromiseResolve');
    if (c) {
      const p = c.get(this.props.name) as IPromise
      if (p && p.update) {
        p.content = this.props.jsx;
        c.set(this.props.name, p);
        p.update();
        console.log('RLGPromiseResolve update');
      }
    }
  }

  public render() {
    return null
  }
}
