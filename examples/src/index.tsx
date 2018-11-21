import * as React from 'react';
import { render } from 'react-dom';

import { IGenerator } from '../../src/generators/Generator';
import RLGColumns from '../../src/generators/RLGColumns';
import RLGDesktop from '../../src/generators/RLGDesktop';
import ReactLayout from '../../src/ReactLayout';
// import CardDeck from './CardDeck';
import DeskTop from './desktop/DeskTop';
import ErrorBoundary from './ErrorBoundary';
// import Solitaire from './Solitaire';

import NavBar from './NavBar'

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
    p.set('headerHeight', 24);
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

  public selectDesktop = (event: React.MouseEvent<HTMLDivElement>) => {
    this.setState({app: <DeskTop />});
  }

  public selectCardDeck = (event: React.MouseEvent<HTMLDivElement>) => {
    // this.setState({app: <CardDeck />});
  }

  public content = () => {
    return this.state.app;
  }

  public render() {
    if (!this.state.app) {

      return (
        <ErrorBoundary>
          <ReactLayout name='desktop' g={this.g}>
            <div data-layout={{ name: 'title' }} >
              <h1>React Layout Generator Examples</h1>
            </div>
            <div data-layout={{ name: 'header' }}>
              <NavBar/>
            </div>
            <div data-layout={{ name: 'content' }}>
              <ReactLayout
                name={'reactLayout.desktop.example'}
                editLayout={true}
                g={this.g1}
              />
            </div>
          </ReactLayout>
        </ErrorBoundary>
      );
    }
    return <this.state.app />
  }
}

render(<Examples />, document.getElementById("root"));

