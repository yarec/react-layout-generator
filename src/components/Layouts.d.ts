import Layout from './Layout';
export default class Layouts {
    private _layouts;
    private _byIndex;
    constructor(layouts: Array<[string, Layout]>);
    values(): IterableIterator<Layout>;
    readonly map: Map<string, Layout>;
    readonly size: number;
    find(i: number): Layout;
    get(key: string): Layout | undefined;
    set(key: string, v: Layout): void;
}
