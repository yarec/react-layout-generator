import * as React from 'react'
import { Block, IPosition } from './components/Block';
import { IGenerator } from './generators/Generator';

export interface IDroppableProps extends React.HTMLProps<HTMLButtonElement>{
  name: string
  allowDrop: (block: Block[]) => boolean
  drop: (block: Block[]) => boolean
  canDrop: (data: any) => boolean
  g: IGenerator
}

export class Droppable extends React.Component<IDroppableProps> {

  private _block: Block;

  constructor(props: IDroppableProps) {
    super(props)

    const p: IPosition = {
      location: {x: 0, y: 0},
      size: {width: 0, height: 0}
    }

    this._block = this.props.g.blocks().set(this.props.name, p, this.props.g)

    this._block.setHandler('canDrop', this.props.canDrop)
  }

  public render() {
    return <div data-block={this.props.name}>
      {this.props.children}
      </div>
  }
}
