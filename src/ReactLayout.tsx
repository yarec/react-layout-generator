import * as React from 'react';
import ReactResizeDetector from 'react-resize-detector';
import RLGHandle from './RLGHandle'
import { IGenerator } from './generators/Generator';
import Layout, { IPosition, IEdit, PositionRef } from './components/Layout';

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
  g: IGenerator;
}

export interface ReactLayoutState {
  width: number;
  height: number;
  update: number;
}

export default class ReactLayout extends React.Component<ReactLayoutProps, ReactLayoutState> {
  derivedLayout: IGenerator;
  key: number;
  editLayout: boolean = false;
  editOverlay: Array<Layout> = [];
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
      this.initLayout();

    }
  }

  initLayout = () => {
    this.key = 0;
    this.editOverlay = [];
    const p = this.derivedLayout.params();

    const v = p.set('viewport', { x: this.state.width, y: this.state.height });
    const w = p.set('width', this.state.width);
    const h = p.set('height', this.state.height);
    if (v || w || h) {
      const _layouts = this.derivedLayout.layouts();
      if (_layouts) {
        _layouts.layouts.forEach((layout) => {
          layout.touch();
        });
      }
    }

    this.derivedLayout.reset();
  }

  createPositionedElement = (child: React.ReactElement<any>, index: number, name: string, position: IPosition) => {

    let b = this.derivedLayout.lookup(name);
    if (!b && this.derivedLayout.create) {
      b = this.derivedLayout.create(index, name, this.derivedLayout, position);
      // console.log('createPositionedElement', index, b, position);
    }

    if (b) {
      const rect = b.rect();
      if ((rect.width) && (rect.height)) {
        const style = tileStyle(child.props['style'],
          rect.x,
          rect.y,
          rect.width,
          rect.height
        );

        if (this.editLayout && b.edit) {
          this.editOverlay.push(b)
        }
        // let props = style: ...this.props.style
        //   ...child.props.style ...style };

        return React.cloneElement(child, {
          style: {
            ...this.props.style,
            ...child.props.style,
            ...style
          }
        },

          child.props.children);
      }
    }

    return null;
  }



  createElement = (child: React.ReactElement<any>, index: number) => {
    const p: Object = child.props['data-layout'];

    if (p && p['name']) {
      return this.createPositionedElement(child, index, p['name'], p['position']);
    } else {

    }

    return null;
  }

  createEditHandles = () => {
    let jsx: Array<any> = [];
    if (this.props.editLayout) {
      this.editOverlay.map((layout: Layout) => {
        if (layout.edit) {
          layout.edit.map((item: IEdit) => {
            let cursor = 'default';
            let r = layout.rect();
            switch (item.part) {
              case PositionRef.position: {
                cursor = 'move';
                break;
              }
              case PositionRef.left: {
                cursor = 'w-resize';
                r.location = { x: r.x - 2, y: r.y };
                r.size = { width: 4, height: r.height };
                break;
              }
              case PositionRef.right: {
                cursor = 'w-resize';
                r.location = { x: r.x + r.width - 2, y: r.y };
                r.size = { width: 4, height: r.height };
                break;
              }
              case PositionRef.top: {
                r.location = { x: r.x, y: r.y - 2 };
                r.size = { width: r.width, height: 4 };
                cursor = 'n-resize';
                break;
              }
              case PositionRef.bottom: {
                cursor = 'w-resize';
                r.location = { x: r.x, y: r.y + r.height - 2 };
                r.size = { width: r.width, height: 4 };
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
                console.error(`Invalid PositionRef ${item.part}`);
                break;
              }
            }
            if (r.width && r.height) {
              jsx.push(<RLGHandle
                key={layout.name + cursor}
                onUpdate={this.onUpdate}
                edit={item}
                layout={layout}
                boundary={{ x: 0, y: 0, width: this.state.width, height: this.state.height }}
                params={this.derivedLayout.params()}
                rlgDrag={{ cursor: cursor, x: r.x, y: r.y, width: r.width, height: r.height }} />)
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
          {React.Children.map(this.props.children, (child, i) =>
            // tslint:disable-next-line:no-any
            this.createElement(child as React.ReactElement<any>, i)
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
        {/* {this.frameEnd()} */}
      </div>
    )
  }
}