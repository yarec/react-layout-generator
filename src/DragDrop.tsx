import * as React from 'react'
import { Block } from './components/Block';
import { IGenerator } from './generators/Generator';


/**
 * 
 */
export interface IDragDropProps extends React.HTMLProps<HTMLDivElement>{
  name: string
  /**
   * Performs the transfer of the data to a new container. Returns true if
   * successful.
   */
  drop: (data: string[]) => boolean
  /**
   * Fired whenever the draggable is over a drop container.
   * Test to see if this container can accept this data. Returns true if 
   * droppable.
   */
  canDrop: (data: string[]) => boolean
  /**
   * Fired at end drag. Calls the source container to notify it that the data has been 
   * transferred to another container.
   */
  endDrop: (data: string[]) => void
  /**
   * Fired during start drag. Returns the list of id that are to be dragged.
   */
  dragData?: (id: string) => string[]
  /**
   * Fired during start drag. Returns the JSX code representing the image to be dragged.
   */
  dragImage?: (data: string[]) => JSX.Element
  /**
   * Fired when the draggable enters a valid droppable container.
   */
  dragEnter?: () => void
  /**
   * Fired when the draggable leaves a valid droppable container.
   */
  dragLeave?: () => void
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
      this.props.dragData && this._block.setHandler('dragData', this.props.dragData)
      this.props.dragImage && this._block.setHandler('dragImage', this.props.dragImage)
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
