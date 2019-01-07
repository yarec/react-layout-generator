/// <reference types="react" />
import Stock from './Stock';
export default class Waste {
    private _waste;
    private _update;
    constructor(update: () => void);
    populate: (stock: Stock) => void;
    clear: () => void;
    cards: () => JSX.Element | JSX.Element[];
}
