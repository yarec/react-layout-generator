import * as React from 'react';
import { render } from 'react-dom';
import styled from 'styled-components';

import { IGenerator } from '../../src/generators/Generator';
import RLGColumns from '../../src/generators/RLGColumns';
import RLGDesktop from '../../src/generators/RLGDesktop';
import ReactLayout from '../../src/ReactLayout';
import CardDeck from './CardDeck';
import DeskTop from './desktop/DeskTop';
import ErrorBoundary from './ErrorBoundary';
import Solitaire from './solitaire/Solitaire';

import NavBar from './components/NavBar'

// tslint:disable-next-line:variable-name
const Title = styled.h1`
  font-family: Arial, Helvetica, sans-serif;
  background: transparent;
  color: white;
`

// tslint:disable-next-line:max-classes-per-file
export class Examples extends React.Component<{}, { app: any }> {

  public g: IGenerator;
  public g1: IGenerator;
  public n: IGenerator;

  constructor(props: any) {
    super(props);
    this.state = { app: null }

    this.g = RLGDesktop('');
    const p = this.g.params();

    // Set variables to 0 to hide section
    p.set('titleHeight', 80);
    p.set('headerHeight', 40);
    p.set('footerHeight', 0);
    p.set('leftSideWidth', 0);
    p.set('rightSideWidth', 0);

    // Show full width header and footer
    p.set('fullWidthHeaders', 1);

    this.n = RLGColumns('navbar');
    // const pn = this.n.params();
    // pn.set('')

    this.g1 = RLGDesktop('');

  }

  public select = (element: JSX.Element) => {
    this.setState({ app: element });
  }

  public render() {
    return (
      <ErrorBoundary>
        <ReactLayout name='desktop' g={this.g}>
          <div data-layout={{ name: 'title' }} style={{backgroundColor: 'black', textAlign: 'center'}}>
            <Title>React Layout Generator Examples</Title>
          </div>
          <div data-layout={{ name: 'header' }} style={{backgroundColor: 'black'}}>
            <NavBar elements={[
              { component: <DeskTop />, name: 'DeskTop' },
              { component: <CardDeck />, name: 'CardDeck' },
              { component: <Solitaire />, name: 'Solitaire' }
            ]}
              callback={this.select}
            />
          </div>

          <div data-layout={{ name: 'content' }} style={{margin: 20}} >
            {this.state.app}
          </div>

        </ReactLayout>
      </ErrorBoundary>
    );

  }
}

render(<Examples />, document.getElementById("root"));

