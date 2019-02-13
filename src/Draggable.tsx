import * as React from 'react'
import { IPosition } from './components/blockTypes'
import { IGenerator } from './generators/Generator'

export interface IDraggableProps extends React.HTMLProps<HTMLDivElement> {
  name: string
  g: IGenerator
}

export class Draggable extends React.Component<IDraggableProps> {
  constructor(props: IDraggableProps) {
    super(props)
  }

  componentDidMount() {
    const p: IPosition = {
      location: { left: 0, top: 0, width: 0, height: 0 }
    }
    const block = this.props.g.blocks().set(`${this.props.name}`, p, this.props.g)
    if (block) {
      block.setHandler(
        'dragImage',
        this.cloneChildren(.7)
      )
    }
  }

  render() {
    const children = this.cloneChildren(0)
    return <div style={this.props.style}>{children}</div>
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
