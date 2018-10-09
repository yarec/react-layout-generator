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

    this.g = DesktopLayout(this.windowSize.width, this.windowSize.height);
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
    this.windowSize.width = window.innerWidth;
    this.windowSize.height = window.innerHeight;

    this.g.params().set('width', this.windowSize.width);
    this.g.params().set('height', this.windowSize.height);
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

        </div>

         <div data-layout={{ name: 'header' }} >
        
        </div>

         <div data-layout={{ name: 'content' }} >
        
        </div>

        <div data-layout={{ name: 'footer' }} >
        
        </div>
      </ReactLayout>
    );
  }
}

render(<ExampleLayout />, document.getElementById("root"));