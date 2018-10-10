import * as React from 'react';
import ReactResizeDetector from 'react-resize-detector';

import LayoutGenerator, { ILayoutGenerator, IBlock } from './LayoutGenerator';
import { IPoint, IRect } from './types';

function tileStyle(x: number, y: number, width: number, height: number, padding: IRect, margin: IRect) {

  // Assumes box-sizing set to border-box
  width -= margin.left + margin.right + padding.left + padding.right;
  height -= margin.top + margin.bottom + padding.top + padding.bottom;

  return {
    // boxSizing: 'border-box' as 'border-box',
    transformOrigin: 0,
    transform: `translate(${x}px, ${y}px)`,
    width: `${width}px`,
    height: `${height}px`,
    position: 'absolute' as 'absolute',
    marginTop: `${margin.top}px`,
    marginRight: `${margin.right}px`,
    marginBottom: `${margin.bottom}px`,
    marginLeft: `${margin.left}px`,
    paddingTop: `${padding.top}px`,
    paddingRight: `${padding.right}px`,
    paddingBottom: `${padding.bottom}px`,
    paddingLeft: `${padding.left}px`,
    border: '1px solid red'
  };
}

export interface ReactLayoutProps extends React.HTMLProps<HTMLDivElement> {
  autoFit: boolean;
  autoFitLimits: IPoint;
  elementPadding: IRect;
  g: LayoutGenerator;

}

export interface ReactLayoutState {
  width: number;
  height: number;
}

export default class ReactLayout extends React.Component<ReactLayoutProps, ReactLayoutState> {
  
  divRef: React.RefObject<HTMLDivElement>;
  derivedLayout: ILayoutGenerator;
  key: number;

  constructor(props: ReactLayoutProps) {
    super(props);
    this.key = 0;
    this.state = {
      width: 0,
      height: 0
    }
    this.divRef = React.createRef();

    this.derivedLayout = this.props.g;
  }

  onResize = (width: number, height: number) => {
    console.log('onResize', width, height);
    if (this.state.width != width || this.state.height != height) {
      
      this.setState({ width: width, height: height });
    }
  }

  
  componentDidMount() {
    window.addEventListener('resize', this.handleWindowSizeChange);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowSizeChange);
  }

  handleWindowSizeChange = () => {

    // console.log(`handleWindowSizeChange: width: ${window.innerWidth}, element height: ${window.innerHeight}`);

    // if (this.divRef && this.divRef.current ) {
    //   const width = this.divRef.current.clientWidth;
    //   const height = this.divRef.current.clientHeight;

    //   this.setState({width: width, height: height})

    //   console.log(`handleWindowSizeChange: element width: ${width}, element height: ${height}`);
    // }

    // this.windowSize.width = window.innerWidth;
    // this.windowSize.height = window.innerHeight;

    // this.g.params().set('width', this.windowSize.width);
    // this.g.params().set('height', this.windowSize.height);

    // console.log('handleWindowSizeChange',  window.innerWidth, window.innerHeight);
  }


  initLayout = () => {
    this.key = 0;
    const p = this.derivedLayout.params();
    p.set('width', this.state.width);
    p.set('height', this.state.height);
  }

  nextLayout = () => {

  }

  createPositionedElemement = (child: React.ReactElement<any>, name: string) => {

    const b = this.derivedLayout.lookup(name);
    if (b) {
      console.log('createPositionedElemement', b);
      const style = tileStyle(
        b.location.left,
        b.location.top,
        (b.location.right - b.location.left),
        (b.location.bottom - b.location.top),
        { top: 0, bottom: 0, left: 0, right: 0 },
        { top: 0, bottom: 0, left:0, right: 0 }
      );
      let props = {style: style};
      return React.cloneElement(child, props, child.props.children);
    }

    return null;
  }

  createListElemement = (child: React.ReactElement<any>) => {
    let item: IBlock | undefined = this.derivedLayout.next();
    if(item) {
      // Adjust for padding if autoFit
      
      // Infinity mapped to this.height & this.width - padding
      if (item.location.bottom === NaN) {
        item.location.bottom = this.state.height - this.props.elementPadding.bottom;
      }

      if (item.location.right === NaN) {
        
      }

      const style = tileStyle(
        item.location.left,
        item.location.top,
        (item.location.right - item.location.left),
        (item.location.bottom - item.location.top),
        { top: 0, bottom: 0, left: 0, right: 0 },
        { top: 10, bottom: 10, left: 10, right: 10 }
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

  placeHolder = () => {
    return null;
  }

  render(): React.ReactNode {
    this.initLayout();
    return (
      /* style height of 100% necessary for correct height  */
      <div ref={this.divRef} style={{height: '100%'}}>
        {React.Children.map(this.props.children, child =>
          // tslint:disable-next-line:no-any
          this.createElement(child as React.ReactElement<any>)
        )}
        {this.placeHolder()}
        <ReactResizeDetector handleWidth handleHeight onResize={this.onResize} />
      </div>
     
    )
  }
}