import * as React from 'react';
import ReactResizeDetector from 'react-resize-detector';

import LayoutGenerator, { ILayoutGenerator, ILayout, IEdit, PositionRef, Params, Value } from './LayoutGenerator';
import { IPoint, IRect } from './types';
// import { string } from 'prop-types';

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

interface editStyleProps {
  cursor: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

function editStyle(props: editStyleProps): React.CSSProperties {
  //  console.log('editStyle', props.x, props.y, props.width, props.height);

  // console.log(style);
  return {
    boxSizing: 'border-box' as 'border-box',
    transformOrigin: 0,
    transform: `translate(${props.x}px, ${props.y}px)`,
    width: `${props.width}px`,
    height: `${props.height}px`,
    position: 'absolute' as 'absolute',
    cursor: props.cursor,
    background: 'rgba(0, 0, 0, 0.0)',
    zIndex: 1000,
    borderWidth: '4px'
  }
}

export interface RLGHandleProps extends React.HTMLProps<HTMLDivElement> {
  rlgDrag: editStyleProps;
  params: Params;
  edit: IEdit;
  layout: ILayout;
  onUpdate: () => void
}

interface RLGHandleState {

}

export class RLGHandle extends React.Component<RLGHandleProps, RLGHandleState> {

  value: Value | undefined;
  origin: IPoint;

  constructor(props: RLGHandleProps) {
    super(props);
    this.state = {

    }
    // console.log('RLGHandleProps', this.props);
  }

  addEventListeners() {
    document.addEventListener('mouseup', this.onHtmlMouseUp);
    document.addEventListener('mousemove', this.onHtmlMouseMove);
    document.addEventListener('touchmove', this.onHtmlTouchMove);
  }

  removeEventListeners() {
    document.removeEventListener('mouseup', this.onHtmlMouseUp);
    document.removeEventListener('mousemove', this.onHtmlMouseMove);
    document.removeEventListener('touchmove', this.onHtmlTouchMove);
  }

  initUpdate(x: number, y: number) {
    this.origin = { x, y };
    this.value = this.props.params.get(this.props.edit.variable);
  }

  moveUpdate(x: number, y: number) {

    let value;
    if (typeof this.value === 'number') {
      value = this.value;
    } else {
      // Clone value
      value = Object.assign({}, this.value);
    }

    const v = this.props.edit.update(value, this.props.edit.positionRef, (x - this.origin.x), (y - this.origin.y));
    console.log('this.props.edit.variable ' + this.props.edit.variable, v);
    this.props.params.set(this.props.edit.variable, v);

    this.props.onUpdate();
  }

  onMouseDown = (event: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
      this.addEventListeners();
      this.initUpdate(event.clientX, event.clientY);
      console.log('onMouseDown', event.clientX, event.clientY);
    }
  }

  onHtmlMouseMove = (event: MouseEvent) => {
    if (event) {
      event.preventDefault();
      this.moveUpdate(event.clientX, event.clientY);
      // console.log('onMouseMove', event.clientX, event.clientY);
    }
  }

  onHtmlMouseUp = (event: MouseEvent) => {
    if (event) {
      event.preventDefault();
      this.removeEventListeners();
      console.log('onMouseUp', event.clientX, event.clientY);
    }
  }

  onHtmlTouchMove = (event: TouchEvent) => {
    // TODO implement support for touch
  }

  render = () => {
    // console.log('RLGHandleProps', this.props.rlgDrag);
    return (
      <div style={editStyle(this.props.rlgDrag)}
        onMouseDown={this.onMouseDown}
      />
    );
  }
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
    console.log('onResize', width, height);
    if (this.state.width != width || this.state.height != height) {

      this.setState({ width: width, height: height });
    }
  }

  initLayout = () => {
    this.key = 0;
    this.editOverlay = [];
    const p = this.derivedLayout.params();
    p.set('width', this.state.width);
    p.set('height', this.state.height);
    this.derivedLayout.reset();
  }

  createPositionedElement = (child: React.ReactElement<any>, name: string, rect: IRect) => {

    const b = this.derivedLayout.lookup(name, rect);
    if (b) {
      if ((b.location.right - b.location.left) && (b.location.bottom - b.location.top)) {
        console.log('createPositionedElement', b);
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

  createListElemement = (child: React.ReactElement<any>) => {
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
      return this.createPositionedElement(child, p['name'], p['create']);
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
              case PositionRef.height_top: {
                break;
              }
              case PositionRef.height_bottom: {
                break;
              }
              case PositionRef.width_left: {
                cursor = 'col-resize';
                left = layout.location.left;
                top = layout.location.top;
                width = 4;
                height = layout.location.bottom - layout.location.top;
                break;
              }
              case PositionRef.width_right: {
                cursor = 'col-resize';
                left = layout.location.right;
                top = layout.location.top;
                width = 4;
                height = layout.location.bottom - layout.location.top;
                break;
              }
              case PositionRef.point_left_top: {
                cursor: 'nw-resize';
                break;
              }
              case PositionRef.point_right_top: {
                cursor: 'ne-resize';
                break;
              }
              case PositionRef.point_left_bottom: {
                cursor: 'nw-resize';
                break;
              }
              case PositionRef.point_right_bottom: {
                cursor: 'ne-resize';
                break;
              }
              default: {
                break;
              }
            }
            if (width && height) {
              jsx.push(<RLGHandle
                key={layout.name + cursor}
                onUpdate={this.onUpdate}
                edit={item}
                layout={layout}
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

  render(): React.ReactNode {
    this.frameStart();
    this.initLayout();
    return (
      /* style height of 100% necessary for correct height  */
      <div style={{ height: '100%' }}>
        {React.Children.map(this.props.children, child =>
          // tslint:disable-next-line:no-any
          this.createElement(child as React.ReactElement<any>)
        )}
        {this.createEditHandles()}
        <ReactResizeDetector handleWidth handleHeight onResize={this.onResize} />
        {this.frameEnd()}
      </div>
    )
  }
}