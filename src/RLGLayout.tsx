import * as React from 'react'
import ReactResizeDetector from 'react-resize-detector'

const prefix = require('react-prefixer')
const now = require('performance-now')

import {
  Block,
  IMenuItem,
  IPosition,
  PositionChildren
} from './components/Block'
import { ParamValue } from './components/Params'
import { RLGContextMenu } from './editors/RLGContextMenu'
import { RLGEditLayout } from './editors/RLGEditLayout'
import { RLGSelect } from './editors/RLGSelect'
import { IGenerator } from './generators/Generator'
import { IRLGMetaDataArgs } from './RLGPanel'
import {
  DebugOptions,
  DebugOptionsArray,
  ServiceOptions,
  IPoint,
  IRect,
  ISize,
  namedPositionRef,
  PositionRef,
  Unit,
  namedUnit,
  OverflowOptions,
  isUnmanaged,
  rectSize,
  IAnimateProps,
  ILayerMapper
} from './types'
import { DragDropService } from './services/DragDropService'

const raf = require('raf')

/**
 * internal use only
 * Draw a bounding box around a rect.
 * @ignore
 */
export function blockSelectedStyle(rect: IRect, zIndex: number) {
  const offset = 3
  const x = rect.x - offset
  const y = rect.y - offset
  return prefix({
    boxSizing: 'border-box' as 'border-box',
    width: rect.width + offset + offset,
    height: rect.height + offset + offset,
    position: 'absolute' as 'absolute',
    transform: `translate(${x}px, ${y}px)`,
    // mozTransform: `translate(${x}px, ${y}px)`,
    // webkitTransform: `translate(${x}px, ${y}px)`,
    // transformOrigin: 0,
    borderStyle: 'dotted',
    borderWidth: '2px',
    borderColor: 'gray',
    zIndex: zIndex === 0 ? 'auto' : zIndex,
    pointerEvents: 'auto' as 'auto',
  })
}

/**
 * internal use only
 * @ignore
 */
function blockStyle(
  style: React.CSSProperties,
  x: number,
  y: number,
  width: number,
  height: number,
  unit: Unit | undefined,
  selected: boolean,
  zIndex: number,
  transform: string,
  transformOrigin: string
): React.CSSProperties {
  // For unmanaged elements
  let size: any = {
    height: `${height}px`,
    width: `${width}px`
  }
  if (unit) {
    switch (unit) {
      case Unit.unmanaged: {
        size = {}
        break
      }
      case Unit.unmanagedHeight: {
        size = {
          width: `${width}px`
        }
        break
      }
      case Unit.unmanagedWidth: {
        size = {
          height: `${height}px`
        }
        break
      }
    }
  }

  const v = `translate(${x}px, ${y}px) ${transform}`

  if (transformOrigin.length) {
    return prefix({
      boxSizing: 'border-box' as 'border-box',
      ...size,
      position: 'absolute' as 'absolute',
      transform: v,
      transformOrigin: transformOrigin,
      zIndex: zIndex === 0 ? 'auto' : zIndex,
      pointerEvents: 'auto' as 'auto',
      ...style
    })
  } else {
    return prefix({
      boxSizing: 'border-box' as 'border-box',
      ...size,
      position: 'absolute' as 'absolute',
      transform: v,
      zIndex: zIndex === 0 ? 'auto' : zIndex,
      pointerEvents: 'auto' as 'auto',
      ...style
    })
  }
}

/**
 * internal use only
 * @ignore
 */
export let gInProgress: number = 0

/**
 * internal use only
 * @ignore
 */
let gRoot: RLGLayout

/**
 * internal use only
 * @ignore
 */
export const gContext: Map<string, any> = new Map()

/**
 * Props for RLGLayout.
 *
 * Note that you can add a separate style property that will be merged
 * internally for the root element.
 * @noInheritDoc
 */
export interface IRLGLayoutProps extends React.HTMLProps<HTMLElement> {
  /**
   * Unique name is required.
   */
  name: string
  /**
   * The default is ServiceOptions.none.
   */
  service?: ServiceOptions
  /**
   * The default is DebugOptions.none. You may include more than one
   * of the options as an array. Only the DebugOptions.all includes any other options.
   */
  debug?: DebugOptions | DebugOptionsArray
  /**
   * The generator is required and should be unique for each Layout. Reusing
   * generators is possible but not recommended.
   *
   * Generally you will want to use a generator function to define its value,
   * but you can also define init and create methods in a class and then use
   * those to create an instance of the generator.
   *
   * ```ts
   * class MyClass
   *
   *   constructor() {
   *     ...
   *     this._g = new Generator(
   *        'name',
   *        this.init.bind(this),
   *        this._params,
   *        this.create.bind(this)
   *      );
   *   }
   *
   *   private init = (g: IGenerator): Blocks => {
   *     ...
   *   }
   *
   *   private create = (args: ICreate): Block | undefined => {
   *     ...
   *   }
   * }
   * ```
   */
  g: IGenerator
  /**
   * Defines the size of the container for this Layout. The default size of the
   * Layout is computed internally, but if this property is set then it will be
   * used for the size of the Layout.
   *
   * One use of this property is to specify the container size for nested Layouts.
   * It is also useful for tests.
   *
   * ```ts
   *  <RLGLayout
   *    ... >
   *    <RLGPanel
   *      ... >
   *      {(args: IRLGMetaDataArgs) => (
   *        <RLGLayout
   *          ...
   *          containersize={{width: args.container.width, height: args.container.height}}
   *        >
   * ```
   *
   * Note: The computation of the container size internally requires one render
   * of the Layout where the containersize will be {width: 0, height: 0} so setting
   * this property results in a slight performance gain.
   */
  containersize?: ISize
  /**
   * Sets initial params for this Layout.
   *
   * The values are an array of [string, ParamValue]. The following example
   * appends a new value to an existing array defined in params.json:
   *
   * ```ts
   *  import * as data from '../assets/data/params.json'
   *
   *  ...
   *
   *  <RLGLayout
   *    ...
   *    params={[
   *      ...data['rlg.intro'] as Array<[string, ParamValue]>,
   *      ['velocity', 0.05]
   *    ]}
   *  >
   * ```
   */
  params?: Array<[string, ParamValue]>
  /**
   * This is the same as the css overflow settings.
   *
   * We do not recommend that you override this setting with
   * the style property since this setting is applied dynamically.
   */
  overflowX?: OverflowOptions
  /**
   * This is the same as the css overflow settings.
   *
   * We do not recommend that you override this setting with
   * the style property since this setting is applied dynamically.
   */
  overflowY?: OverflowOptions
  /**
   * Controls the animation behavior of the Layout.
   */
  animate?: IAnimateProps

  layers?: ILayerMapper

  onUpdate?: () => void
}

export interface IRLGLayoutState {
  width: number
  height: number
  update: number
  contextMenu: Block | undefined
  contextMenuActive: boolean
  devicePixelRatio: number
}

/**
 * RLGLayout manages a layout. See [IRLGLayoutProps](interfaces/irlglayoutprops.html)
 * for detail properties.
 * Usage:
 * ```ts
 *  <RLGLayout
 *    name={'Layout Name'}
 *    g={ generator }
 *  >
 *    { content }
 *  </RLGLayout>
 * ```
 * @noInheritDoc
 */
export class RLGLayout extends React.Component<
  IRLGLayoutProps,
  IRLGLayoutState
> {
  get select() {
    return this._select
  }

  private _root: HTMLDivElement | undefined = undefined
  private _g: IGenerator

  private _edit: boolean = false
  private _debug: DebugOptions = DebugOptions.none
  private _startRendering: number = now()

  private _count: number = 0
  private _select: RLGSelect | undefined = undefined
  private _menuLocation: IPoint = { x: 0, y: 0 }
  private _rafId: number = 0
  private _lastAnimationFrame: number = 0

  constructor(props: IRLGLayoutProps) {
    super(props)
    this.state = {
      height: props.containersize ? props.containersize.height : 0,
      update: 0,
      width: props.containersize ? props.containersize.width : 0,
      contextMenu: undefined,
      contextMenuActive: false,
      devicePixelRatio: window.devicePixelRatio
    }

    if (props.g && props.g.blocks().size !== 0) {
      console.error(`RLGLayout: Did you intend on reusing this generator in ${
        props.name
      }? 
      If so you should clear it first by calling g.clear()`)
    }

    this.initProps(props)
  }

  public componentWillMount() {
    if (!gRoot) {
      gRoot = this
    }
  }

  public componentDidMount() {
    // if (gLayouts.get(this.props.name) !== undefined) {
    //   console.error(`
    //   Did you reuse the name ${this.props.name}?. Each RLGLayout name must be unique.
    //   `)
    // }

    window.addEventListener('resize', this.onWindowResize)
  }

  public componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResize)

    if (this._rafId) {
      raf.cancel(this._rafId)
      this._rafId = 0
    }
  }

  public componentWillReceiveProps(props: IRLGLayoutProps) {
    if (
      this.props.debug !== props.debug ||
      this.props.service !== props.service
    ) {
      this.initProps(props)
    }
  }

  public getBoundingLeftTop = () => {
    const leftTop = { x: 0, y: 0 }
    if (this._root) {
      const r = this._root.getBoundingClientRect()
      leftTop.x = r.left
      leftTop.y = r.top
    }
    return leftTop
  }

  public get root() {
    return this._root
  }

  private frameStart = () => {
    this._startRendering = now()
    return null
  }

  private frameEnd = () => {
    // tslint:disable-next-line:no-bitwise
    if (this._debug & DebugOptions.timing) {
      const difference = now() - this._startRendering
      console.log(`frameTime: ${difference.toFixed(2)}ms`)
    }
    return null
  }

  getLayers(): React.ReactChild[][] {
    const jsx: React.ReactChild[][] = []

    function push(layer: number, child: React.ReactChild) {
      if (!jsx[layer]) {
        jsx[layer] = []
      }
      jsx[layer].push(child)
    }

    const mapper =
      this.props.layers && this.props.layers.mapper
        ? this.props.layers.mapper
        : (layer: number) => {
            return layer
          }

    React.Children.map(this.props.children, child => {
      const c = child as React.ReactElement<any>
      if (c) {
        const layer: number | undefined = c.props['data-layer']
        if (!layer) {
          push(0, child as React.ReactChild)
        } else if (typeof layer === 'string') {
          const _layer = parseInt(layer as string, 10)
          const l = mapper(_layer)
          if (l) {
            push(l, c)
          }
        } else {
          const l = mapper(layer)
          if (l) {
            push(l, c)
          }
        }
      }
    })

    return jsx
  }

  public render(): React.ReactNode {
    // console.log(`----------- render ${this.props.name}`)
    this.initLayout()

    // document.body.style.pointerEvents = 'none'

    let mainStyle: React.CSSProperties = this.mainStyle()

    if (this._edit) {
      this.frameStart()
      return (
        /* style height of 100% necessary for ReactResizeDetector to work  */
        <div
          id={'main'}
          ref={this.onRootRef}
          style={prefix(mainStyle)}
          onMouseDown={this.onParentMouseDown}
          onContextMenu={this.onParentContextMenu()}
        >
          <>
            {this.content()}

            {this.state.contextMenuActive ? (
              <RLGContextMenu
                commands={this.generateContextMenu(this.state.contextMenu)}
                location={this._menuLocation}
                bounds={{ width: this.state.width, height: this.state.height }}
                debug={this._debug}
                hideMenu={this.hideMenu}
                zIndex={999}
              />
            ) : null}

            {this.frameEnd()}
          </>
        </div>
      )
    }
    return (
      <div id={'main'} ref={this.onRootRef} style={prefix(mainStyle)}>
        {this.content()}
      </div>
    )
  }

  private onRootRef = (elt: HTMLDivElement) => {
    if (elt) {
      this._root = elt
    }
  }

  private mainStyle(): React.CSSProperties {
    function overflowFn(options: OverflowOptions | undefined) {
      let v = 'visible'

      if (options) {
        if (options === OverflowOptions.auto) {
          v = 'auto'
        }
        if (options === OverflowOptions.hidden) {
          v = 'hidden'
        }
        if (options === OverflowOptions.scroll) {
          v = 'scroll'
        }
      }
      return v
    }

    let mainStyle: React.CSSProperties = {
      position: 'absolute' as 'absolute',
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
      overflow: 'visible'
    }
    if (this.props.overflowX || this.props.overflowY) {
      if (
        window.devicePixelRatio !== this.state.devicePixelRatio &&
        gRoot === this
      ) {
        mainStyle = {
          position: 'absolute' as 'absolute',
          width: `${(this.state.width * this.state.devicePixelRatio) /
            window.devicePixelRatio}`,
          height: `${(this.state.height * this.state.devicePixelRatio) /
            window.devicePixelRatio}`,
          overflow: `${overflowFn(this.props.overflowX)} ${overflowFn(
            this.props.overflowY
          )}`
        }
      }
      mainStyle = {
        position: 'absolute' as 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        // pointerEvents: 'none' as 'none',
        overflow: `${overflowFn(this.props.overflowX)} ${overflowFn(
          this.props.overflowY
        )}`,
        ...this.props.style
      }
    }
    return mainStyle
  }

  private initProps(props: IRLGLayoutProps) {
    this._debug = DebugOptions.none
    if (props.debug) {
      if (Array.isArray(props.debug)) {
        const array = props.debug as DebugOptions[]
        array.forEach((option: DebugOptions) => {
          // tslint:disable-next-line:no-bitwise
          this._debug |= option
        })
      } else {
        this._debug = props.debug
      }
    }
    this._g = this.props.g

    if (this.props.params) {
      const params = this._g.params()
      this.props.params.forEach((value: [string, ParamValue]) => {
        params.set(value[0], value[1])
      })
    }

    if (props.animate) {
      if (props.animate.active && !this._rafId) {
        this._rafId = raf(this.animationLoop)
      }
    }

    this._edit = props.service === ServiceOptions.edit
  }

  private animationLoop = (time: number) => {
    if (this.props.animate) {
      const { active, throttleTime } = this.props.animate
      const params = this._g.params()
      if (active) {
        const {} = this.props.animate
        const hasTimeElapsed =
          !throttleTime || time - this._lastAnimationFrame >= throttleTime

        if (hasTimeElapsed) {
          let cont = true
          if (this._root) {
            const r = this._root.getBoundingClientRect()
            const w = r.right - r.left
            const h = r.bottom - r.top
            if (this.state.width != w || this.state.height != h) {
              params.set('containersize', { width: w, height: h })
              this.setState({ width: w, height: h })
              cont = false
            }
          }

          if (cont) {
            params.set('deltaTime', time - this._lastAnimationFrame)
            params.set('animate', this.props.animate.active ? 1 : 0)

            this.setState(this.state)
            this._lastAnimationFrame = time
          } else {
            const blocks = this._g.blocks()
            if (blocks) {
              blocks.map.forEach(block => {
                block.touch()
                block.rect()
              })
            }
          }

          this._rafId = raf(this.animationLoop)
        } else {
          if (this._rafId) {
            raf.cancel(this._rafId)
            this._rafId = 0
          }
        }
      }
    }
  }

  private onWindowResize = () => {
    if (this.state.devicePixelRatio !== window.devicePixelRatio) {
      // tslint:disable-next-line:no-bitwise
      if (this._debug && this._debug & DebugOptions.info) {
        const browserZoomLevel = window.devicePixelRatio * 100
        console.log(`window resize zoom ${browserZoomLevel.toFixed(2)}% `)
      }
      // this.setState({ devicePixelRatio: window.devicePixelRatio });
    }
  }

  private onResize = (width: number, height: number) => {
    if (this.state.devicePixelRatio === window.devicePixelRatio) {
      // Not zooming
      const w = Math.floor(
        width /* *this.state.devicePixelRatio / window.devicePixelRatio */
      )
      const h = Math.floor(
        height /* * this.state.devicePixelRatio / window.devicePixelRatio */
      )

      // tslint:disable-next-line:no-bitwise
      if (this._debug && this._debug & DebugOptions.info) {
        // const browserZoomLevel = window.devicePixelRatio * 100;
        // console.log(`window size ${window.innerWidth} ${window.innerHeight} zoom ${browserZoomLevel.toFixed(2)}% `);
        // console.log(`screen size ${screen.width} ${screen.height} `);
        console.log('\nonResize', this.props.name, w, h)

        // Same size as ReactResize except ReactResize notifies of changes
        // const r = this._root.getBoundingClientRect();
        // console.log('\nroot', this.props.name, r.right - r.left, r.bottom - r.top);
      }

      if (this.state.width !== w || this.state.height !== h) {
        this.setState({ width: w, height: h })
      }
    }
  }

  private initLayout = () => {
    const p = this._g.params()

    const e = p.get('editOptions') as number
    if (e) {
      this._edit = e ? true : false
    }

    if (this._root) {
      const r = this._root.getBoundingClientRect()
      p.set('containerlefttop', {
        x: r.left,
        y: r.top
      })
    }

    const v = p.set('containersize', {
      width: this.state.width,
      height: this.state.height
    })
    if (v) {
      // Only if containersize has changed
      const blocks = this._g.blocks()
      if (blocks) {
        blocks.map.forEach(block => {
          block.touch()
          block.rect()
        })
      }
    }

    this._g.reset()

    // tslint:disable-next-line:no-bitwise
    if (this._debug && this._debug & DebugOptions.data) {
      const params = this._g.params()
      const containersize = params.get('containersize') as ISize
      if (this._count === 0 && containersize.width && containersize.height) {
        const blocks = this._g.blocks()

        console.log(
          `RLGLayout debug for ${
            this.props.name
          } with generator ${this._g.name()}`
        )
        console.log('params')
        params.map.forEach((value, key) => {
          console.log(`  ${key} ${JSON.stringify(value)}`)
        })
        console.log('blocks (computed position rects)')
        blocks.map.forEach((value, key) => {
          const r = value.rect()
          console.log(
            `name: ${key} x: ${r.x} y: ${r.y} width: ${r.width} height: ${
              r.height
            }`
          )
        })

        this._count += 1
      }
    }
  }

  private createPositionedElement = (
    child: React.ReactElement<any>,
    index: number,
    count: number,
    name: string,
    position: IPosition,
    positionChildren: PositionChildren
  ) => {
    let b = this._g.lookup(name)
    if (!b && this._g.create) {
      b = this._g.create({
        index,
        count,
        name,
        g: this._g,
        position
      })

      if (!b) {
        throw new Error(
          `The component ${name} in layout ${
            this.props.name
          } could not be created`
        )
      }
    }

    if (b) {
      const layer = child.props['data-layer']
      if (layer) {
        if (typeof layer === 'number') {
          b.setHandler('$layer', layer)
        }
      }
    }
  }

  private updatePositionedElement = (
    child: React.ReactElement<any>,
    index: number,
    count: number,
    name: string,
    position: IPosition,
    positionChildren: PositionChildren,
    offset?: IPoint
  ) => {
    const c = this._g.params().get('containersize') as ISize
    if (c.width === 0 && c.height === 0) {
      return null
    }

    const b = this._g.lookup(name)

    if (b) {
      const rect = b.rect()

      // tslint:disable-next-line:no-bitwise
      if (this._debug && this._debug & DebugOptions.trace) {
        console.log(`updatePositionedElement ${name} position:`, b.position)
      }

      if ((rect.width && rect.height) || isUnmanaged(b.size.unit)) {
        const style = blockStyle(
          child.props.style,
          rect.x + (offset ? offset.x : 0),
          rect.y + (offset ? offset.y : 0),
          rect.width,
          rect.height,
          b.size.unit,
          this._select ? this._select.selected(name) : false,
          b.zIndex,
          b.reactTransform,
          b.reactTransformOrigin
        )

        const editors = this.createEditors(child, b, rect)

        gInProgress -= 1

        if (b.positionChildren) {
          return this.positionChildren(child, b, name, rect, style)
        } else {
          const editProps = this._edit
            ? {
                edit: this._edit ? 1 : 0,
                g: this.props.g
              }
            : {}
          const metaDataArgs: IRLGMetaDataArgs = {
            container: rect,
            block: b,
            service: this._edit ? ServiceOptions.edit : this.props.service!,
            debug: this._debug,
            g: this.props.g,
            context: gContext
            // update: this.onUpdate
          }

          class Local {
            private _b: Block
            private _s: ISize

            constructor(b: Block) {
              this._b = b
              this._s = rectSize(b.rect())
            }

            setSize(w: number, h: number) {
              if (w && h) {
                if (this._s.width !== w || this._s.height != h) {
                  const sizeUnit = this._b.position.size.unit
                  const r = this._b.rect()
                  if (sizeUnit === Unit.unmanaged) {
                    this._b.updateSize({ width: w, height: h })
                    this._s.width = w
                    this._s.height = h
                  } else if (sizeUnit === Unit.unmanagedWidth) {
                    this._b.updateSize({ width: w, height: r.height })
                    this._s.width = w
                  } else if (sizeUnit === Unit.unmanagedHeight) {
                    this._b.updateSize({ width: r.width, height: h })
                    this._s.height = h
                  }
                }
              }
            }

            selectedStyle() {
              return blockSelectedStyle(this._b.rect(), this._b.zIndex)
            }
          }

          const local = new Local(b)

          const args = typeof child.type === 'string' ? {} : metaDataArgs

          const cc = React.cloneElement(
            child,
            {
              ...child.props,
              ...{
                key: b.name,
                id: b.name,
                ref: (c: any) => {
                  if (c) {
                    local.setSize(c.offsetWidth, c.offsetHeight)
                  }
                },

                ...args,

                ...editProps,

                style: { ...this.props.style, ...child.props.style, ...style }
              }
            },
            child.props.children
          )

          let e
          if (this._select && this._select.selected(name)) {
            e = <div key={`select${index}`} style={local.selectedStyle()} />
          }

          return (
            <>
              {cc}
              {e ? e : null}
              {editors}
            </>
          )
        }
      }
    }

    return null
  }

  private createLayout = (child: JSX.Element, index: number, count: number) => {
    const p = child.props['data-layout']

    if (p) {
      // if (p.layout && p.name) {
      //   const ancestor = gLayouts.get(p.layout);
      //   if (ancestor) {
      //     return ancestor.createPositionedElement(child, index, count, p.name, p.position, p.context);
      //   }
      // } else

      if (p.name) {
        return this.createPositionedElement(
          child,
          index,
          count,
          p.name,
          p.position,
          p.context
        )
      }
    }

    return null
  }

  private updateElement = (
    child: React.ReactElement<any>,
    index: number,
    count: number
  ) => {
    const p = child.props['data-layout']

    if (p) {
      // if (p.layout && p.name) {
      //   const ancestor = gLayouts.get(p.layout);
      //   if (ancestor) {
      //     const location = this.getBoundingLeftTop();
      //     const ancestorLocation = ancestor.getBoundingLeftTop();
      //     const offset = { x: ancestorLocation.x - location.x, y: ancestorLocation.y - location.y };

      //     return ancestor.updatePositionedElement(
      //       child, index, count, p.name, p.position, p.context, offset
      //     );
      //   }
      // } else

      if (p.name) {
        return this.updatePositionedElement(
          child,
          index,
          count,
          p.name,
          p.position,
          p.context
        )
      }
    }

    const args =
      typeof child.type === 'string'
        ? {}
        : {
            service: this._edit ? ServiceOptions.edit : this.props.service,
            debug: this._debug,
            context: gContext,
            g: this.props.g,
            style: child.props.style
          }

    return React.cloneElement(
      child,
      {
        id: `${p.name}`,
        ...child.props,
        ...args
      },
      child.props.children
    )
  }

  private onParentMouseDown = (event: React.MouseEvent) => {
    // tslint:disable-next-line:no-bitwise
    if (this._debug && this._debug & DebugOptions.mouseEvents) {
      console.log(
        `RLGLayout onParentMouseDown ${this.props.name} ${event.target}`
      )
    }

    if (event.button !== 2 && this._select && this._select.selected.length) {
      this._select.clear()
    }

    if (event.button === 2) {
      event.stopPropagation()
      this.handleContextMenu(event)
    }
  }

  private onParentContextMenu = (block?: Block) => {
    return (event: React.MouseEvent) => {
      // tslint:disable-next-line:no-bitwise
      if (this._debug && this._debug & DebugOptions.mouseEvents) {
        console.log(
          `RLGLayout onParentContextMenu ${this.props.name} ${event.target}`
        )
      }

      event.preventDefault()
      this.setState({ contextMenu: block, contextMenuActive: true })
    }
  }

  private generateContextMenu = (block?: Block) => {
    const menuItems: IMenuItem[] | undefined =
      this._select && this._select.commands

    if (menuItems && block && block.editor && block.editor.contextMenu) {
      const contextMenu = block.editor.contextMenu
      menuItems.push({ name: '' })
      contextMenu.forEach((item: IMenuItem) => {
        menuItems.push(item)
      })
    }

    return menuItems
  }

  private onHtmlMouseUp = (event: MouseEvent) => {
    if (event) {
      // tslint:disable-next-line:no-bitwise
      if (this._debug && this._debug & DebugOptions.mouseEvents) {
        console.log(
          `RLGLayout onHtmlMouseUp ${this.props.name} ${event.target}`
        )
      }

      event.preventDefault()
      this.removeEventListeners()

      this.hideMenu()
    }
  }

  private hideMenu = () => {
    if (this.state.contextMenuActive) {
      this.setState({ contextMenu: undefined, contextMenuActive: false })
    }
  }

  private addEventListeners = () => {
    document.addEventListener('mouseup', this.onHtmlMouseUp)
  }

  private removeEventListeners = () => {
    document.removeEventListener('mouseup', this.onHtmlMouseUp)
  }

  private selectCallback = (instance: RLGSelect) => {
    this._select = instance
  }

  private onUpdate = () => {
    if (this.props.onUpdate) {
      this.props.onUpdate()
    } else {
      this.setState({ update: this.state.update + 1 })
      console.log(`update ${this.state.update}`)
    }
  }

  private content = () => {
    const count = React.Children.count(this.props.children)
    gInProgress += count

    // tslint:disable-next-line:no-bitwise
    if (this._debug && this._debug & DebugOptions.trace) {
      const containersize = this._g.params().get('containersize') as ISize
      console.log(
        `\ncontent ${this._g.name()} containersize: ${containersize.width}, ${
          containersize.height
        }`
      )
    }

    // Phase I create if necessary
    React.Children.map(this.props.children, (child, i) => {
      const c = child as React.ReactElement<any>
      if (c) {
        if (c.type === React.Fragment) {
          React.Children.map(c.props.children, (nChild, ni) => {
            const nc = nChild as React.ReactElement<any>
            const nCount = React.Children.count(nc.props.children)
            this.createLayout(nc, ni, nCount)
          })
        } else {
          // tslint:disable-next-line:no-any
          this.createLayout(c, i, count)
          // }
        }
      }
    })

    // Bug: The idea is to put each layer into its own div to form a
    // stacking context. So far this is not working. Even though
    // React has the correct hierarchy, the browser arranges it
    // into a different hierarchy.

    // So have not found a solution for this.

    const layerStyle = {
      position: 'absolute' as 'absolute',
      left: 0,
      top: 0,
      right: 0,
      bottom: 0
      // pointerEvents: 'none' as 'none'
    }

    const topLayerStyle = {
      background: 'transparent',
      position: 'absolute' as 'absolute',
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      pointerEvents: 'none' as 'none'
    }

    const layers = this.getLayers()
    const elements: React.ReactNode[] = []

    // Phase II update

    const encapsulate = this.props.layers
      ? this.props.layers.encapsulate
      : false
    let i = 0
    for (; i < layers.length - 1 && i < layers.length; i++) {
      const layer = layers[i]
      const children = this.processLayout(layer, count)
      elements.push(
        encapsulate ? (
          <div key={`layer#${i}`} id={`layer#${i}`} style={layerStyle}>
            {children}
          </div>
        ) : (
          children
        )
      )
    }

    if (elements && this.props.service === ServiceOptions.dnd) {
      elements.push(
        <DragDropService
          name={`dnd-${this.props.name}`}
          key={`dnd-${this.props.name}`}
          debug={this._debug}
          boundary={{
            x: 0,
            y: 0,
            width: this.state.width,
            height: this.state.height
          }}
          leftTop={this.getBoundingLeftTop()}
          onUpdate={this.onUpdate}
          g={this._g}
        />
      )
    }

    for (let i = layers.length - 1; i < layers.length; i++) {
      const layer = layers[i]
      const children = this.processLayout(layer, count)
      elements.push(
        encapsulate ? (
          <div key={`layer#${i}`} id={`layer#${i}`} style={topLayerStyle}>
            {children}
          </div>
        ) : (
          children
        )
      )
    }

    if (elements && this._edit) {
      elements.unshift(
        <RLGSelect
          name={`select-${name}`}
          key={`select-${name}`}
          debug={this._debug}
          selectCallback={this.selectCallback}
          boundary={{
            x: 0,
            y: 0,
            width: this.state.width,
            height: this.state.height
          }}
          onUpdate={this.onUpdate}
          g={this._g}
        />
      )
    }

    if (elements && this.props.containersize === undefined) {
      elements.push(
        <ReactResizeDetector
          key={`contentResizeDetector ${this.props.name}`}
          handleWidth={true}
          handleHeight={true}
          onResize={this.onResize}
        />
      )
    }

    return elements
  }

  private processLayout(layer: React.ReactChild[], count: number) {
    return React.Children.map(layer, (child, i) => {
      const c = child as React.ReactElement<any>
      if (c) {
        if (c.type === React.Fragment) {
          return React.Children.map(c.props.children, (nChild, ni) => {
            const nc = nChild as React.ReactElement<any>
            const nCount = React.Children.count(nc.props.children)
            return this.updateElement(nc, ni, nCount)
          })
        } else {
          // tslint:disable-next-line:no-any
          return this.updateElement(child as React.ReactElement<any>, i, count)
        }
      }
      return null
    })
  }

  private handleContextMenu(event: React.MouseEvent<Element>) {
    if (event.button === 2) {
      // Right click
      event.preventDefault()
      const currentTargetRect = event.currentTarget.getBoundingClientRect()
      const offsetX = event.pageX - currentTargetRect.left
      const offsetY = event.pageY - currentTargetRect.top
      this._menuLocation = { x: offsetX, y: offsetY }
      this.addEventListeners()
    } else {
      this.hideMenu()
    }
  }

  private positionChildren(
    child: React.ReactElement<any>,
    b: Block,
    name: string,
    rect: IRect,
    style: React.CSSProperties
  ) {
    const editProps = {
      edit: this._edit ? 1 : 0,
      g: this.props.g
    }

    const nestedChildren = React.Children.map(
      child.props.children,
      (nestedChild, i) => {
        const nestedLayout = b.positionChildren!(
          b,
          b.generator,
          i,
          nestedChild.props
        )
        if (nestedLayout && nestedChild.props) {
          nestedLayout.localParent = b
          // const blocks = this._g.blocks();
          // blocks.set(nestedLayout.name, nestedLayout.position, nestedLayout.generator);

          const nestedRect = nestedLayout.rect()
          const nestedStyle = blockStyle(
            nestedChild.props.style,
            nestedRect.x,
            nestedRect.y,
            nestedRect.width,
            nestedRect.height,
            b.size.unit,
            this._select ? this._select.selected(name) : false,
            b.zIndex,
            b.reactTransform,
            b.reactTransformOrigin
          )

          const args =
            typeof nestedChild.type === 'string'
              ? {}
              : {
                  container: nestedRect,
                  block: b,
                  service: this._edit
                    ? ServiceOptions.edit
                    : this.props.service!,
                  debug: this._debug,
                  g: this.props.g,
                  context: gContext
                  // update: this.onUpdate
                }

          return React.cloneElement(
            nestedChild,
            {
              ...nestedChild.props,
              ...{
                key: `${nestedChild.props.id}`,
                id: `${nestedChild.props.id}`,

                ...args,

                ...editProps,
                style: {
                  ...this.props.style,
                  ...nestedChild.props.style,
                  ...nestedStyle
                }
              }
            },
            nestedChild.props.children
          )
        }
        return null
      }
    )

    const args =
      typeof child.type === 'string'
        ? {}
        : {
            container: rect,
            block: b,
            service: this._edit ? ServiceOptions.edit : this.props.service!,
            debug: this._debug,
            g: this.props.g,
            context: gContext
            // update: this.onUpdate
          }

    return React.cloneElement(
      child,
      {
        ...child.props,
        ...{
          key: b.name,
          id: b.name,

          ...args,

          ...editProps,

          style: { ...this.props.style, ...child.props.style, ...style }
        }
      },
      nestedChildren
    )
  }

  private createEditors(
    child: React.ReactElement<any>,
    b: Block,
    rect: { y: number; x: number; width: number; height: number }
  ) {
    const editors: React.ReactChild[] = []
    if (this._edit) {
      if (child.props.onMouseDown) {
        const fn = child.props.onMouseDown as (e: React.MouseEvent) => void
        b.onMouseDown = fn
      }
      if (child.props.onClick) {
        const fn = child.props.onClick as (e: React.MouseEvent) => void
        b.onClick = fn
      }
      if (b.editor && b.editor.edits) {
        let allow = true
        b.editor.edits.forEach((item, i) => {
          // filter unmanaged edits
          if (
            (b.size.unit === Unit.unmanaged ||
              b.size.unit === Unit.unmanagedWidth) &&
            (item.ref === PositionRef.bottom || item.ref === PositionRef.top)
          ) {
            allow = false
          }
          if (
            (b.size.unit === Unit.unmanaged ||
              b.size.unit === Unit.unmanagedHeight) &&
            (item.ref === PositionRef.left || item.ref === PositionRef.right)
          ) {
            allow = false
          }
          if (allow) {
            editors.push(
              <RLGEditLayout
                key={`edit${b.name + i}`}
                edit={item}
                block={b!}
                debug={this._debug}
                select={this._select}
                handle={rect}
                boundary={{
                  x: 0,
                  y: 0,
                  width: this.state.width,
                  height: this.state.height
                }}
                onUpdate={this.onUpdate}
                zIndex={b.zIndex}
              />
            )
          } else {
            console.error(`Cannot edit ${namedPositionRef(item.ref)} for block 
            ${name} when size is set to 
            ${namedUnit(b.size.unit)}`)
          }
        })
      } else {
        // Add default position
        const edit = { ref: PositionRef.position }
        b.setEditDefaults(edit)
        editors.push(
          <RLGEditLayout
            key={`edit${b.name}`}
            edit={edit}
            block={b!}
            debug={this._debug}
            select={this._select}
            handle={rect}
            boundary={{
              x: 0,
              y: 0,
              width: this.state.width,
              height: this.state.height
            }}
            onUpdate={this.onUpdate}
            zIndex={b.zIndex}
          />
        )
      }
    }
    return editors
  }
}
