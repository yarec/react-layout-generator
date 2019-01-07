import * as React from 'react';
import 'highlight.js/styles/vs';
import EditHelper from '../../src/editors/EditHelper';
import { IGenerator } from '../../src/generators/Generator';
export declare class Examples extends React.Component<{}, {
    app: JSX.Element;
}> {
    g: IGenerator;
    n: IGenerator;
    private _editHelper;
    constructor(props: any);
    select: (element: JSX.Element) => void;
    getEditHelper: () => EditHelper;
    render(): JSX.Element;
    private separator;
}
