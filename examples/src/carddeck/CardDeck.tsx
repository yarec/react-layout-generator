import * as React from 'react';
import styled from 'styled-components';

import {
  DebugOptions,
  dynamicGenerator,
  IEditHelperProps,
  PositionRef,
  RLGLayout,
  Status,
  Unit
} from '../importRLG'

import { ServiceOptions } from '../../../src/types';
import Deck from '../algos/Deck';
// import cssColor from '../assets/colors';
// import Note from '../components/Note';

const Description = styled.p`
  font-family: Arial, Helvetica, sans-serif;
  word-break: normal;
  white-space: normal;
`;

// tslint:disable-next-line:variable-name
// const Title = styled.h3`
//   font-family: Arial, Helvetica, sans-serif;
//   background: transparent;
//   color: ${cssColor.dark};
//   margin: 0;
//   position: absolute;
//   // top: 50%;
//   // left: 50%;
//   // transform: translate(-50%, -50%);
//   left: 10;
// `

const Container = styled.div`
  position: absolute;
  color: #000;
  background: #fffb02;
  border-radius: 5px;
  background: linear-gradient(top, #f9d835, #f3961c);
  padding: 0;
`

class Button extends React.Component<React.HTMLProps<HTMLButtonElement>> {
  public render() {
    return <button style={this.props.style}>{this.props.children}</button>
  }
}

interface ICardDeckState {
  update: number;
}

// tslint:disable-next-line:max-classes-per-file
export default class CardDeck extends React.Component<IEditHelperProps, ICardDeckState> {

  private _g = dynamicGenerator('example.CardDeck');
  private _deck = new Deck();
  private _edit: boolean = true;

  constructor(props: IEditHelperProps) {
    super(props)
    this.state = { update: 0 };
  }

  public componentDidMount() {
    // console.log('Grid componentDidMount load grid');
    this.props.editHelper().load([
      { name: 'edit', command: this.setEdit, status: this._edit ? Status.up : Status.down }
    ])
  }

  public setEdit = (status: Status) => {
    if (status === Status.down) {
      status = Status.up;
      this._edit = true
    } else {
      status = Status.down;
      this._edit = false
    }

    // this.grid(this._gridUnit)
    // this._g.clear();
    this.setState({ update: this.state.update + 1 })

    return status;
  }

  public render() {
    return (
      <RLGLayout
        name={'example.cardDeck'}
        service={this._edit ? ServiceOptions.edit : ServiceOptions.none}
        debug={DebugOptions.timing}
        g={this._g}
      >
        {this.createElements()}
        
        <Button data-layout={{
          name: 'shuffle',
          position: {
            origin: {x: 100, y: 0},
            location: { x: 90, y: 80, unit: Unit.percent },
            size: { width: 100, height: 24 }
          }
        }}
          onClick={this.shuffle}
        >
          Shuffle
        </Button>
        <Container data-layout={{
          name: 'instructions',
          position: {
            origin: {x: 100, y: 0},
            location: { x: 90, y: 10, unit: Unit.percent },
            size: { width: 200, height: 350, unit: Unit.unmanagedHeight }
          }
        }}
        >
          <>
            <Description>
              Edit mode enabled.
            </Description>
            <Description>
              Use the mouse to drag objects.
            </Description>
            <Description>
              Use shift-click to select a card.
            </Description>
            <Description>
              Use context menu align selected cards.
            </Description>
            <Description>
              Use alt-click when in edit mode (when the move cursor is visible) to click on a button.
            </Description>
          </>
        </Container>
      </RLGLayout>
    );
  }

  private createElement = (card: string) => {
    const e = require(`../assets/cards/${card}.jpg`);

    return (
      <div
        key={card}
        data-layout={{
          name: card,
          position: {
            location: { x: 5, y: 5, unit: Unit.percent },
            editor: {
              edits: [{ ref: PositionRef.position }]
            },
            size: { width: 120, height: 156 }
          }
        }} >
        <img width={120} height={156} src={e} />
      </div >
    )
  }

  private createElements = (): any[] => {
    const a: JSX.Element[] = [];
    this._deck.cards.forEach((card) => {
      a.push(this.createElement(card));
    })
    return a;
  }

  private shuffle = (event: React.MouseEvent<HTMLButtonElement>) => {
    this._deck.shuffle();
    this._g.clear();
    this.setState({ update: this.state.update + 1 });
  }
}
