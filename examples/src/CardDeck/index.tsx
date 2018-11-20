import * as React from 'react';
import { render } from 'react-dom';
import ReactLayout from '../../../src/ReactLayout';
import { IGenerator } from '../../../src/generators/Generator';
import RLGDesktop from '../../../src/generators/RLGDesktop';
import RLGDynamic from '../../../src/generators/RLGDynamic';
import RLGList from '../../../src/generators/RLGList';
import Deck from './Deck';

interface ExampleProps {
  name?: string;

}
export default class Example extends React.PureComponent<ExampleProps> {
  render = () => {
    return (
      <div>
        <button style={{ width: '120' }}>{this.props.name}</button>
      </div>
    )
  }
}

interface ExampleLayoutProps {

}

interface ExampleLayoutState {

}

class ExampleLayout extends React.Component<ExampleLayoutProps, ExampleLayoutState> {

  g: IGenerator;
  d: IGenerator;
  m: IGenerator;

  constructor(props: ExampleLayoutProps) {
    super(props);

    this.g = RLGDesktop('rlg.desktop.example');
    this.d = RLGDynamic('rlg.diagram.example');
    this.m = RLGList('rlg.list.example');

    const p = this.g.params();

    // Set variables to 0 to hide
    p.set('titleHeight', 0);
    p.set('headerHeight', 24);
    p.set('footerHeight', 0);
    p.set('fullWidthHeaders', 0)
    p.set('leftSideWidth', 200);
    p.set('rightSideWidth', 0)
  }

  deskTop = (event: any) => {
    alert('ok')
  }

  deckOfCards = (event: any) => {
    alert('ok')
  }

  elements = () => {
    const deck = new Deck();
    return deck.createElements();
  }

  render() {

    return (
      <>

        <ReactLayout
          name={'reactLayout.desktop.example'}
          editLayout={false}
          g={this.g}
        >
          <div data-layout={{ name: 'leftSide' }} style={{ backgroundColor: 'hsl(200,100%,80%)' }} >
            <ReactLayout
              name={'reactLayout.list.example'}
              g={this.m}
            >
              <div data-layout={{ name: 'title' }} >
                <b >Examples</b>
              </div>

              <div data-layout={{ name: 'desktopLayout' }} >
                <span onClick={this.deskTop}>Desktop</span>
              </div>

              <div /* name={'Card Layout'} */ data-layout={{ name: 'cardLayout' }} >
                <span onClick={this.deckOfCards}>Card Layout</span>
              </div>

              {/*             
            <div data-layout={{ name: 'svgLayout' }} >
              <svg width='200' height='24'>
                <rect width='150' height='10'/>
              </svg>
            </div> 
            */}

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
      </>
    );
  }
}

render(<ExampleLayout />, document.getElementById("root"));


