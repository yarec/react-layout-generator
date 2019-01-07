import * as React from 'react';
import Layout, { IMenuItem } from '../components/Layout';
import { IGenerator } from '../generators/Generator';
import { DebugOptions, IRect } from '../types';
export interface IRLGSelectProps {
    name: string;
    boundary: IRect;
    debug?: DebugOptions;
    select: (instance: RLGSelect) => void;
    onUpdate: (reset?: boolean) => void;
    g: IGenerator;
}
export interface IRLGSelectState {
    contextMenu: boolean;
}
interface ISavedPosition {
    name: string;
    value: IRect;
}
export interface IMenuItem {
    name: string;
    disabled?: boolean;
    checked?: boolean;
    command?: () => void;
}
export default class RLGSelect extends React.Component<IRLGSelectProps, IRLGSelectState> {
    private _editHelper;
    private _selected;
    private _undo;
    private _redo;
    constructor(props: IRLGSelectProps);
    componentDidMount(): void;
    readonly commands: IMenuItem[];
    selected: (name: string) => boolean;
    undo: () => void;
    redo: () => void;
    restore: (data: ISavedPosition[]) => ISavedPosition[];
    add(layout: Layout): void;
    remove(layout: Layout): void;
    clear(): void;
    pushState: () => void;
    alignCenter: () => void;
    alignMiddle: () => void;
    alignTop: () => void;
    alignLeft: () => void;
    alignBottom: () => void;
    alignRight: () => void;
    render(): JSX.Element;
}
export {};
