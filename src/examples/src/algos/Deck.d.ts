export default class Deck {
    private _cards;
    constructor();
    readonly cards: string[];
    reset(): void;
    shuffle: () => this;
}
