import * as React from 'react';
import ReactResizeDetector from 'react-resize-detector';
import { IGenerator } from './generators/Generator';
import Layout, { IPosition, IEdit } from './components/Layout';
import EditPosition from './editors/EditPosition';

function tileStyle(style: React.CSSProperties, x: number, y: number, width: number, height: number): React.CSSProperties {
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
    console.log('onResize', this.props.name, width, height);
    if (this.state.width != width || this.state.height != height) {

      this.setState({ width: width, height: height });
      this.initLayout();

    }
  }

  initLayout = () => {
    this.key = 0;
    this.editOverlay = [];
    const p = this.derivedLayout.params();

    const v = p.set('viewport', { width: this.state.width, height: this.state.height });
    if (v) {
      const layouts = this.derivedLayout.layouts();
      if (layouts) {
        layouts.layouts.forEach((layout) => {
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

        console.log('style', style)

        if (this.editLayout && b.edit) {
          this.editOverlay.push(b)
        }
        // let props = style: ...this.props.style
        //   ...child.props.style ...style };

        //const c = React.cloneElement(child, {style: {...this.props.style, ...child.props.style, ...style}}, child.props.children);

        return <div style={{...this.props.style, ...child.props.style, ...style}}>{child.props.children}</div> ;
        //return c;
      }
    }

    return null;
  }



  createElement = (child: React.ReactElement<any>, index: number) => {
    const p: Object = child.props['data-layout'];

    console.log('createElement', child.type, child.props)
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
            let r = layout.rect();
            if (r.width && r.height) {
              jsx.push(<EditPosition
                key={layout.name + item.cursor}
                edit={item}
                layout={layout}
                boundary={{ x: 0, y: 0, width: this.state.width, height: this.state.height }}
              />);
            }
          });
        }
      });
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
    console.log(`create content ${this.props.name} ${this.state.width} ${this.state.height}`)
    if (this.state.width && this.state.height) {
      // Only show content if width and height are not 0
      return (
        <>
          {React.Children.map(this.props.children, (child, i) => {
            console.log('createElement', i)
            // tslint:disable-next-line:no-any
            return this.createElement(child as React.ReactElement<any>, i)
          })}
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
      <div style={{ height: '100%' }} >
        {this.content()}
        <ReactResizeDetector handleWidth handleHeight onResize={this.onResize} />
        {this.frameEnd()}
      </div >
    )
  }
}
