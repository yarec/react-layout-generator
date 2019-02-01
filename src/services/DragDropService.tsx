import * as React from 'react'
import * as rbush from 'rbush'

import { DebugOptions, IPoint, IRect, difference } from '../types'
import { IService, IServiceProps, IUndo } from './Service'
import { Block } from '../components/Block'
// import { Control } from '../Control'

const gLayer = 10000
/**
 * internal use only
 * @ignore
 */
interface IServiceLayoutState {
  activateDrag: boolean
  contextMenu: boolean
  leftTop: IPoint
}

/**
 * internal use only
 * @ignore
 */
export class DragDropService
  extends React.Component<IServiceProps, IServiceLayoutState>
  implements IService {
  public _startRect: IRect
  public _startOrigin: IPoint

  protected _debug: DebugOptions = DebugOptions.none

  protected _ctrlKey: boolean = false
  protected _altKey: boolean = false
  protected _menuLocation: IPoint

  private _jsx: JSX.Element | undefined

  private _rbush: rbush.RBush<Block>
  private _root: React.RefObject<HTMLDivElement>
  private _dragData: string[] = []
  private _prevDroppable: Set<Block> = new Set;

  constructor(props: IServiceProps) {
    super(props)
    this._startOrigin = { x: 0, y: 0 }
    this._menuLocation = { x: 0, y: 0 }
    this.state = {
      activateDrag: false,
      contextMenu: false,
      leftTop: { x: 0, y: 0 }
    }

    if (props.debug) {
      this._debug = props.debug
    }

    this._rbush = rbush<Block>()
    this._root = React.createRef()
  }

  componentDidMount() {
  }

  private loadDropContainers() {
    const blocks = this.props.g.blocks()
    const items: Block[] = []
    this._rbush.clear()
    blocks.map.forEach(block => {
      if (block.getHandler('canDrop')) {
        items.push(block)
        // console.log(` DragDrop load block ${block.name} ${block.minX} ${block.minY}`)
      } 
    })
    this._rbush.load(items)
  }

  public componentWillUnmount() {
    // document.addEventListener('mousedown', this.onHtmlMouseDown)
    this.endDrag()
  }

  public startDrag = () => {
    document.addEventListener('mouseup', this.onHtmlMouseUp)
    document.addEventListener('mousemove', this.onHtmlMouseMove)
  }

  public endDrag = () => {
    this._jsx = undefined
    this._dragData = []
    document.removeEventListener('mouseup', this.onHtmlMouseUp)
    document.removeEventListener('mousemove', this.onHtmlMouseMove)
  }

  public render = () => {
    // console.log(`DragDrop render x: ${this.state.leftTop.x} y: ${this.state.leftTop.y}`)
    const style = {
      boxSizing: 'border-box' as 'border-box',
      transform: `translate(${
        this.state.leftTop.x}px, ${
        this.state.leftTop.y}px)`,
      position: 'absolute' as 'absolute',
      backgroundColor: 'rgba(0, 0, 0, 0)',
      /* zIndex: gLayer */
    }
    return (
      <div
        id={'dnd'}
        ref={this._root}
        style={{
          background: 'transparent',
          position: 'absolute',
          width: this.props.boundary.width,
          height: this.props.boundary.height,
          zIndex: gLayer
        }}
        onMouseDown={this.onMouseDown}
      >
        {/* <Control name={'$newGame'} g={this.props.g} /> */}
        <div style={style}>{this._jsx}</div>
      </div>
    )
  }

  public hideMenu = () => {
    this.setState({ contextMenu: false })
  }

  public initUpdate(x: number, y: number) {
    this._startOrigin = { x, y }
  }

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
    if (this._debug & DebugOptions.mouseEvents && event.target) {
      // tslint:disable-next-line:no-bitwise
      // tslint:disable-next-line:no-string-literal
      console.log(`RLGDragDrop onMouseDown ${(event.target as HTMLElement).id}`)
    }

    if (event.button === 2) {
      // context menu
    }

    // Get target and corresponding Block
    let block: Block | undefined = undefined
    if (this._root && this._root.current) {
      this._root.current.style.zIndex = '-1'

      let element = document.elementFromPoint(event.clientX, event.clientY)
      if (element) {
        block = this.props.g.blocks().get(element.id)

        if (block) {
          const r = element.getBoundingClientRect()
          this._startRect = {
            x: r.left - this.props.leftTop.x,
            y: r.top - this.props.leftTop.y,
            width: r.width,
            height: r.height
          }

          this._jsx = block.getHandler('dragImage') as JSX.Element

          console.log(`this._jsx block dragImage defined for ${block.name} `, this._jsx ? true : false)
        }
      }

      this._root.current.style.zIndex = `${gLayer}`
    }

    if (!block) {
      return
    }

    this.setState({
      leftTop: {
        x: this._startRect.x,
        y: this._startRect.y
      }
    })

    // get transfer data
    const localParent = block.localParent
    if (localParent) {
      const dragData = localParent.getHandler('dragData')
      if (dragData) {
        this._dragData = dragData(block)
        if (!this._dragData) {
          return
        }
      }
    } 
    
    if (this._dragData.length === 0) {
      this._dragData = [block.name]
    }

    console.log(`dnd dragData ${this._dragData}`)

    // get drag image as JSX
    if (localParent) {
      const dragImage = localParent.getHandler('dragImage')
      if (dragImage) {
        this._jsx = dragImage(this._dragData)

        console.log('this._jsx localParent dragImage defined: ', this._jsx ? true : false)
      }
    }

    if (this._dragData.length === 0) {
      return
    }

    // Start drag
    this.loadDropContainers()
    this.startDrag()
    this.initUpdate(event.clientX, event.clientY)
  }

  public onHtmlMouseMove = (event: MouseEvent) => {
    if (event) {
      event.preventDefault()
      event.stopPropagation()
      this.moveUpdate(event.clientX, event.clientY)
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
      this.endDrag()

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

  public moveUpdate(x: number, y: number) {
    let deltaX = x - this._startOrigin.x
    let deltaY = y - this._startOrigin.y

    // console.log(`moveUpdate ${deltaX} ${deltaY}`)

    if (this._ctrlKey) {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        deltaY = 0
      } else {
        deltaX = 0
      }
    }

    if (deltaX || deltaY) {
      // 1 Extend

      const ur: IRect = {
        x: this._startRect.x + deltaX,
        y: this._startRect.y + deltaY,
        width: this._startRect.width,
        height: this._startRect.height
      }

      // 2 Pin
      if (ur.x < this.props.boundary.x) {
        ur.x = this.props.boundary.x
      }

      if (ur.x + ur.width > this.props.boundary.x + this.props.boundary.width) {
        ur.x = this.props.boundary.x + this.props.boundary.width - ur.width
      }

      if (ur.y < this.props.boundary.y) {
        ur.y = this.props.boundary.y
      }

      if (
        ur.y + ur.height >
        this.props.boundary.y + this.props.boundary.height
      ) {
        ur.y = this.props.boundary.y + this.props.boundary.height - ur.height
      }

      // 3 CanDrop
      const candidates = this._rbush.search({minX: ur.x, minY: ur.y, maxX: ur.x + ur.width, maxY: ur.y + ur.height})

      const blocks: Set<Block> = new Set
      candidates.forEach((block) => {
        const canDrop = block.getHandler('canDrop')
        if (canDrop && canDrop(this._dragData)) {
          blocks.add(block)
          console.log(`can drop ${block.name}`)
        }
      })

      let leave = difference(this._prevDroppable, blocks)

      leave.forEach((b) => {
        const dragLeave = b.getHandler('dragLeave')
        if (dragLeave) {
          dragLeave()
        }
      })

      let enter = difference(blocks, this._prevDroppable)

      enter.forEach((b) => {
        const dragEnter = b.getHandler('dragEnter')
        if (dragEnter) {
          dragEnter()
        }
      })

      this._prevDroppable = blocks
  
      // tslint:disable-next-line:no-bitwise
      if (this.props.debug && this.props.debug & DebugOptions.trace) {
        console.log(`DragDrop update location (x: ${ur.x} y: ${ur.y})`)
      }

      // 4 Update handle
      if (this.state.leftTop.x !== this._startRect.x + deltaX ||
        this.state.leftTop.y !== this._startRect.y + deltaY) {
        this.setState({
          leftTop: {
            x: this._startRect.x + deltaX,
            y: this._startRect.y + deltaY
          }
        })
      }
    }
  }
}

// const b = this._rbush.search({minX: event.clientX, minY: event.clientY, maxX:event.clientX, maxY:event.clientY})
// console.log(`found ${b.length}`)
// const map: Map<string, Block> = new Map
// b.forEach((block) => {
//   console.log(`   block ${block.name}`)
//   map.set(block.name, block)
// })
// console.log(`map ${map.size}`)
// console.log(`RLGDragDrop onMouseDown ${(event.target as HTMLElement).id}`)

// 1 Convert to layout coords
// const r = (event.target as HTMLElement).getBoundingClientRect()
// const hit = {x: event.clientX - r.left, y: event.clientY - r.top}

// 2 Find hit in Blocks using r-tree

// 3 Get data to transfer from src from its container

// Start move

// Look  for drops while moving using r-tree

// Drop on mouse up

// if (this._debug & DebugOptions.mouseEvents && event.target) {
//   // tslint:disable-next-line:no-bitwise
//   // tslint:disable-next-line:no-string-literal
//   console.log(`RLGDragDrop onMouseDown ${(event.target as HTMLElement).id}`)
// }

// let element = document.elementFromPoint(event.clientX, event.clientY)
// if (!element) {
//   return
// }

// // lower zIndex to get elements under dnd overlay
// // (element as HTMLElement).style.zIndex = '0'

// element = document.elementFromPoint(event.clientX, event.clientY)

// if (!element) {
//   return
// }

// // Is it draggable?
// function findAncestor(element: Element) {
//   /// element.attributes.getNamedItem('data-draggable')

//   if ((element as HTMLElement).dataset.draggable) {
//     return element
//   }
//   let el: Element | null = element
//   while (
//     (el = el.parentElement) &&
//     !(element as HTMLElement).dataset.draggable
//   );
//   return el
// }
// element = findAncestor(element)
// if (!element) {
//   return
// }

// const g = element.getAttribute('g')
// console.log(`g.name ${g ? g['name'] : 'invalid'}`)

// // Disable the browser's own dnd image by adding ondragstart:()=>{return false}
// const ondragstart = () => {
//   return false
// }

// // wrap element in a <div data-layout
// const layoutDiv = React.createElement('div', { ondragstart }, element)

// this._jsx = <>{layoutDiv}</>
