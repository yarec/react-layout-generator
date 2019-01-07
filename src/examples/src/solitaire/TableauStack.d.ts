/// <reference types="react" />
import Stock from './Stock';
export default class TableauStack {
    private _stack;
    constructor(update: () => void);
    clear: () => void;
    populate(stock: Stock, index: number): void;
    cards: () => JSX.Element | JSX.Element[];
}
