import * as React from 'react';
import ResizeDetector from 'react-resize-detector';

import LayoutGenerator, { ILayoutGenerator, fitLayout, IBlock } from './LayoutGenerator';
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
  
  derivedLayout: ILayoutGenerator;
  key: number;

  constructor(props: ReactLayoutProps) {
    super(props);
    this.key = 0;
    this.state = {
      width: 0,
      height: 0
    }
  }

  onResize = (width: number, height: number) => {
    console.log('onResize', width, height);
    this.setState({ width: width, height: height });
  }

  initLayout = () => {
    this.key = 0;
    this.derivedLayout = fitLayout(this.state.width, this.props.g);
  }

  nextLayout = () => {

  }

  createElement = (child: React.ReactElement<any>) => {
    // tslint:disable-next-line:no-any
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

  placeHolder = () => {
    return null;
  }

  render(): React.ReactNode {
    this.initLayout();
    return (
      <div>
        {React.Children.map(this.props.children, child =>
          // tslint:disable-next-line:no-any
          this.createElement(child as React.ReactElement<any>)
        )}
        {this.placeHolder()}
        <ResizeDetector handleWidth onResize={this.onResize} />
      </div>
     
    )
    
  }
}