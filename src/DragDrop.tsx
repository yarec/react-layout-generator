import * as React from 'react'
import { Block } from './components/Block';
import { IGenerator } from './generators/Generator';

export interface IDragDropProps extends React.HTMLProps<HTMLButtonElement>{
  name: string
  drop: (data: string[]) => boolean
  canDrop: (data: string[]) => boolean
  endDrop: (data: string[]) => void
  dragStart?: (id: string) => string[]
  getDragJSX?: (data: string[]) => JSX.Element
  dragEnter?: (data: string[]) => void
  dragLeave?: (data: string[]) => void
  g: IGenerator
}

export class DragDrop extends React.Component<IDragDropProps> {

  private _block: Block | undefined;

  constructor(props: IDragDropProps) {
    super(props)

    this._block = this.props.g.blocks().get(this.props.name)

    if (this._block) {
      this._block.setHandler('drop', this.props.drop)
      this._block.setHandler('canDrop', this.props.canDrop)
      this._block.setHandler('endDrop', this.props.endDrop)
      this.props.dragStart && this._block.setHandler('dragStart', this.props.dragStart)
      this.props.getDragJSX && this._block.setHandler('getDragJSX', this.props.getDragJSX)
      this.props.dragEnter && this._block.setHandler('dragEnter', this.props.dragEnter)
      this.props.dragLeave && this._block.setHandler('dragLeave', this.props.dragLeave)
    }
  }

  public render() {
    return <div data-block={this.props.name} style={this.props.style}>
      {this.props.children}
      </div>
  }
}
