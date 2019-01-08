import * as React from 'react';
import ReactResizeDetector from 'react-resize-detector';

import Layout, {
  IMenuItem,
  IPosition,
  PositionChildren
} from './components/Layout';
import { ParamValue } from './components/Params';
import RLGContextMenu from './editors/RLGContextMenu';
import RLGEditLayout from './editors/RLGEditLayout';
import RLGSelect from './editors/RLGSelect';
import { IGenerator } from './generators/Generator';
import { IRLGPanelArgs } from './RLGPanel';
import { DebugOptions, DebugOptionsArray, EditOptions, IPoint, IRect, ISize, namedPositionRef, PositionRef, Unit,
  namedUnit, } from './types';

interface ILayoutStyle {
  style: React.CSSProperties;
  rect: IRect;
  position: IPosition;
  selected: boolean;
  zIndex: number;
}

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

export function layoutStyle(args: ILayoutStyle) {
  return tileStyle(
    args.style,
    args.rect.x,
    args.rect.y,
    args.rect.width,
    args.rect.height,
    args.position.units.size,
    args.selected,
    args.zIndex);
}

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

  // For selected elements
  // const border = selected ? {
  //   borderStyle: 'dotted',
  //   borderWidth: '1px',
  //   borderColor: 'red',
  //   padding: '3px'
  // } : {};

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
    overflow: 'hidden',
    ...style
  };
}

export let gInProgress: number = 0;


export const gLayouts: Map<string, RLGLayout> = new Map();

export interface IRLGLayoutProps extends React.HTMLProps<HTMLElement> {
  name: string;
  edit?: EditOptions;
  save?: (name: string, params: string, layouts: string) => void;
  load?: (name: string) => { params: string, layouts: string };
  containersize?: ISize;
  debug?: DebugOptions | DebugOptionsArray;
  g: IGenerator;
  params?: Array<[string, ParamValue]>;
}

export interface IRLGLayoutState {
  width: number;
  height: number;
  update: number;
  contextMenu: Layout | undefined;
  contextMenuActive: boolean;
  devicePixelRatio: number;
}

export class RLGLayout extends React.Component<IRLGLayoutProps, IRLGLayoutState> {
  private _root: HTMLDivElement | undefined = undefined;
  private _g: IGenerator;
  private _data: Map<string, any> = new Map();
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
      height: 0,
      update: 0,
      width: 0,
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

    this.initLayout();

    // this.state.update can be used for debug tracing during or after editing
    // if (this.state.update === 0) {
    //   console.log('render');
    // }

    if (this.props.edit) {
      this.frameStart();
      return (
        /* style height of 100% necessary for ReactResizeDetector to work  */
        <div
          id={'main'}
          ref={this.onRootRef}
          style={{ height: '100%', width: '100%' }}
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
        style={{ height: '100%', width: '100%' }}
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

  private onLayoutResize = (name: string) => {
    // Use closure to determine layout to update
    return (width: number, height: number) => {
      const layout = this._g.lookup(name);
      if (layout) {
        let w = Math.ceil(width);
        let h = Math.ceil(height);

        const r = layout.fromSize();
        if (w === 0) {
          w = r.width;
        }
        if (h === 0) {
          h = r.height;
        }

        // tslint:disable-next-line:no-bitwise
        if (this._debug && (this._debug & DebugOptions.info)) {
          console.log('onLayoutResize', name, w, h);
        }

        layout.updateSize({ width: w, height: h });

        // TODO: Just fire update for unmanaged element
        this.setState({ update: this.state.update + 1 });
      }
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
      const layouts = this._g.layouts();
      if (layouts) {
        layouts.map.forEach((layout) => {
          layout.touch();
          layout.rect();
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

        const layouts = this._g.layouts();

        console.log(`RLGLayout debug for ${this.props.name} with generator ${this._g.name()}`);
        console.log('params');
        params.map.forEach((value, key) => {
          console.log(`  ${key} ${JSON.stringify(value)}`);
        });
        console.log('layouts (computed position rects)');
        layouts.map.forEach((value, key) => {
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

    const props = this.props as { [key: string]: string };
    // tslint:disable-next-line:no-string-literal
    if (!b && props['layouts']) {
      // tslint:disable-next-line:no-string-literal
      const rl = gLayouts.get(props['layouts']);
      if (rl) {
        //
      }
    }
    if (b) {

      this._zIndex += 1;

      const rect = b.rect();

      // tslint:disable-next-line:no-bitwise
      if (this._debug && (this._debug & DebugOptions.trace)) {
        console.log(`updatePositionedElement ${name} position:`, b.position);
      }

      if ((rect.width) && (rect.height)) {
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
            layout: b,
            edit: this._edit,
            debug: this._debug,
            g: this.props.g,
            context: this._data,
            // update: this.onUpdate
          };
          const cc = React.cloneElement(child,
            {
              ...child.props, ...{
                key: b.name,

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
              <div style={selectedStyle(rect)} />
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

  private updateUnmanagedElement = (
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

      const style = tileStyle(child.props.style,
        rect.x + (offset ? offset.x : 0),
        rect.y + (offset ? offset.y : 0),
        rect.width,
        rect.height,
        b.units.size,
        this._select ? this._select.selected(name) : false,
        b.layer(this._zIndex)
      );

      const jsx: JSX.Element[] = [];

      const children = React.Children.toArray(child.props.children);

      if (b.units.size === Unit.unmanaged) {
        children.push(<ReactResizeDetector
          key={`unmanagedResizeDetector`}
          handleWidth={true}
          handleHeight={true}
          onResize={this.onLayoutResize(name)} />
        );
      } 
      if (b.units.size === Unit.unmanagedHeight) {
        children.push(<ReactResizeDetector
          key={`unmanagedResizeDetector`}
          handleWidth={false}
          handleHeight={true}
          onResize={this.onLayoutResize(name)} />
        );
      }
      if (b.units.size === Unit.unmanagedWidth) {
        children.push(<ReactResizeDetector
          key={`unmanagedResizeDetector`}
          handleWidth={true}
          handleHeight={false}
          onResize={this.onLayoutResize(name)} />
        );
      }
      const editProps = this._edit ? {
        edit: this._edit,
        g: this.props.g,
      } : {};
      const args: IRLGPanelArgs = {
        container: rect,
        layout: b,
        edit: this._edit,
        debug: this._debug,
        g: this.props.g,
        context: this._data,
        // update: this.onUpdate
      };
      const ch = React.cloneElement(child,
        {
          ...child.props, ...{
            key: b.name,

            ...args,

            ...editProps,

            style: { ...this.props.style, ...child.props.style, ...style }
          }
        },
        children
      );

      if (this._select && this._select.selected(name)) {
        jsx.push(
          <div style={selectedStyle(rect)}>
            {ch}
          </div>
        );
      } else {
        jsx.push(ch);
      }

      const editors = this.createEditors(child, b, rect);

      return (
        <>
          {jsx}
          {editors}
        </>
      );
    }
    return null;
  }

  private createLayout = (child: JSX.Element, index: number, count: number) => {
    const p = child.props['data-layout'];

    if (p) {
      if (p.layout && p.name) {
        const ancestor = gLayouts.get(p.layout);
        if (ancestor) {
          return ancestor.createPositionedElement(child, index, count, p.name, p.position, p.context);
        }
      } else if (p.name) {
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
          const position = p.position as IPosition;
          if (position && position.units.size >= Unit.unmanaged) {
            // size determined by element.offsetWidth and element offsetHeight

            return ancestor.updateUnmanagedElement(
              child, index, count, p.name, p.position, p.context, offset
            );

          }
          return ancestor.updatePositionedElement(
            child, index, count, p.name, p.position, p.context, offset
          );
        }
      } else if (p.name) {
        const position = p.position as IPosition;
        if (position && position.units.size >= Unit.unmanaged) {
          // size determined by element.offsetWidth and element offsetHeight

          return this.updateUnmanagedElement(
            child, index, count, p.name, p.position, p.context
          );

        }
        return this.updatePositionedElement(
          child, index, count, p.name, p.position, p.context
        );
      }
    }

    return React.Children.map(child.props.children, nestedChild => {
      console.error(`
        Child ${nestedChild} in RLGLayout ${this.props.name} will not be rendered.
        Only RLGLayout children with a data-layout property will be rendered.
        `)
    });
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

  private onParentContextMenu = (layout?: Layout) => {
    return (event: React.MouseEvent) => {
      // tslint:disable-next-line:no-bitwise
      if (this._debug && (this._debug & DebugOptions.mouseEvents)) {
        console.log(`RLGLayout onParentContextMenu ${this.props.name} ${event.target}`);
      }

      event.preventDefault();
      this.setState({ contextMenu: layout, contextMenuActive: true });
    }
  }

  // private onContextMenu = (layout?: Layout) => {
  //   return (event: React.MouseEvent) => {
  //     // tslint:disable-next-line:no-bitwise
  //     if (this._debug && (this._debug & DebugOptions.mouseEvents)) {
  //       console.log(`RLGLayout onContextMenu ${this.props.name} ${event.target}`);
  //     }

  //     event.preventDefault();
  //     this.setState({ contextMenu: layout, contextMenuActive: true });
  //   }
  // }


  private generateContextMenu = (layout?: Layout) => {

    const menuItems: IMenuItem[] | undefined = this._select && this._select.commands;

    if (menuItems && layout && layout.editor && layout.editor.contextMenu) {
      const contextMenu = layout.editor.contextMenu;
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

  private select = (instance: RLGSelect) => {
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


    if (this.props.edit) {
      elements.unshift(
        <RLGSelect
          name={`select-${name}`}
          key={`select-${name}`}
          debug={this._debug}
          select={this.select}
          boundary={{ x: 0, y: 0, width: this.state.width, height: this.state.height }}
          onUpdate={this.onUpdate}
          g={this._g}
        />
      );
    }

    elements.push(
      <ReactResizeDetector
        key={`contentResizeDetector ${this.props.name}`}
        handleWidth={true}
        handleHeight={true}
        onResize={this.onResize}
      />);

    return elements;
  }

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

  private positionChildren(child: React.ReactElement<any>, b: Layout, name: string, rect: IRect, style: React.CSSProperties) {
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
          layout: b,
          edit: this._edit,
          debug: this._debug,
          g: this.props.g,
          context: this._data,
          // update: this.onUpdate
        };
        return (React.cloneElement(nestedChild,
          {
            ...nestedChild.props, ...{
              key: `${nestedChild.key}`,

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
      layout: b,
      edit: this._edit,
      debug: this._debug,
      g: this.props.g,
      context: this._data,
      // update: this.onUpdate
    };
    return (React.cloneElement(child,
      {
        ...child.props, ...{
          key: b.name,

          ...args,

          ...editProps,

          style: { ...this.props.style, ...child.props.style, ...style }
        }
      },
      nestedChildren));
  }

  private createEditors(child: React.ReactElement<any>, b: Layout, rect: { y: number; x: number; width: number; height: number; }) {
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
                layout={b!}
                debug={this._debug}
                select={this._select}
                handle={rect}
                boundary={{ x: 0, y: 0, width: this.state.width, height: this.state.height }}
                onUpdate={this.onUpdate}
                zIndex={b.layer(this._zIndex)}
              />);
          } else {
            console.error(`Cannot edit ${namedPositionRef(item.ref)} for layout 
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
            layout={b!}
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