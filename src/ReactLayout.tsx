import * as React from 'react';
import ReactResizeDetector from 'react-resize-detector';

import LayoutGenerator, { ILayoutGenerator, ILayout, IEdit, PositionRef } from './LayoutGenerator';
import { IPoint } from './types';

let gCount = 1;

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

function editStyle(cursor: string, x: number, y: number, width: number, height: number): React.CSSProperties {
  console.log('editStyle', x, y, width, height);

  // console.log(style);
  return {
    boxSizing: 'border-box' as 'border-box',
    transformOrigin: 0,
    transform: `translate(${x}px, ${y}px)`,
    width: `${width}px`,
    height: `${height}px`,
    position: 'absolute' as 'absolute',
    cursor: cursor,
    background: 'rgba(0, 0, 0, 0.1)',
    zIndex: 1000
  }
}

export interface RLGHandleProps extends React.HTMLProps<HTMLDivElement> {
  rlgStyle: React.CSSProperties;
}

export class RLGHandle extends React.Component<RLGHandleProps, {}> {

  constructor(props: RLGHandleProps) {
    super(props);
    console.log('RLGHandleProps', this.props.rlgStyle);
  }

  onMouseDown = (event: React.MouseEvent) => {
    if (event) {
      console.log('onMouseDown', event.clientX, event.clientY);
    }
  }

  onMouseMove = (event: React.MouseEvent) => {
    if (event) {
      console.log('onMouseMove', event.clientX, event.clientY);
    }
  }

  onMouseUp = (event: React.MouseEvent) => {
    if (event) {
      console.log('onMouseUp', event.clientX, event.clientY);
    }
  }

  render = () => {
    console.log('RLGHandleProps', this.props.rlgStyle);
    return (
      <div style={this.props.rlgStyle} onMouseDown={this.onMouseDown} onMouseMove={this.onMouseMove} onMouseUp={this.onMouseUp} />
    );
  }
}

export interface ReactLayoutProps extends React.HTMLProps<HTMLDivElement> {
  autoFit?: boolean;
  autoFitLimits?: IPoint;
  editLayout?: boolean;
  g: LayoutGenerator;

}

export interface ReactLayoutState {
  width: number;
  height: number;
}

export default class ReactLayout extends React.Component<ReactLayoutProps, ReactLayoutState> {

  // divRef: React.RefObject<HTMLDivElement>;
  derivedLayout: ILayoutGenerator;
  key: number;
  editLayout: boolean = false;
  editOverlay: Array<ILayout> = [];

  constructor(props: ReactLayoutProps) {
    super(props);
    this.key = 0;
    this.state = {
      width: 0,
      height: 0
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

  createPositionedElemement = (child: React.ReactElement<any>, name: string) => {

    const b = this.derivedLayout.lookup(name);
    if (b && (b.location.right - b.location.left) && (b.location.bottom - b.location.top)) {
      // console.log('createPositionedElemement', b);
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

    return null;
  }

  createListElemement = (child: React.ReactElement<any>) => {
    let item: ILayout | undefined = this.derivedLayout.next();
    if (item) {
      // Adjust for padding if autoFit

      // Infinity mapped to this.height & this.width - padding
      if (item.location.bottom === NaN) {
        // item.location.bottom = this.state.height
      }

      if (item.location.right === NaN) {

      }

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
    // tslint:disable-next-line:no-any
    const e: Object = child.props['data-layout'];
    if (e && e['name']) {
      return this.createPositionedElemement(child, e['name']);
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
              case PositionRef.top: {
                cursor = 'row-resize';

                break;
              }
              case PositionRef.left: {
                cursor = 'col-resize';
                break;
              }
              case PositionRef.bottom: {
                cursor = 'row-resize';
                break;
              }
              case PositionRef.right: {
                cursor = 'col-resize';
                left = layout.location.right - 2;
                top = layout.location.top;
                width = 4;
                height = layout.location.bottom - layout.location.top;
                console.log('PositionRef.right')
                break;
              }
              case PositionRef.leftTop: {
                cursor: 'nw-resize';
                break;
              }
              case PositionRef.rightTop: {
                cursor: 'ne-resize';
                break;
              }
              case PositionRef.leftBottom: {
                cursor: 'nw-resize';
                break;
              }
              case PositionRef.rightBottom: {
                cursor: 'ne-resize';
                break;
              }
              default: {
                break;
              }
            }
            if (width && height) {
              jsx.push(<RLGHandle rlgStyle={editStyle(cursor, left, top, width, height)} />)
            } 
          });
        }
      })
    }
    return jsx;
  }

  render(): React.ReactNode {
    console.log('render', gCount++)
    this.initLayout();
    return (
      /* style height of 100% necessary for correct height  */
      <div /* ref={this.divRef} */ style={{ height: '100%' }}>
        {React.Children.map(this.props.children, child =>
          // tslint:disable-next-line:no-any
          this.createElement(child as React.ReactElement<any>)
        )}
        {this.createEditHandles()}
        <ReactResizeDetector handleWidth handleHeight onResize={this.onResize} />
      </div>

    )
  }
}