import * as React from 'react'
import { IPosition } from './components/Block'
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
      location: { x: 0, y: 0 },
      size: { width: 0, height: 0 }
    }
    const block = this.props.g.blocks().set(`${this.props.name}`, p, this.props.g)
    if (block) {
      block.setHandler(
        'dragJSX',
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
        height: this.props.style!.height,
        background: `rgba(0, 0, 0, ${transparent})`,
      }, null);
    });
  }
}
