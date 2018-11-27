import * as React from 'react';

export default class FoundationStack {

  private stack: string[] = [];

  public clear = () => {
    this.stack = [];
  }

  public cards() {
    if (this.stack.length) {
      return this.stack.map((name, i) => {
        return (
          <img key={name} src={this.path(name)} />
        );
      })
    }
    return (<div 
      key='empty' 
      style={{ borderWidth: 3, borderColor: 'black', borderRadius: 10, backgroundColor: '#FBF8EF' }} 
      onDragOver={this.onDragOver}
      />)
  }

  public drop(card: string) {
    this.stack.push(card)
  }

  public onDragOver(e: React.DragEvent) {
    console.log('onDragOver');
  }

  private path = (name: string) => {
    return require(`../assets/cards/${name}.jpg`)
  }


}