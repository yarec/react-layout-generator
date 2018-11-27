import * as React from 'react';
import { render } from 'react-dom';
import styled from 'styled-components';

import { IGenerator } from '../../src/generators/Generator';
import RLGColumns from '../../src/generators/RLGColumns';
import RLGDesktop from '../../src/generators/RLGDesktop';
import ReactLayout from '../../src/ReactLayout';
import CardDeck from './carddeck/CardDeck';
import ErrorBoundary from './components/ErrorBoundary';
import NavBar from './components/NavBar'
import DeskTop from './desktop/DeskTop';
import Grid from './grid/Grid';
import Intro from './intro/Intro';
import Solitaire from './solitaire/Solitaire';

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
    this.state = { app: <Intro /> }

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
        <ReactLayout name='intro' g={this.g}>
          <div data-layout={{ name: 'title' }} style={{backgroundColor: 'black', textAlign: 'center'}}>
            <Title>React Layout Generator Examples</Title>
          </div>
          <div data-layout={{ name: 'header' }} style={{backgroundColor: 'black'}}>
            <NavBar elements={[
              { component: <Intro />, name: 'Home' },
              { component: <DeskTop />, name: 'DeskTop' },
              { component: <CardDeck />, name: 'CardDeck' },
              { component: <Solitaire />, name: 'Solitaire' },
              { component: <Grid />, name: 'Grid' }
            ]}
              callback={this.select}
            />
          </div>

          <div data-layout={{ name: 'content' }} >
            {this.state.app}
          </div>

        </ReactLayout>
      </ErrorBoundary>
    );

  }
}

render(<Examples />, document.getElementById("root"));

