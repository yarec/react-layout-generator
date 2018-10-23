import * as React from 'react';
import { render } from 'react-dom';
import ReactLayout from '../../src/ReactLayout';
import LayoutGenerator, { DesktopLayout, DiagramLayout } from '../../src/LayoutGenerator';

const card2C = require('./assets/cards/2C.jpg');

interface ExampleProps {

}

interface ExampleState {

}

class ExampleLayout extends React.Component<ExampleProps, ExampleState> {

  g: LayoutGenerator;
  d: LayoutGenerator;

  constructor(props: ExampleProps) {
    super(props);

    this.g = DesktopLayout('rlg.desktop.example');
    this.d = DiagramLayout('rlg.diagram.example');

    const p = this.g.params();

    // Set variables to 0 to hide
    p.set('headerHeight', 24);
    p.set('footerHeight', 0);
    p.set('fullWidthHeaders', 1)
    p.set('leftSideWidth', 200);
    p.set('rightSideWidth', 0)
  }

  render() {

    return (
      <ReactLayout
        name={'reactLayout.desktop.example'}
        editLayout={true}
        g={this.g}
      >
        <div data-layout={{ name: 'leftSide' }} style={{ backgroundColor: 'hsl(200,100%,80%)' }} >
          <span >LeftSide</span>
        </div>

        <div data-layout={{ name: 'header' }} style={{ backgroundColor: 'hsl(210,100%,80%)' }} >
          <span>Header</span>
        </div>

        <div data-layout={{ name: 'content' }} style={{ backgroundColor: 'hsl(215,100%,80%)' }}>
          <ReactLayout
            name={'reactLayout.content'}
            editLayout={true}
            g={this.d}
          >
            <div data-layout={{ name: 'box' }} style={{ backgroundColor: 'hsl(200,100%,80%)' }} >
              <span>Box</span>
              <img src={card2C} />
            </div>
            
          </ReactLayout>
        </div>

      </ReactLayout>
    );
  }
}

render(<ExampleLayout />, document.getElementById("root"));