import * as React from 'react';
import { render } from 'react-dom';
import ReactLayout from '../../src/ReactLayout';
import LayoutGenerator, { DesktopLayout, DiagramLayout } from '../../src/LayoutGenerator';
import ListLayout from '../../src/generators/List';
// import { OriginX, OriginY } from '../../src/types';
import Deck from './Deck';
// import Examples from './Examples'

// const card2C = require('./assets/cards/2C.jpg');

interface ExampleProps {
  name: string;

}
export class Example extends React.PureComponent<ExampleProps> {
  render = () => {
    return (<button style={{ width: '120' }}>{this.props.name}</button>)
  }
}

interface ExampleLayoutProps {

}

interface ExampleLayoutState {

}

class ExampleLayout extends React.Component<ExampleLayoutProps, ExampleLayoutState> {

  g: LayoutGenerator;
  d: LayoutGenerator;
  m: LayoutGenerator;

  constructor(props: ExampleLayoutProps) {
    super(props);

    this.g = DesktopLayout('rlg.desktop.example');
    this.d = DiagramLayout('rlg.diagram.example');
    this.m = ListLayout('rlg.list.example');

    const p = this.g.params();

    // Set variables to 0 to hide
    p.set('headerHeight', 24);
    p.set('footerHeight', 0);
    p.set('fullWidthHeaders', 0)
    p.set('leftSideWidth', 200);
    p.set('rightSideWidth', 0)
  }

  elements = () => {
    const deck = new Deck();
    return deck.createElements();
  }

  render() {

    return (
      <ReactLayout
        name={'reactLayout.desktop.example'}
        editLayout={true}
        g={this.g}
      >
        <div data-layout={{ name: 'leftSide' }} style={{ backgroundColor: 'hsl(200,100%,80%)' }} >
          <ReactLayout
            name={'reactLayout.list.example'}
            g={this.m}
          >
            <div data-layout={{ name: 'title' }} >
              <span>Examples</span>
            </div>

            <div /* name={'Desktop Layout'} */ data-layout={{ name: 'desktopLayout' }} >
              <span>Desktop Layout</span>
            </div>

            <div /* name={'Card Layout'} */ data-layout={{ name: 'cardLayout' }} >
              <span>Card Layout</span>
            </div>

          </ReactLayout>
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
            {this.elements()}
          </ReactLayout>
        </div>

      </ReactLayout>
    );
  }
}

render(<ExampleLayout />, document.getElementById("root"));


