import * as React from 'react';
import { render } from 'react-dom';
import { IGridGenerator, fitLayout, mobileDashboard } from '../../src/LayoutGenerator';
import { IRect } from '../../src/types';

function tileStyle(scale: number, x: number, y: number, width: number, height: number, padding: IRect, margin: IRect) {

  // Assumes box-sizing set to border-box

  // apply scale
  x *= scale;
  y *= scale;
  width *= scale;
  height *= scale;

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

interface ExampleProps {

}

interface ExampleState {
  width: number;
}

class ExampleLayout extends React.Component<ExampleProps, ExampleState> {

  divElement: HTMLDivElement;

  constructor(props: ExampleProps) {
    super(props);

    this.state = {
      width: 0
    };
  }

  componentWillMount() {
    window.addEventListener('resize', this.handleWindowSizeChange);
  }

  // make sure to remove the listener
  // when the component is not mounted anymore
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowSizeChange);
  }

  handleWindowSizeChange = () => {
    if (this.divElement.offsetWidth) {
      this.setState({ width: this.divElement.offsetWidth });
      console.log('Container width: ', this.divElement.offsetWidth);
    }
  }

  componentDidMount() {
    const width = this.divElement.offsetWidth;
    this.setState({ width });
    console.log('Container width: ', width);
  }

  createElements = () => {
    // tslint:disable-next-line:no-any
    let elements: Array<any> = [];

    const args: IGridGenerator = {
      cols: 2,
      rows: 2,
      blockSize: { x: 200, y: 200 }
    };

    let g = fitLayout(this.state.width ? this.state.width : 700, mobileDashboard(args));
    let item: IRect | undefined = g.next();
    let key = 0;
    while (item) {
      const style = tileStyle(
        1.0,
        item.left,
        item.top,
        (item.right - item.left),
        (item.bottom - item.top),
        { top: 0, bottom: 0, left: 0, right: 0 },
        { top: 10, bottom: 10, left: 10, right: 10 }
      );
      // console.log('CreateElements style', style);
      elements.push(
        <div
          style={style}
          key={key += 1}
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
            {key}
          </div>
        </div>
      );
      item = g.next();
    }

    return elements;
  }

  render() {
    return (
      <>
        <div
          ref={(divElement) => this.divElement = divElement!}
          style={{position: 'relative'}}
        >
          {this.createElements()}
          
        </div>
      </>
    );

  }
}


render(<ExampleLayout />, document.getElementById("root"));