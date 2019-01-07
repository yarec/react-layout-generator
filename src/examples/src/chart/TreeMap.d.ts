export interface INode {
    name: string;
    parent: string;
    children: string[];
    info: string;
}
export default class TreeMap {
    private _map;
    constructor(values: Array<[string, INode]>);
    lookup(name: string): INode | undefined;
    root(): void;
}
