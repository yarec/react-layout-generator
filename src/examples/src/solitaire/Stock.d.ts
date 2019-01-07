/// <reference types="react" />
import Card from './Card';
export default class Stock {
    private _deck;
    private _stack;
    constructor(update: () => void);
    shuffle: () => void;
    pop: () => Card | undefined;
    unshift: (card: Card) => void;
    cards: () => JSX.Element | JSX.Element[];
    readonly length: number;
}
