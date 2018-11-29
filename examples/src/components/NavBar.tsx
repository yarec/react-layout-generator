import * as React from 'react';
import styled from 'styled-components';

// These paths are for the examples only. In an application you
// would get these by importing from 'react-layout-generator'
import RLGColumns from '../../../src/generators/RLGColumns'
import ReactLayout from '../../../src/ReactLayout'

// tslint:disable-next-line:variable-name
export const Button = styled.button`
  font-size: 1rem;
  background: transparent;
  border: none;
  color: white;
`

export const SelectedButton = styled.button`
  font-size: 1rem;
  background: 'white';
  border: none;
  color: black;
`

interface IElement {
  component: any;
  name: string;
}

interface IElementRef extends IElement {
  handler: (event: React.MouseEvent) => void;
}

interface INavBarProps {
  elements: IElement[];
  callback: (component: any) => void;
}

interface INavBarState {
  selected: string | undefined;
}

export default class NavBar extends React.Component<INavBarProps, INavBarState> {
  private n = RLGColumns('navbar');
  private elementRefs: IElementRef[] = [];

  constructor(props: INavBarProps) {
    super(props);

    this.state = {
      selected: undefined
    }

    this.props.elements.forEach((e: IElement) => {
      this.elementRefs.push({
        component: e.component,
        name: e.name,
        handler: (event: React.MouseEvent<HTMLButtonElement>) => {
          this.setState({ selected: e.name });
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
      if (e.name === this.state.selected) {
        return (
          <SelectedButton
            key={e.name}
            data-layout={{ name: e.name }}
            onClick={e.handler}
            
          >
            {e.name}
          </SelectedButton>
        )
      }
      else {
        return (
          <Button
            key={e.name}
            data-layout={{ name: e.name }}
            onClick={e.handler}
            
          >
            {e.name}
          </Button>
        )
      }
    });
  }
}