export declare enum Face {
    up = 1,
    down = 2
}
export default class Card {
    private _name;
    private _face;
    private _rank;
    private _suite;
    constructor(name: string, face: Face);
    readonly name: string;
    readonly face: Face;
    readonly rank: number;
    readonly suite: string;
    flip: () => void;
    readonly path: any;
}
