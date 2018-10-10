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

    this.g = DesktopLayout(0, 0);
  }

  render() {

    return (
      <ReactLayout
        autoFit={true}
        data-layout={[['width', 100]]}
        autoFitLimits={{ x: .75, y: 1.25 }}
        elementPadding={{ top: 0, left: 0, right: 0, bottom: 0 }}
        g={this.g}
      >
        <div data-layout={{ name: 'side' }} >
          <span>Side</span>
        </div>

         <div data-layout={{ name: 'header' }} >
          <span>Header</span>
        </div>

         <div data-layout={{ name: 'content' }} >
          <span>Content</span>
        </div>

        <div data-layout={{ name: 'footer' }} >
         <span>Footer</span>
        </div>
      </ReactLayout>
    );
  }
}

render(<ExampleLayout />, document.getElementById("root"));