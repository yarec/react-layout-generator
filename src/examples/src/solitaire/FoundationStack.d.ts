/// <reference types="react" />
export default class FoundationStack {
    private _stack;
    constructor(update: () => void);
    clear: () => void;
    cards(): JSX.Element | JSX.Element[];
}
