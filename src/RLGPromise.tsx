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

interface IRLGPromiseProps extends React.HTMLProps<HTMLDivElement> {
  name: string;
  container?: IRect;
  block?: Block;
  edit?: EditOptions;
  debug?: DebugOptions;
  g?: IGenerator;
  context?: Map<string, any>;
}

export class RLGPromise extends React.Component<IRLGPromiseProps, {update: number}> {

  constructor(props: IRLGPromiseProps) {
    super(props)
    this.state = {update: 0}
  }

  public componentDidMount() {
    const c = this.props.context;
    if (c) {
      const p: IPromise = { update: this.update, content: undefined }
      c.set(this.props.name, p);
    }
  }

  public update = () => {
    this.setState({update: this.state.update});
  }

  public render() {
    console.log('Promise render');
    const c = this.props.context;
    if (c) {
      const p = c.get(this.props.name) as IPromise
      if (p && p.content && p.content.length === 1) {
        return (<span> {p.content[0]} </span>)
      }
    }
    return (<> {this.props.children} </> )
  }
}
