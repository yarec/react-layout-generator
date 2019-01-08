import * as React from 'react';

import Layout from './components/Layout';
import { IGenerator } from './generators/Generator';
import RLGLayout, { EditOptions } from './RLGLayout';
import { DebugOptions, IRect } from './types';

interface IRLGAppProps {
  name: string;
}

interface IRLGDynamicProps extends React.HTMLProps<HTMLDivElement> {
  jsx: JSX.Element[];
  container?: IRect;
  layout?: Layout;
  edit?: EditOptions;
  debug?: DebugOptions;
  g?: IGenerator;
  context?: Map<string, any>;
}

export default class RLGDynamic extends React.Component<IRLGDynamicProps, IRLGDynamicProps> {
  private _jsx: JSX.Element[] = [];

  constructor(props: IRLGDynamicProps) {
    super(props);

    this._jsx = this.props.jsx;
  }

  public componentDidMount() {
    const c = this.props.context;
    if (c) {
      c.set('test', this._jsx);
    }
  }

  public render() {
    return (
      <div {...this.props}>
        {this._jsx}
      </div>
    )

  }


}
