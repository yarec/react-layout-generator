import * as React from 'react';
import ResizeDetector from 'react-resize-detector';

import LayoutGenerator, { fitLayout, IBlock } from './LayoutGenerator';
import { IRect } from './types';

function tileStyle(x: number, y: number, width: number, height: number, padding: IRect, margin: IRect) {

  // Assumes box-sizing set to border-box

  // apply scale
  // x *= scale;
  // y *= scale;
  // width *= scale;
  // height *= scale;

  // define box model - assumes box-sizing set to border-box
  // x += margin.left;//  + padding.left;
  // y += margin.top; // + padding.top;
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
  autoFitLimits: [number, number];
  g: LayoutGenerator;

}

export interface ReactLayoutState {
  width: number;
}

export default class ReactLayout extends React.Component<ReactLayoutProps, ReactLayoutState> {
  
  derivedLayout: LayoutGenerator;
  key: number;

  constructor(props: ReactLayoutProps) {
    super(props);
    this.key = 0;
    this.state = {
      width: 0
    }
  }

  onResize = (width: number) => {
    console.log('onResize', width);
    this.setState({ width: width });
  }

  initLayout = () => {
    this.key = 0;
    this.derivedLayout = fitLayout(this.state.width ? this.state.width : 700, this.props.g);
  }

  nextLayout = () => {

  }

  createElement = (child: React.ReactElement<any>) => {
    // tslint:disable-next-line:no-any
    let item: IBlock | undefined = this.derivedLayout.next();
    if(item) {
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
          key={item.name + child.key}
        >
          <div style={{
            height: '100%',
            width: '100%',
            border: '1px solid red',
            //padding: '10px',
            //margin: '10px',
            backgroundColor: 'grey',
            color: 'white'
          }}>
            {item.name}
          </div>
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