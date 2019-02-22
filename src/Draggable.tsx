import * as React from 'react'
import { IDataLayout } from './components/blockTypes'
import { IGenerator } from './generators/Generator'
import { Block } from './components/Block';

export interface IDraggableProps extends React.HTMLProps<HTMLDivElement> {
  name: string
  g: IGenerator
}

export class Draggable extends React.Component<IDraggableProps> {
  private _block: Block
  

  constructor(props: IDraggableProps) {
    super(props)
  }

  componentDidMount() {
    const p: IDataLayout = {
      location: { left: 0, top: 0, width: 0, height: 0 }
    }
    this._block = this.props.g.blocks().set(`${this.props.name}`, p, this.props.g)
    if (this._block) {
      this._block.setData(
        'dragImage',
        this.dragImage
      )
    }
  }

  render() {
    const children = this.cloneChildren(0)
    return <div style={this.props.style}>{children}</div>
  }

  private dragImage = (ids: string[]) => {
    return this.cloneChildren(.7) 
  }

  private cloneChildren(transparent: number) {
    return React.Children.map(this.props.children, (child) => {

      return React.cloneElement(child as React.ReactElement<any>, {
        width: this.props.style!.width,
        height: this.props.style!.height
      }, null);
    });
  }
}
