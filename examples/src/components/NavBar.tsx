import * as React from 'react';
import styled from 'styled-components';

// These paths are for the examples only. In an application you
// would get these by importing from 'react-layout-generator'
import RLGColumns from '../../../src/generators/RLGColumns'
import ReactLayout from '../../../src/ReactLayout'

// tslint:disable-next-line:variable-name
const Button = styled.button`
  font-size: 1rem;
  background: transparent;
  border: none;
  color: white;
  `

interface IElement {
  component: any;
  name: string;
}

interface IElementRef extends IElement {
  handler: (event: React.MouseEvent) => void;
}

interface INavBar {
  elements: IElement[];
  callback: (component: any) => void;
}

export default class NavBar extends React.Component<INavBar> {
  private n = RLGColumns('navbar');
  private elementRefs: IElementRef[] = [];

  constructor(props: INavBar) {
    super(props);

    this.props.elements.forEach((e: IElement) => {
      this.elementRefs.push({
        component: e.component,
        name: e.name,
        handler: (event: React.MouseEvent<HTMLButtonElement>) => {
          this.props.callback(e.component)
        }
      })
    });
  }

  public render() {

    return (
      <ReactLayout name='navbar' g={this.n}>
        {this.createElements()}
      </ReactLayout>
    );
  }

  private createElements = () => {
    return this.elementRefs.map((e: IElementRef) => {
      return (
        <Button
          key={e.name}
          data-layout={{ name: e.name }}
          onClick={e.handler}
        >
          {e.name}
        </Button>
      )
    });
  }
}