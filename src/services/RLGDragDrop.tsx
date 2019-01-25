import * as React from 'react'

import { DebugOptions, IPoint, IRect } from '../types'
// import { clone } from '../utils'
import { IService, IServiceProps, IUndo } from './Service'

/**
 * internal use only
 * @ignore
 */
interface IServiceLayoutState {
  activateDrag: boolean
  contextMenu: boolean
}

/**
 * internal use only
 * @ignore
 */
export class RLGDragDrop
  extends React.Component<IServiceProps, IServiceLayoutState>
  implements IService {
  public _startRect: IRect
  public _startOrigin: IPoint

  protected _debug: DebugOptions = DebugOptions.none

  protected _ctrlKey: boolean = false
  protected _altKey: boolean = false
  protected _menuLocation: IPoint

  private _jsx: JSX.Element

  constructor(props: IServiceProps) {
    super(props)
    this._startOrigin = { x: 0, y: 0 }
    this._menuLocation = { x: 0, y: 0 }
    this.state = { activateDrag: false, contextMenu: false }

    if (props.debug) {
      this._debug = props.debug
    }
  }

  componentDidMount() {
    // document.addEventListener('mousedown', this.onHtmlMouseDown)
  }

  public componentWillUnmount() {
    // document.addEventListener('mousedown', this.onHtmlMouseDown)
    this.removeEventListeners()
  }

  public addEventListeners = () => {
    document.addEventListener('mouseup', this.onHtmlMouseUp)
    document.addEventListener('mousemove', this.onHtmlMouseMove)
  }

  public removeEventListeners = () => {
    document.removeEventListener('mouseup', this.onHtmlMouseUp)
    document.removeEventListener('mousemove', this.onHtmlMouseMove)
  }

  public render = () => {
    return (
      <div
        id={'dnd'}
        style={{
          background: 'transparent',
          position: 'absolute',
          width: this.props.boundary.width,
          height: this.props.boundary.height
        }}
        onMouseDown={this.onMouseDown}
      >
        {this._jsx}
      </div>
    )
  }

  public hideMenu = () => {
    this.setState({ contextMenu: false })
  }

  // public initUpdate(x: number, y: number) {
  //   this._startOrigin = { x, y }
  //   const r = this.block.rect()
  //   this._handle = this.props.edit.updateHandle!(r)
  //   this._startRect = clone(this.props.handle)
  //   console.log(`initUpdate ${r.y + r.height} ${this._handle.y}`)
  // }
  // public moveUpdate(x: number, y: number) {
  //   let deltaX = x - this._startOrigin.x
  //   let deltaY = y - this._startOrigin.y

  //   if (this._ctrlKey) {
  //     if (Math.abs(deltaX) > Math.abs(deltaY)) {
  //       deltaY = 0
  //     } else {
  //       deltaX = 0
  //     }
  //   }

  //   if (this._block && (deltaX || deltaY)) {
  //     // 1 Extend
  //     const r: IRect = this._block.rect()
  //     const ur: IRect = {
  //       x: r.x + deltaX,
  //       y: r.y + deltaY,
  //       width: r.width,
  //       height: r.height
  //     }

  //     // 2 Pin
  //     if (ur.x < this.props.boundary.x) {
  //       ur.x = this.props.boundary.x
  //     }

  //     if (ur.x + ur.width > this.props.boundary.x + this.props.boundary.width) {
  //       ur.x = this.props.boundary.x + this.props.boundary.width - ur.width
  //     }

  //     if (ur.y < this.props.boundary.y) {
  //       ur.y = this.props.boundary.y
  //     }

  //     if (
  //       ur.y + ur.height >
  //       this.props.boundary.y + this.props.boundary.height
  //     ) {
  //       ur.y = this.props.boundary.y + this.props.boundary.height - ur.height
  //     }

  //     // 3 Make live

  //     // tslint:disable-next-line:no-bitwise
  //     if (this.props.debug && this.props.debug & DebugOptions.trace) {
  //       const name = this._block.name
  //       console.log(
  //         `DragDrop update location ${name} (x: ${r.x}, y: ${r.y}) to (x: ${
  //           ur.x
  //         } y: ${ur.y})`
  //       )
  //     }

  //     this._block.update(
  //       { x: ur.x, y: ur.y },
  //       { width: ur.width, height: ur.height }
  //     )

  //     // update params if needed
  //     if (this.props.edit.updateParam) {
  //       const p = this.props.edit.updateParam(
  //         ur,
  //         this.props.edit,
  //         this.props.block
  //       )
  //       if (p) {
  //         this.props.block.generator.params().set(p.name, p.value)
  //       }
  //     }

  //     // 4 Update handle
  //     this._handle = this.props.edit.updateHandle!(ur)

  //     this.props.onUpdate()
  //   }
  // }

  public redo = () => {
    // TODO
  }

  public undo = () => {
    // TODO
    console.log('undo')
  }

  public push = (): IUndo => {
    // this goes on the undo/redo stack
    // the editor is stores the state needed
    // or it will be added to IUndo
    return { editor: this }
  }

  public onMouseDown = (event: React.MouseEvent) => {
    let element = document.elementFromPoint(event.clientX, event.clientY)
    if (!element) {
      return
    }

    // Is it draggable?
    function findAncestor(element: Element) {
      if (element.hasAttribute('draggable')) {
        return element
      }
      let el: Element | null = element
      while ((el = el.parentElement) && !el.hasAttribute('draggable'));
      return el
    }
    element = findAncestor(element)
    if (!element) {
      return
    }

    // Clone element and wrap in a <div data-layout
    this._jsx = <>{element}</>
    if (!element.hasAttribute('data-layout')) {
      this._jsx = <div data-layout={{}}>{element}</div>
    }

    if (this._debug & DebugOptions.mouseEvents && element) {
      // tslint:disable-next-line:no-bitwise
      // tslint:disable-next-line:no-string-literal
      console.log(`RLGDragDrop onMouseDown ${element.id}`)
    }
  }

  // public onHtmlMouseDown = (event: MouseEvent) => {
  //   let element = document.elementFromPoint(event.clientX, event.clientY)
  //   if (!element) {
  //     return
  //   }

  //   // Is it draggable?
  //   function findAncestor(element: Element) {
  //     if (element.hasAttribute('draggable')) {
  //       return element
  //     }
  //     const el = element.parentElement
  //     while (el && !el.hasAttribute('draggable'));
  //     return el
  //   }
  //   element = findAncestor(element)
  //   if (!element) {
  //     return
  //   }

  //   // Clone element and wrap in a <div data-layout
  //   this._jsx = <>{element}</>
  //   if (!element.hasAttribute('data-layout')) {
  //     this._jsx = <div data-layout={{}}>{element}</div>
  //   }

  //   if (this._debug & DebugOptions.mouseEvents && element) {
  //     // tslint:disable-next-line:no-bitwise
  //     // tslint:disable-next-line:no-string-literal
  //     console.log(`DragDrop onHtmlMouseDown ${element.id}`)
  //   }
  // }

  public onHtmlMouseMove = (event: MouseEvent) => {
    if (event) {
      event.preventDefault()
      event.stopPropagation()
      // this.moveUpdate(event.clientX, event.clientY)
    }
  }

  public onHtmlMouseUp = (event: MouseEvent) => {
    // tslint:disable-next-line:no-bitwise
    if (this.props.debug && this.props.debug & DebugOptions.mouseEvents) {
      // tslint:disable-next-line:no-string-literal
      const id = event && event.target && event.target['id']
      console.log(`DragDrop onHtmlMouseUp ${id ? id : ''}`)
    }

    if (event) {
      event.preventDefault()
      this.removeEventListeners()

      if (this.state.contextMenu) {
        this.setState({ contextMenu: false })
      } else {
        // const block = this.props.block
        // const r = block.rect()
        // block.update({ x: r.x, y: r.y }, { width: r.width, height: r.height })
      }
      this.props.onUpdate(true)
    }
  }
}
