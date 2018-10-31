import * as React from 'react';
import ReactResizeDetector from 'react-resize-detector';
import RLGHandle from './RLGHandle'
import LayoutGenerator, { ILayoutGenerator, ILayout, IEdit, PositionRef } from './LayoutGenerator';
import { IPosition } from './types';
import RLGQuadTree from './RLGQuadTree';

function tileStyle(style: React.CSSProperties, x: number, y: number, width: number, height: number): React.CSSProperties {

  // console.log(style);
  return {
    boxSizing: 'border-box' as 'border-box',
    transformOrigin: 0,
    transform: `translate(${x}px, ${y}px)`,
    width: `${width}px`,
    height: `${height}px`,
    position: 'absolute' as 'absolute',
    ...style
  };
}

export interface ReactLayoutProps extends React.HTMLProps<HTMLDivElement> {
  name: string;
  editLayout?: boolean;
  save?: (name: string, params: string, layouts: string) => void;
  load?: (name: string) => { params: string, layouts: string }
  g: LayoutGenerator;
}

export interface ReactLayoutState {
  width: number;
  height: number;
  update: number;
}

export default class ReactLayout extends React.Component<ReactLayoutProps, ReactLayoutState> {
  derivedLayout: ILayoutGenerator;
  key: number;
  editLayout: boolean = false;
  editOverlay: Array<ILayout> = [];
  startRendering: number;
  quadTree: RLGQuadTree;

  constructor(props: ReactLayoutProps) {
    super(props);
    this.key = 0;
    this.state = {
      width: 0,
      height: 0,
      update: 0
    }

    this.editLayout = props.editLayout ? props.editLayout : false;

    // this.divRef = React.createRef();

    this.derivedLayout = this.props.g;
  }

  onResize = (width: number, height: number) => {
    // console.log('onResize', width, height);
    if (this.state.width != width || this.state.height != height) {

      this.setState({ width: width, height: height });
      this.initLayout();

    }
  }

  initLayout = () => {
    this.key = 0;
    this.editOverlay = [];
    const p = this.derivedLayout.params();
    const w = p.set('width', this.state.width);
    const h = p.set('height', this.state.height);
    if (w || h) {
      const layouts = this.derivedLayout.layouts();
      if (layouts) {
        layouts.forEach((layout) => {
          p.touch(layout);
        });
      }
    }
    this.derivedLayout.reset();
    this.quadTree = new RLGQuadTree(0, 0, this.state.width, this.state.height);
  }

  createPositionedElement = (child: React.ReactElement<any>, name: string, position: IPosition) => {

    let b = this.derivedLayout.lookup(name);
    if (!b && position && this.derivedLayout.create) {
      b = this.derivedLayout.create(name, position);
      // console.log('createPositionedElement', b, position);
    }

    if (b) {
      if ((b.location.right - b.location.left) && (b.location.bottom - b.location.top)) {
        const style = tileStyle(child.props['style'],
          b.location.left,
          b.location.top,
          (b.location.right - b.location.left),
          (b.location.bottom - b.location.top)
        );

        if (this.editLayout && b.editSize) {
          this.editOverlay.push(b)
        }
        let props = { style: style };
        return React.cloneElement(child, props, child.props.children);
      }
    }

    return null;
  }

  createListElement = (child: React.ReactElement<any>) => {
    // TODO: Not called - still needed?
    let item: ILayout | undefined = this.derivedLayout.next();
    if (item) {
      const style = tileStyle(
        child.props['style'],
        item.location.left,
        item.location.top,
        (item.location.right - item.location.left),
        (item.location.bottom - item.location.top)
      );
      // console.log('CreateElements style', style);
      return (
        <div
          style={style}
          key={item.name + '-' + child.key}
        >
          {/* Design Layout */}
          <div style={{
            height: '100%',
            width: '100%',
            border: '1px solid red',
            //padding: '10px',
            //margin: '10px',
            backgroundColor: 'grey',
            color: 'white'
          }}>
            {item.name + '-' + child.key}
          </div>
          {/* Child with modification Infinity mapped to this.height this.width - padding*/}
        </div>
      );
    }

    return null;
  }

  createElement = (child: React.ReactElement<any>) => {
    const p: Object = child.props['data-layout'];
    if (p && p['name']) {
      return this.createPositionedElement(child, p['name'], p['position']);
    } else {

    }

    return null;
  }

  createEditHandles = () => {
    let jsx: Array<any> = [];
    if (this.props.editLayout) {
      this.editOverlay.map((layout: ILayout) => {
        if (layout.editSize) {
          layout.editSize.map((item: IEdit) => {
            let cursor = 'default';
            let left = 0;
            let top = 0;
            let width = 0;
            let height = 0;
            switch (item.positionRef) {
              case PositionRef.rect: {
                cursor = 'move';
                left = layout.location.left;
                top = layout.location.top;
                width = layout.location.right - layout.location.left;
                height = layout.location.bottom - layout.location.top;
                break;
              }
              case PositionRef.position: {
                cursor = 'move';
                left = layout.location.left;
                top = layout.location.top;
                width = layout.location.right - layout.location.left;
                height = layout.location.bottom - layout.location.top;
                break;
              }
              case PositionRef.scalar_height_top: {
                break;
              }
              case PositionRef.scalar_height_bottom: {
                break;
              }
              case PositionRef.scalar_width_left: {
                cursor = 'w-resize';
                left = layout.location.left;
                top = layout.location.top;
                width = 4;
                height = layout.location.bottom - layout.location.top;
                break;
              }
              case PositionRef.scalar_width_right: {
                cursor = 'w-resize';
                left = layout.location.right;
                top = layout.location.top;
                width = 4;
                height = layout.location.bottom - layout.location.top;
                break;
              }
              case PositionRef.position_height_top: {
                cursor = 'n-resize';
                break;
              }
              case PositionRef.position_height_bottom: {
                cursor = 'w-resize';
                break;
              }
              case PositionRef.position_width_left: {
                cursor = 'w-resize';
                break;
              }
              case PositionRef.position_width_right: {
                cursor = 'w-resize';
                left = layout.location.right;
                top = layout.location.top;
                width = 4;
                height = layout.location.bottom - layout.location.top;
                break;
              }
              case PositionRef.rect_point_left_top: {
                cursor: 'nw-resize';
                break;
              }
              case PositionRef.rect_point_right_top: {
                cursor: 'ne-resize';
                break;
              }
              case PositionRef.rect_point_left_bottom: {
                cursor: 'nw-resize';
                break;
              }
              case PositionRef.rect_point_right_bottom: {
                cursor: 'ne-resize';
                break;
              }
              default: {
                console.error(`Invalid PositionRef ${item.positionRef}`);
                break;
              }
            }
            if (width && height) {
              jsx.push(<RLGHandle
                key={layout.name + cursor}
                onUpdate={this.onUpdate}
                edit={item}
                layout={layout}
                boundary={{ top: 0, left: 0, right: this.state.width, bottom: this.state.height }}
                params={this.derivedLayout.params()}
                rlgDrag={{ cursor: cursor, x: left, y: top, width: width, height: height }} />)
            }
          });
        }
      })
    }
    return jsx;
  }

  onUpdate = () => {
    this.setState({ update: 1 });
  }

  frameStart = () => {
    this.startRendering = Date.now();
    return null;
  }

  frameEnd = () => {
    console.log('frameTime: ', (Date.now() - this.startRendering) + ' ms');
    return null;
  }

  content = () => {
    if (this.state.width && this.state.height) {
      // Only show content if width and height are not 0
      return (
        <>
          {React.Children.map(this.props.children, child =>
            // tslint:disable-next-line:no-any
            this.createElement(child as React.ReactElement<any>)
          )}
          {this.createEditHandles()}
        </>
      )
    }

    return null;
  }

  render(): React.ReactNode {
    this.frameStart();
    this.initLayout();

    return (
      /* style height of 100% necessary for correct height  */
      <div style={{ height: '100%' }}>
        {this.content()}
        <ReactResizeDetector handleWidth handleHeight onResize={this.onResize} />
        {this.frameEnd()}
      </div>
    )
  }
}