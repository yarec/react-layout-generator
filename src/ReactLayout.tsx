import * as React from 'react';
import ReactResizeDetector from 'react-resize-detector';

import { IPosition, IPositionChildren } from './components/Layout';
import EditPosition from './editors/EditPosition';
import { IGenerator } from './generators/Generator';
import { ISize } from './types';

function tileStyle(style: React.CSSProperties, x: number, y: number, width: number, height: number): React.CSSProperties {
  return {
    boxSizing: 'border-box' as 'border-box',
    height: `${height}px`,
    overflow: 'hidden',
    position: 'absolute' as 'absolute',
    transform: `translate(${x}px, ${y}px)`,
    transformOrigin: 0,
    whiteSpace: 'nowrap',
    width: `${width}px`,
    ...style
  };
}

export let gInProgress: number = 0;

export interface IReactLayoutProps extends React.HTMLProps<HTMLDivElement> {
  name?: string;
  editLayout?: boolean;
  save?: (name: string, params: string, layouts: string) => void;
  load?: (name: string) => { params: string, layouts: string }
  extent?: ISize;
  g: IGenerator;
}

export interface IReactLayoutState {
  width: number;
  height: number;
  update: number;
}

export default class ReactLayout extends React.Component<IReactLayoutProps, IReactLayoutState> {
  private _g: IGenerator;
  private _editLayout: boolean = false;
  // private _startRendering: number;

  constructor(props: IReactLayoutProps) {
    super(props);
    this.state = {
      height: 0,
      update: 0,
      width: 0
    }

    this._editLayout = props.editLayout ? props.editLayout : false;

    // this.divRef = React.createRef();

    this._g = this.props.g;
  }

  public render(): React.ReactNode {
    this.frameStart();
    this.initLayout();

    // this.state.update can be used for debug tracing
    // during or after editing
    // if (this.state.update === 0) {
    //   console.log('render');
    // }
    // 

    const resize = <ReactResizeDetector handleWidth={true} handleHeight={true} onResize={this.onResize} />
    return (
      /* style height of 100% necessary for ReactResizeDetector to work  */
      <div style={{ height: '100%' }} >
        {this.content()}
        {this.props.extent ? null : resize}
        {this.frameEnd()}
      </div >
    )
  }

  // componentDidMount = () => {
  //   window.addEventListener('resize', this.updateDimensions);
  // }

  // componentWillUnmount() {
  //   window.removeEventListener("resize", this.updateDimensions);
  // }

  // updateDimensions = () => {
  //   this.onResize(window.innerWidth, window.innerHeight);
  // }

  private onResize = (width: number, height: number) => {
    // console.log('onResize', this.props.name, width, height);

    if (this.state.width !== width || this.state.height !== height) {
      this.setState({ width, height });
    }
  }

  private initLayout = () => {
    const p = this._g.params();

    const v = p.set('viewport', { width: this.state.width, height: this.state.height });
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
  }

  private createPositionedElement = (
    child: React.ReactElement<any>,
    index: number,
    count: number,
    name: string,
    position: IPosition,
    positionChildren: IPositionChildren
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
  }

  private updatePositionedElement = (
    child: React.ReactElement<any>,
    index: number,
    count: number,
    name: string,
    position: IPosition,
    positionChildren: IPositionChildren
  ) => {

    const b = this._g.lookup(name);
    if (b) {
      const rect = b.rect();
      if ((rect.width) && (rect.height)) {
        const style = tileStyle(child.props.style,
          rect.x,
          rect.y,
          rect.width,
          rect.height
        );

        // console.log(name, style)

        const editors: JSX.Element[] = [];
        if (this._editLayout && b.edit) {
          // this.editOverlay.push(b);
          let i = 0;
          b.edit.forEach((item) => {
            editors.push(
              <EditPosition
                key={`edit${i}`}
                edit={item}
                layout={b!}
                boundary={{ x: 0, y: 0, width: this.state.width, height: this.state.height }}
                onUpdate={this.onUpdate} />
            );
            i += 1;
          })
        }

        gInProgress -= 1;

        if (b && b.positionChildren) {
          console.log('child', child.props)
          return React.Children.map(child.props.children, (nestedChild, i) => {
            const nestedRect = b.positionChildren!(rect, b.generator.params(), i);
            if (nestedRect) {
              const nestedStyle = tileStyle(nestedChild.props.style,
                nestedRect.x,
                nestedRect.y,
                nestedRect.width,
                nestedRect.height
              );
              console.log('nested child', nestedChild.type)
              return (
                React.cloneElement(nestedChild,
                  {
                    key: `${nestedChild.key}`,
                    extent: { width: nestedRect.width, height: nestedRect.height },
                    style: { ...this.props.style, ...nestedChild.props.style, ...nestedStyle }
                  },
                  nestedChild.props.children
                )
              );
            }
            return null;
          });
        } else {
          return (
            <>
              {React.cloneElement(child,
                {
                  key: b.name,
                  extent: { width: rect.width, height: rect.height },
                  style: { ...this.props.style, ...child.props.style, ...style }
                },
                child.props.children
              )}
              {editors}
            </>
          )
        }
      }
    }

    return null;
  }

  private createElement = (child: JSX.Element, index: number, count: number) => {
    const p = child.props['data-layout'];

    if (p && p.name) {
      return this.createPositionedElement(child, index, count, p.name, p.position, p.context);
    } else {
      // TODO add support for elements without 'data-layout'
      // Is it needed?
    }


    return null;
  }

  private updateElement = (child: React.ReactElement<any>, index: number, count: number) => {
    const p = child.props['data-layout'];

    // console.log('createElement', child.type, child.props)
    if (p && p.name) {
      return this.updatePositionedElement(child, index, count, p.name, p.position, p.context);
    } else {
      // TODO add support for elements without 'data-layout'
      // Is it needed?
    }

    return null;
  }

  private onUpdate = (reset: boolean = false) => {
    if (reset) {
      this.setState({ update: 0 });
    } else {
      this.setState({ update: this.state.update + 1 });
    }
  }

  private frameStart = () => {
    // this._startRendering = Date.now();
    return null;
  }

  private frameEnd = () => {
    // console.log('frameTime: ', (Date.now() - this._startRendering) + ' ms');
    return null;
  }

  private content = () => {

    // Only show content if width and height are not 0
    if (this.state.width && this.state.height) {
      const count = React.Children.count(this.props.children);
      gInProgress += count;

      // Phase I create if necessary
      React.Children.map(this.props.children, (child, i) => {
        if (child) {
          // tslint:disable-next-line:no-any
          this.createElement(child as React.ReactElement<any>, i, count);
        }
      });

      // Phase II update
      return (
        React.Children.map(this.props.children, (child, i) => {
          if (child) {
            // tslint:disable-next-line:no-any
            return this.updateElement(child as React.ReactElement<any>, i, count);
          }
          return null;
        })
      );
    }
    return null;
  }
}