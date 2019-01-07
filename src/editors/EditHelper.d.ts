export interface IEditHelperProps {
    editHelper: () => EditHelper;
}
export declare enum Status {
    disabled = 0,
    down = 1,
    up = 2
}
export interface ICommand {
    name: string;
    command: (status: Status) => Status | undefined;
    status?: (() => Status) | Status | undefined;
}
export interface IEditTool {
    updateTool: () => void;
}
export default class EditHelper {
    private _commands;
    private _status;
    private _updateTool;
    constructor();
    register: (editTool: IEditTool) => void;
    clear(): void;
    load(commands: ICommand[]): void;
    do: (name: string) => void;
    status: (name: string) => Status.disabled | Status;
}
