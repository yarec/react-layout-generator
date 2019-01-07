import * as React from 'react';
interface IButtonProps extends React.HTMLProps<HTMLButtonElement> {
    name: string;
}
export default class Button extends React.Component<IButtonProps> {
    constructor(props: IButtonProps);
    render(): JSX.Element;
}
export {};
