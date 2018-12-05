import * as React from 'react';
import styled from 'styled-components';

// These paths are for the examples only. In an application you
// would get these by importing from 'react-layout-generator'
import { IUnit } from '../../../src/components/Layout';
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
  update: number;
}

export default class NavBar extends React.Component<INavBarProps, INavBarState> {
  private n = RLGColumns('navbar');
  private elementRefs: IElementRef[] = [];
  private _size: Map<string, number> = new Map();
  private _changed: number = 0;

  constructor(props: INavBarProps) {
    super(props);

    this.state = {
      selected: undefined,
      update: 0
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
    this._changed = 0;
    this.n.reset();

    return (
      <ReactLayout name='navbar' g={this.n}>
        {this.createElements()}
      </ReactLayout>
    );
  }

  protected setSize = (name: string, v: number) => {
    const n = this._size.get(name);
    if (n === undefined || v !== n) {
      this._size.set(name, v);
      if (!this._changed) {
        this._changed = 1;
        setTimeout(() => { this.setState({ update: this.state.update + 1 }) }, 3);
      }
    }
  }

  private createElements = () => {
    return this.elementRefs.map((e: IElementRef) => {
      const width = this._size.get(e.name);
      if (e.name === this.state.selected) {
        return (
          <div
            key={e.name}
            data-layout={{
              name: e.name,
              position: {
                units: { origin: { x: 0, y: 0 }, location: IUnit.percent, size: IUnit.pixel },
                location: { x: 0, y: 0 },
                size: { width: width ? width : 100, height: 20 }
              }
            }}>
            <SelectedButton
              key={e.name}
              data-layout={{ name: e.name }}
              onClick={e.handler}
            >
              {e.name}
            </SelectedButton>
          </div>
        )
      }
      else {
        return (
          <div
            key={e.name}
            data-layout={{
              name: e.name,
              position: {
                units: { origin: { x: 0, y: 0 }, location: IUnit.percent, size: IUnit.pixel },
                location: { x: 0, y: 0 },
                size: { width: width ? width : 100, height: 20 }
              }
            }}>
            <Button
              key={e.name}
              ref={(c) => { if (c) {this.setSize(e.name, c.offsetWidth)}}}

              onClick={e.handler}
            >
              {e.name}
            </Button>
          </div>

        )
      }
    });
  }
}