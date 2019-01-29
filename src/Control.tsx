import * as React from 'react'
// import { Block } from './components/Block';
import { IGenerator } from './generators/Generator';

export interface IControlProps extends React.HTMLProps<HTMLButtonElement>{
  name: string
  g?: IGenerator
}

export class Control extends React.Component<IControlProps> {

  // private _block: Block | undefined;

  constructor(props: IControlProps) {
    super(props)

    // this._block = this.props.g!.blocks().get(this.props.name)

    // if (this._block) {
    //   this._block.setHandler('$control', this.props.children)
    // }
  }

  public render() {
    this.props.style
    return (
      <div style={this.props.style} >
        {this.props.children}
      </div>
    )
  }

  // private cloneChildren() {
  //   return React.Children.map(this.props.children, (child) => {
  //     return React.cloneElement(child as React.ReactElement<any>, this.props.style,
  //     null);
  //   });
  // }
}
