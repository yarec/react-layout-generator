import * as React from 'react';

interface ExampleProps {
  name: string;

}
class Example extends React.PureComponent<ExampleProps> {
  render = () => {
    return (<button style={{width: '120'}}>{this.props.name}</button>)
  }
}

export interface ExamplesProps {

}

export interface ExamplesState {

}

export default class Examples extends React.Component<ExamplesProps, ExamplesState> {

  items: Array<React.ReactElement<Example>> = [
    <Example key={'desktop'} name={'Desktop Layout'} />,
    <Example key={'card deck'} name={'Card Deck'} />
  ]

  render = () => {
    return (
      <>
      <span>{'Examples'}</span>
      <ul style={{listStyleType: 'none'}} >
        {this.items.map((item: React.ReactElement<Example>) => {
          return item;
        })}
      </ul>
      </>
    )
      ;
  }
}