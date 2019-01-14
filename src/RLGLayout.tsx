import * as React from 'react';
import ReactResizeDetector from 'react-resize-detector';

import {
  Block,
  IMenuItem,
  IPosition,
  PositionChildren
} from './components/Block';
import { ParamValue } from './components/Params';
import { RLGContextMenu } from './editors/RLGContextMenu';
import { RLGEditLayout } from './editors/RLGEditLayout';
import { RLGSelect } from './editors/RLGSelect';
import { IGenerator } from './generators/Generator';
import { IRLGPanelArgs } from './RLGPanel';
import {
  DebugOptions,
  DebugOptionsArray,
  EditOptions,
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
} from './types';

/**
 * internal use only
 * @ignore
 */
export function selectedStyle(rect: IRect) {
  const offset = 3;
  const x = rect.x - offset;
  const y = rect.y - offset;
  return {
    boxSizing: 'border-box' as 'border-box',
    width: rect.width + offset + offset,
    height: rect.height + offset + offset,
    position: 'absolute' as 'absolute',
    transform: `translate(${x}px, ${y}px)`,
    transformOrigin: 0,
    borderStyle: 'dotted',
    borderWidth: '2px',
    borderColor: 'gray',
  }
}

/**
 * internal use only
 * @ignore
 */
function tileStyle(
  style: React.CSSProperties,
  x: number,
  y: number,
  width: number,
  height: number,
  unit: Unit,
  selected: boolean,
  zIndex: number
): React.CSSProperties {

  // For unmanaged elements
  let size: any = {
    height: `${height}px`,
    width: `${width}px`,
  }
  switch (unit) {
    case Unit.unmanaged: {
      size = {};
      break;
    }
    case Unit.unmanagedHeight: {
      size = {
        width: `${width}px`
      };
      break;
    }
    case Unit.unmanagedWidth: {
      size = {
        height: `${height}px`
      };
      break;
    }
  }

  return {
    boxSizing: 'border-box' as 'border-box',
    ...size,
    position: 'absolute' as 'absolute',
    transform: `translate(${x}px, ${y}px)`,
    transformOrigin: 0,
    // overflow: 'hidden',
    zIndex,
    // ...border,
    ...style
  };
}

/**
 * internal use only
 * @ignore
 */
export let gInProgress: number = 0;

/**
 * internal use only
 * @ignore
 */
export const gLayouts: Map<string, RLGLayout> = new Map();

/**
 * internal use only
 * @ignore
 */
export const gContext: Map<string, any> = new Map();

/**
 * Props for RLGLayout.
 * @noInheritDoc
 */
export interface IRLGLayoutProps extends React.HTMLProps<HTMLElement> {
  /**  
   * Name is required by [RLGDynamic](#RLGDynamic) and 
   * useful when debugging even if you are not using dynamic 
   * rendering.
   */
  name: string;
  /** 
   * The default is EditOptions.none. Set to EditOptions.all to edit.
   */
  edit?: EditOptions;
   /** 
   * The default is DebugOptions.none. You may include more than one
   * of the options. Only the DebugOptions.all includes any other options.
   */
  debug?: DebugOptions | DebugOptionsArray;
  g: IGenerator;
  containersize?: ISize;
  params?: Array<[string, ParamValue]>;
  overflowX?: OverflowOptions;
  overflowY?: OverflowOptions;
}

export interface IRLGLayoutState {
  width: number;
  height: number;
  update: number;
  contextMenu: Block | undefined;
  contextMenuActive: boolean;
  devicePixelRatio: number;
}

/**
 * This class is required in order to use RLG.
 * 
 * Usage:
 * ```jsx
 *  <RLGLayout
 *    name={}
 *  >
 *    { content }
 *  </RLGLayout>
 * ```
 * @noInheritDoc
 */
export class RLGLayout extends React.Component<IRLGLayoutProps, IRLGLayoutState> {

  get select() {
    return this._select;
  }

  private _root: HTMLDivElement | undefined = undefined;
  private _g: IGenerator;

  private _edit: EditOptions = EditOptions.none;
  private _debug: DebugOptions = DebugOptions.none;
  private _startRendering: number = Date.now();

  private _count: number = 0;
  private _select: RLGSelect | undefined = undefined;
  private _menuLocation: IPoint = { x: 0, y: 0 };
  private _zIndex: number = 0;

  constructor(props: IRLGLayoutProps) {
    super(props);
    this.state = {
      height: props.containersize ? props.containersize.height : 0,
      update: 0,
      width: props.containersize ? props.containersize.width : 0,
      contextMenu: undefined,
      contextMenuActive: false,
      devicePixelRatio: window.devicePixelRatio
    }

    this._g = props.g;

    this.initProps(props);
  }

  public componentDidMount() {
    if (gLayouts.get(this.props.name) !== undefined) {
      console.error(`
      Did you reuse the name ${this.props.name}?. Each RLGLayout name must be unique.
      `)
    }
    gLayouts.set(this.props.name, this);
    window.addEventListener('resize', this.onWindowResize);
  }

  public componentWillUnmount() {
    gLayouts.delete(this.props.name);
    window.removeEventListener('resize', this.onWindowResize);
  }

  public componentWillReceiveProps(props: IRLGLayoutProps) {
    if (
      this.props.debug !== props.debug ||
      this.props.edit !== props.edit
    ) {
      this.props.g.clear();
      this.initProps(props);
    }
  }

  // public getWidth = () => {
  //   return this.state.width;
  // }

  public getBoundingLeftTop = () => {
    const leftTop = { x: 0, y: 0 };
    if (this._root) {
      const r = this._root.getBoundingClientRect();
      leftTop.x = r.left;
      leftTop.y = r.top;
    }
    return leftTop;
  }


  public render(): React.ReactNode {

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


    this.initLayout();

    // this.state.update can be used for debug tracing during or after editing
    // if (this.state.update === 0) {
    //   console.log('render');
    // }

    const style = (this.props.overflowX || this.props.overflowY) ?
      { width: '100%', height: '100%', overflow: `${overflowFn(this.props.overflowX)} ${overflowFn(this.props.overflowY)}` } :
      { width: '100%', height: '100%' }

    if (this.props.edit) {
      this.frameStart();
      return (
        /* style height of 100% necessary for ReactResizeDetector to work  */
        <div
          id={'main'}
          ref={this.onRootRef}
          style={style}
          onMouseDown={this.onParentMouseDown}
          onContextMenu={this.onParentContextMenu()}
        >
          {this.content()}

          {(this.state.contextMenuActive) ?
            <RLGContextMenu
              commands={this.generateContextMenu(this.state.contextMenu)}
              location={this._menuLocation}
              bounds={{ width: this.state.width, height: this.state.height }}
              debug={this._debug}
              hideMenu={this.hideMenu}
              zIndex={this._zIndex}
            />
            : null
          }

          {this.frameEnd()}
        </div >
      );
    }
    return (
      <div
        id={'main'}
        ref={this.onRootRef}
        style={style}
      >
        {this.content()}
      </div>
    )
  }

  private onRootRef = (elt: HTMLDivElement) => {
    if (elt) {
      this._root = elt;
      // const r = elt.getBoundingClientRect();

      // // tslint:disable-next-line:no-bitwise
      // if (this._debug && (this._debug & DebugOptions.info)) {
      //   // const browserZoomLevel = window.devicePixelRatio * 100;
      //   // console.log(`window size ${window.innerWidth} ${window.innerHeight} zoom ${browserZoomLevel.toFixed(2)}% `);
      //   // console.log(`screen size ${screen.width} ${screen.height} `);
      //   console.log('\nonRootRef', this.props.name, r.right - r.left, r.bottom - r.top);
      // }
      // // this._root = elt;
    }
  }

  private initProps(props: IRLGLayoutProps) {


    this._edit = props.edit ? props.edit : EditOptions.none;
    this._debug = DebugOptions.none;
    if (props.debug) {
      if (Array.isArray(props.debug)) {
        const array = props.debug as DebugOptions[];
        array.forEach((option: DebugOptions) => {
          // tslint:disable-next-line:no-bitwise
          this._debug |= option;
        });
      }
      else {
        this._debug = props.debug;
      }
    }
    this._g = this.props.g;
    if (this.props.params) {
      const params = this._g.params();
      this.props.params.forEach((value: [string, ParamValue]) => {
        params.set(value[0], value[1]);
      });
    }
  }

  private onWindowResize = () => {
    if (this.state.devicePixelRatio !== window.devicePixelRatio) {
      // tslint:disable-next-line:no-bitwise
      if (this._debug && (this._debug & DebugOptions.info)) {
        const browserZoomLevel = window.devicePixelRatio * 100;
        console.log(`window resize zoom ${browserZoomLevel.toFixed(2)}% `);
      }
      this.setState({ devicePixelRatio: window.devicePixelRatio });
    }
  }

  private onResize = (width: number, height: number) => {

    const w = Math.floor(width * window.devicePixelRatio / this.state.devicePixelRatio);
    const h = Math.floor(height * window.devicePixelRatio / this.state.devicePixelRatio);

    // tslint:disable-next-line:no-bitwise
    if (this._debug && (this._debug & DebugOptions.info)) {
      // const browserZoomLevel = window.devicePixelRatio * 100;
      // console.log(`window size ${window.innerWidth} ${window.innerHeight} zoom ${browserZoomLevel.toFixed(2)}% `);
      // console.log(`screen size ${screen.width} ${screen.height} `);
      console.log('\nonResize', this.props.name, w, h);

      // Same size as ReactResize except ReactResize notifies of changes
      // const r = this._root.getBoundingClientRect();
      // console.log('\nroot', this.props.name, r.right - r.left, r.bottom - r.top);
    }

    if (this.state.width !== w || this.state.height !== h) {
      this.setState({ width: w, height: h });
    }
  }



  private initLayout = () => {
    const p = this._g.params();

    const e = p.get('editOptions') as number;
    if (e) {
      this._edit = e;
    }

    const v = p.set('containersize', { width: this.state.width, height: this.state.height });
    if (v) {
      const blocks = this._g.blocks();
      if (blocks) {
        blocks.map.forEach((block) => {
          block.touch();
          block.rect();
        });
      }
    }

    this._g.reset();

    this._zIndex = 0;

    // tslint:disable-next-line:no-bitwise
    if (this._debug && this._debug & DebugOptions.data) {
      const params = this._g.params();
      const containersize = params.get('containersize') as ISize;
      if (this._count === 0 && containersize.width && containersize.height) {

        const blocks = this._g.blocks();

        console.log(`RLGLayout debug for ${this.props.name} with generator ${this._g.name()}`);
        console.log('params');
        params.map.forEach((value, key) => {
          console.log(`  ${key} ${JSON.stringify(value)}`);
        });
        console.log('blocks (computed position rects)');
        blocks.map.forEach((value, key) => {
          const r = value.rect();
          console.log(`  ${key} x: ${r.x} y: ${r.y} width: ${r.width} height: ${r.height}`);
        });

        this._count += 1;
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

    let b = this._g.lookup(name);
    if (!b && this._g.create) {
      b = this._g.create({
        index,
        count,
        name,
        g: this._g,
        position
      });
    }

    this._zIndex += 1;
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

    const c = this._g.params().get('containersize') as ISize;
    if (c.width === 0 && c.height === 0) {
      return null;
    }

    const b = this._g.lookup(name);

    if (b) {

      this._zIndex += 1;

      const rect = b.rect();

      // tslint:disable-next-line:no-bitwise
      if (this._debug && (this._debug & DebugOptions.trace)) {
        console.log(`updatePositionedElement ${name} position:`, b.position);
      }

      if (((rect.width) && (rect.height)) || isUnmanaged(b.units.size)) {
        const style = tileStyle(child.props.style,
          rect.x + (offset ? offset.x : 0),
          rect.y + (offset ? offset.y : 0),
          rect.width,
          rect.height,
          b.units.size,
          this._select ? this._select.selected(name) : false,
          b.layer(this._zIndex)
        );

        const editors = this.createEditors(child, b, rect);

        gInProgress -= 1;

        if (b.positionChildren) {
          return this.positionChildren(child, b, name, rect, style);
        } else {
          const editProps = this._edit ? {
            edit: this._edit,
            g: this.props.g,
          } : {};
          const args: IRLGPanelArgs = {
            container: rect,
            block: b,
            edit: this._edit,
            debug: this._debug,
            g: this.props.g,
            context: gContext,
            // update: this.onUpdate
          };

          // const children = React.Children.toArray(child.props.children)
          // const children2 = React.Children.map(child.props.children, nestedChild => {
          //   return nestedChild
          // })

          // if (isUnmanaged(b.units.size)) {
          //   this.createResizeForUnmanaged(b, children2, name);
          // }

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
                  console.log('Local setSize', w, h)
                  const sizeUnit = this._b.position.units.size
                  const r = this._b.rect()
                  if (sizeUnit === Unit.unmanaged) {
                    this._b.updateSize({ width: w, height: h });
                    this._s.width = w
                    this._s.height = h
                  } else if (sizeUnit === Unit.unmanagedWidth) {
                    this._b.updateSize({ width: w, height: r.height });
                    this._s.width = w
                  } else if (sizeUnit === Unit.unmanagedHeight) {
                    this._b.updateSize({ width: r.width, height: h });
                    this._s.height = h
                  }
                }
              }
            }

            // onLayoutResize = (name: string) => {
            //   // Use closure to determine block to update
            //   return (width: number, height: number) => {
            //     const block = this._g.lookup(name);
            //     if (block) {
            //       let w = Math.ceil(width);
            //       let h = Math.ceil(height);

            //       const r = block.fromSize();
            //       if (w === 0) {
            //         w = r.width;
            //       }
            //       if (h === 0) {
            //         h = r.height;
            //       }

            //       // tslint:disable-next-line:no-bitwise
            //       if (this._debug && (this._debug & DebugOptions.info)) {
            //         console.log('onLayoutResize', name, w, h);
            //       }

            //       block.updateSize({ width: w, height: h });

            //       // TODO: Just fire update for unmanaged element
            //       this.setState({ update: this.state.update + 1 });
            //     }
            //   }
            // }

            selectedStyle() {
              return selectedStyle(this._b.rect());
            }
          }

          const local = new Local(b);

          const cc = React.cloneElement(child,
            {
              ...child.props, ...{
                key: b.name,
                id: b.name,
                ref: (c: any) => { if (c) { local.setSize(c.offsetWidth, c.offsetHeight) } },

                ...args,

                ...editProps,

                style: { ...this.props.style, ...child.props.style, ...style }
              }
            },
            child.props.children
          );

          let e;
          if (this._select && this._select.selected(name)) {
            e = (
              <div key={`select${index}`} style={local.selectedStyle()} />
            );
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

    return null;
  }

  // private updateUnmanagedElement = (
  //   child: React.ReactElement<any>,
  //   index: number,
  //   count: number,
  //   name: string,
  //   position: IPosition,
  //   positionChildren: PositionChildren,
  //   offset?: IPoint,
  // ) => {

  //   const c = this._g.params().get('containersize') as ISize;
  //   if (c.width === 0 && c.height === 0) {
  //     return null;
  //   }

  //   const b = this._g.lookup(name);
  //   if (b) {
  //     this._zIndex += 1;

  //     const rect = b.rect();

  //     const style = tileStyle(child.props.style,
  //       rect.x + (offset ? offset.x : 0),
  //       rect.y + (offset ? offset.y : 0),
  //       rect.width,
  //       rect.height,
  //       b.units.size,
  //       this._select ? this._select.selected(name) : false,
  //       b.layer(this._zIndex)
  //     );

  //     const jsx: JSX.Element[] = [];

  //     const children = React.Children.toArray(child.props.children);

  //     this.createResizeForUnmanaged(b, children, name);
  //     const editProps = this._edit ? {
  //       edit: this._edit,
  //       g: this.props.g,
  //     } : {};
  //     const args: IRLGPanelArgs = {
  //       container: rect,
  //       block: b,
  //       edit: this._edit,
  //       debug: this._debug,
  //       g: this.props.g,
  //       context: gContext,
  //       // update: this.onUpdate
  //     };
  //     const ch = React.cloneElement(child,
  //       {
  //         ...child.props, ...{
  //           key: b.name,
  //           id: b.name,

  //           ...args,

  //           ...editProps,

  //           style: { ...this.props.style, ...child.props.style, ...style }
  //         }
  //       },
  //       children
  //     );

  //     if (this._select && this._select.selected(name)) {
  //       jsx.push(
  //         <div key={`select${index}`} style={selectedStyle(rect)}>
  //           {ch}
  //         </div>
  //       );
  //     } else {
  //       jsx.push(ch);
  //     }

  //     const editors = this.createEditors(child, b, rect);

  //     return (
  //       <>
  //         {jsx}
  //         {editors}
  //       </>
  //     );
  //   }
  //   return null;
  // }

  private createLayout = (child: JSX.Element, index: number, count: number) => {
    const p = child.props['data-layout'];

    if (p) {
      if (p.layout && p.name) {
        const ancestor = gLayouts.get(p.layout);
        if (ancestor) {
          return ancestor.createPositionedElement(child, index, count, p.name, p.position, p.context);
        }
      } else

        if (p.name) {
          return this.createPositionedElement(child, index, count, p.name, p.position, p.context);
        }
    }

    return null;
  }

  private updateElement = (child: React.ReactElement<any>, index: number, count: number) => {
    const p = child.props['data-layout'];

    if (p) {
      if (p.layout && p.name) {
        const ancestor = gLayouts.get(p.layout);
        if (ancestor) {
          const location = this.getBoundingLeftTop();
          const ancestorLocation = ancestor.getBoundingLeftTop();
          const offset = { x: ancestorLocation.x - location.x, y: ancestorLocation.y - location.y };
          // console.log(`dynamic offset ${offset.x} ${offset.y} 
          //   location ${location.x} ${location.y}
          //   ancestorLocation ${ancestorLocation.x} ${ancestorLocation.y}
          //   `)
          // const position = p.position as IPosition;
          // if (position && position.units.size >= Unit.unmanaged) {
          //   // size determined by element.offsetWidth and element offsetHeight

          //   return ancestor.updateUnmanagedElement(
          //     child, index, count, p.name, p.position, p.context, offset
          //   );

          // }
          return ancestor.updatePositionedElement(
            child, index, count, p.name, p.position, p.context, offset
          );
        }
      } else

        if (p.name) {
          // const position = p.position as IPosition;
          // if (position && position.units.size >= Unit.unmanaged) {
          //   // size determined by element.offsetWidth and element offsetHeight

          //   return this.updateUnmanagedElement(
          //     child, index, count, p.name, p.position, p.context
          //   );

          // }
          return this.updatePositionedElement(
            child, index, count, p.name, p.position, p.context
          );
        }
    }

    return React.cloneElement(child,
      {
        ...child.props, ...{

          edit: this._edit,
          debug: this._debug,
          context: gContext,
          g: this.props.g,

          style: child.props.style
        }
      },
      child.props.children
    );
    // return React.Children.map(child.props.children, nestedChild => {
    //   console.error(`
    //     Child ${nestedChild} in RLGLayout ${this.props.name} will not be rendered.
    //     Only RLGLayout children with a data-layout property will be rendered.
    //     `)
    // });
  }

  private onParentMouseDown = (event: React.MouseEvent) => {
    // tslint:disable-next-line:no-bitwise
    if (this._debug && (this._debug & DebugOptions.mouseEvents)) {
      console.log(`RLGLayout onParentMouseDown ${this.props.name} ${event.target}`);
    }

    if (
      event.button !== 2 &&
      this._select &&
      this._select.selected.length
    ) {
      this._select.clear();
    }

    event.stopPropagation();
    this.handleContextMenu(event);
  }

  private onParentContextMenu = (block?: Block) => {
    return (event: React.MouseEvent) => {
      // tslint:disable-next-line:no-bitwise
      if (this._debug && (this._debug & DebugOptions.mouseEvents)) {
        console.log(`RLGLayout onParentContextMenu ${this.props.name} ${event.target}`);
      }

      event.preventDefault();
      this.setState({ contextMenu: block, contextMenuActive: true });
    }
  }

  // private onContextMenu = (block?: Layout) => {
  //   return (event: React.MouseEvent) => {
  //     // tslint:disable-next-line:no-bitwise
  //     if (this._debug && (this._debug & DebugOptions.mouseEvents)) {
  //       console.log(`RLGLayout onContextMenu ${this.props.name} ${event.target}`);
  //     }

  //     event.preventDefault();
  //     this.setState({ contextMenu: block, contextMenuActive: true });
  //   }
  // }


  private generateContextMenu = (block?: Block) => {

    const menuItems: IMenuItem[] | undefined = this._select && this._select.commands;

    if (menuItems && block && block.editor && block.editor.contextMenu) {
      const contextMenu = block.editor.contextMenu;
      menuItems.push({ name: '' });
      contextMenu.forEach((item: IMenuItem) => {
        menuItems.push(item);
      })
    }

    return menuItems;
  }

  private onHtmlMouseUp = (event: MouseEvent) => {
    if (event) {
      // tslint:disable-next-line:no-bitwise
      if (this._debug && (this._debug & DebugOptions.mouseEvents)) {
        console.log(`RLGLayout onHtmlMouseUp ${this.props.name} ${event.target}`);
      }

      event.preventDefault();
      this.removeEventListeners();

      this.hideMenu();
    }
  }

  private hideMenu = () => {
    if (this.state.contextMenuActive) {
      this.setState({ contextMenu: undefined, contextMenuActive: false });
    }
  }

  private addEventListeners = () => {
    document.addEventListener('mouseup', this.onHtmlMouseUp);
  }

  private removeEventListeners = () => {
    document.removeEventListener('mouseup', this.onHtmlMouseUp);
  }

  private selectCallback = (instance: RLGSelect) => {
    this._select = instance
  }

  private onUpdate = (reset: boolean = false) => {
    if (reset) {
      this.setState({ update: 0 });
    } else {
      this.setState({ update: this.state.update + 1 });
    }
  }

  private frameStart = () => {
    this._startRendering = Date.now();
    return null;
  }

  private frameEnd = () => {
    // tslint:disable-next-line:no-bitwise
    if (this._debug & DebugOptions.timing) {
      console.log('frameTime: ', (Date.now() - this._startRendering) + ' ms');
    }
    return null;
  }

  private content = () => {
    const count = React.Children.count(this.props.children);
    gInProgress += count;

    // tslint:disable-next-line:no-bitwise
    if (this._debug && (this._debug & DebugOptions.trace)) {
      const containersize = this._g.params().get('containersize') as ISize;
      console.log(`\ncontent ${this._g.name()} containersize: ${containersize.width}, ${containersize.height}`);
    }

    // Phase I create if necessary
    React.Children.map(this.props.children, (child, i) => {
      const c = child as React.ReactElement<any>
      if (c) {
        if (c.type === React.Fragment) {
          React.Children.map(c.props.children, (nChild, ni) => {
            const nc = nChild as React.ReactElement<any>;
            const nCount = React.Children.count(nc.props.children);
            this.createLayout(nc, ni, nCount);
          })
        } else {
          // tslint:disable-next-line:no-any
          this.createLayout(c, i, count);
          // }
        }
      }
    });

    // Phase II update
    const elements = (
      React.Children.map(this.props.children, (child, i) => {
        const c = child as React.ReactElement<any>
        if (c) {
          if (c.type === React.Fragment) {
            return React.Children.map(c.props.children, (nChild, ni) => {
              const nc = nChild as React.ReactElement<any>;
              const nCount = React.Children.count(nc.props.children);
              return this.updateElement(nc, ni, nCount);
            })
          } else {
            // tslint:disable-next-line:no-any
            return this.updateElement(child as React.ReactElement<any>, i, count);
          }
        }
        return null;
      })
    );


    if (elements && this.props.edit) {
      elements.unshift(
        <RLGSelect
          name={`select-${name}`}
          key={`select-${name}`}
          debug={this._debug}
          selectCallback={this.selectCallback}
          boundary={{ x: 0, y: 0, width: this.state.width, height: this.state.height }}
          onUpdate={this.onUpdate}
          g={this._g}
        />
      );
    }

    if (elements && this.props.containersize === undefined) {
      elements.push(
        <ReactResizeDetector
          key={`contentResizeDetector ${this.props.name}`}
          handleWidth={true}
          handleHeight={true}
          onResize={this.onResize}
        />);
    }

    return elements;
  }

  // private createResizeForUnmanaged(b: Block, children: React.ReactChild[], name: string) {
  //   if (b.units.size === Unit.unmanaged) {
  //     children.push(<ReactResizeDetector
  //       key={`unmanagedResizeDetector`}
  //       handleWidth={true}
  //       handleHeight={true}
  //       onResize={this.onLayoutResize(name)}
  //     />);
  //   }
  //   if (b.units.size === Unit.unmanagedHeight) {
  //     children.push(<ReactResizeDetector
  //       key={`unmanagedResizeDetector`}
  //       handleWidth={false}
  //       handleHeight={true}
  //       onResize={this.onLayoutResize(name)}
  //     />);
  //   }
  //   if (b.units.size === Unit.unmanagedWidth) {
  //     children.push(<ReactResizeDetector
  //       key={`unmanagedResizeDetector`}
  //       handleWidth={true}
  //       handleHeight={false}
  //       onResize={this.onLayoutResize(name)}
  //     />);
  //   }
  // }

  private handleContextMenu(event: React.MouseEvent<Element>) {
    if (event.button === 2) { // Right click
      event.preventDefault();
      const currentTargetRect = event.currentTarget.getBoundingClientRect();
      const offsetX = event.pageX - currentTargetRect.left;
      const offsetY = event.pageY - currentTargetRect.top;
      this._menuLocation = { x: offsetX, y: offsetY };
      this.addEventListeners();
    } else {
      this.hideMenu();
    }
  }

  private positionChildren(child: React.ReactElement<any>, b: Block, name: string, rect: IRect, style: React.CSSProperties) {
    const editProps = {
      edit: this._edit,
      g: this.props.g,
    };

    const nestedChildren = React.Children.map(child.props.children, (nestedChild, i) => {
      const nestedLayout = b.positionChildren!(b, b.generator, i);
      if (nestedLayout) {
        const nestedRect = nestedLayout.rect();
        const nestedStyle = tileStyle(
          nestedChild.props.style,
          nestedRect.x,
          nestedRect.y,
          nestedRect.width,
          nestedRect.height,
          b.units.size,
          this._select ? this._select.selected(name) : false,
          b.layer(this._zIndex)
        );
        const nArgs: IRLGPanelArgs = {
          container: nestedRect,
          block: b,
          edit: this._edit,
          debug: this._debug,
          g: this.props.g,
          context: gContext,
          // update: this.onUpdate
        };
        return (React.cloneElement(nestedChild,
          {
            ...nestedChild.props, ...{
              key: `${nestedChild.key}`,
              id: `${nestedChild.key}`,

              ...nArgs,

              ...editProps,
              style: { ...this.props.style, ...nestedChild.props.style, ...nestedStyle }
            }
          },
          nestedChild.props.children));
      }
      return null;
    });
    const args: IRLGPanelArgs = {
      container: rect,
      block: b,
      edit: this._edit,
      debug: this._debug,
      g: this.props.g,
      context: gContext,
      // update: this.onUpdate
    };
    return (React.cloneElement(child,
      {
        ...child.props, ...{
          key: b.name,
          id: b.name,

          ...args,

          ...editProps,

          style: { ...this.props.style, ...child.props.style, ...style }
        }
      },
      nestedChildren));
  }

  private createEditors(child: React.ReactElement<any>, b: Block, rect: { y: number; x: number; width: number; height: number; }) {
    const editors: React.ReactChild[] = [];
    if (this._edit) {
      if (child.props.onMouseDown) {
        const fn = child.props.onMouseDown as (e: React.MouseEvent) => void;
        b.onMouseDown = fn;
      }
      if (child.props.onClick) {
        const fn = child.props.onClick as (e: React.MouseEvent) => void;
        b.onClick = fn;
      }
      if (b.editor && b.editor.edits) {
        let allow = true;
        b.editor.edits.forEach((item, i) => {
          // filter unmanaged edits
          if (b.units.size === Unit.unmanagedWidth &&
            (item.ref === PositionRef.bottom || item.ref === PositionRef.top)
          ) {
            allow = false;
          }
          if (b.units.size === Unit.unmanagedHeight &&
            (item.ref === PositionRef.left || item.ref === PositionRef.right)
          ) {
            allow = false;
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
                boundary={{ x: 0, y: 0, width: this.state.width, height: this.state.height }}
                onUpdate={this.onUpdate}
                zIndex={b.layer(this._zIndex)}
              />);
          } else {
            console.error(`Cannot edit ${namedPositionRef(item.ref)} for block 
            ${name} when size is set to 
            ${namedUnit(b.units.size)}`
            )
          }
        });
      } else {
        const edit = { ref: PositionRef.position };
        b.setEditDefaults(edit);
        editors.push(
          <RLGEditLayout
            key={`edit${b.name}`}
            edit={edit}
            block={b!}
            debug={this._debug}
            select={this._select}
            handle={rect}
            boundary={{ x: 0, y: 0, width: this.state.width, height: this.state.height }}
            onUpdate={this.onUpdate}
            zIndex={b.layer(this._zIndex)}
          />);
      }
    }
    return editors;
  }
}