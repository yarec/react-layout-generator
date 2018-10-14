import * as React from 'react';
import { render } from 'react-dom';
import ReactLayout from '../../src/ReactLayout';
import LayoutGenerator, { DesktopLayout } from '../../src/LayoutGenerator';

interface ExampleProps {
  
}

interface ExampleState {

}

class ExampleLayout extends React.Component<ExampleProps, ExampleState> {

  windowSize = {
    width: 0,
    height: 0
  };

  g: LayoutGenerator;

  constructor(props: ExampleProps) {
    super(props);

    this.g = DesktopLayout();

    const p = this.g.params();

    // hide header and footer
    p.set('headerHeight', 24);
    p.set('footerHeight', 24);
    p.set('fullWidthHeaders', 1)
    p.set('leftSideWidth', 200);
    p.set('rightSideWidth', 200)
  }

  render() {

    return (
      <ReactLayout
        autoFit={true}
        data-layout={[['width', 100]]}
        autoFitLimits={{ x: .75, y: 1.25 }}
        g={this.g}
      >
        <div data-layout={{ name: 'leftSide' }} style={{backgroundColor:'hsl(200,100%,80%)'}} >
          <span >LeftSide</span>
        </div>

         <div data-layout={{ name: 'rightSide' }} style={{backgroundColor:'hsl(205,100%,80%)'}} >
          <span >RightSide</span>
        </div>

         <div data-layout={{ name: 'header' }}  style={{backgroundColor:'hsl(210,100%,80%)'}} >
          <span>Header</span>
        </div>

         <div data-layout={{ name: 'content' }}  style={{backgroundColor:'hsl(215,100%,80%)'}}>
          <span>Content</span>
        </div>

        <div data-layout={{ name: 'footer' }}  style={{backgroundColor:'hsl(220,100%,80%)'}}>
         <span>Footer</span>
        </div>
      </ReactLayout>
    );
  }
}

render(<ExampleLayout />, document.getElementById("root"));