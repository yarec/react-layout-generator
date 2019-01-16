import * as React from 'react';

import styled from 'styled-components';

import {
  desktopGenerator,
  EditOptions,
  IEditHelperProps,
  IRLGMetaDataArgs,
  ISize,
  Params,
  ParamValue,
  rectSize, 
  RLGLayout, 
  RLGPanel,
  Status
} from '../importRLG'

interface IProps {
  containersize: ISize;
  variable?: string;
  left?: number | string;
  top?: number | string;
  right?: number | string;
  bottom?: number | string;
  bold?: boolean;
}

export const Instruction = styled.p<IProps>`
  word-break: break-all;
  max-width: ${p => p.containersize.width};
  overflow-wrap: break-word;
`

export const List = styled.ul<IProps>`
  max-width: ${p => p.containersize.width};
  list-style: none;
`

export const Item = styled.li<IProps>`
  max-width: ${p => p.containersize.width};
  white-space: wrap;

  ${({ bold }) => bold && `font-weight: bold;`}
`

export const Close = styled.button<IProps>` 
  position: absolute;
  background: transparent;
  border: none;
  right: ${p => p.right};
  top: ${p => p.top};
`

interface IDeskTopState {
  update: number;
  containersize: ISize;
}

const values: Array<[string, ParamValue]> = [
  ['titleHeight', 0],
  ['headerHeight', 24],
  ['footerHeight', 24],
  ['leftSideWidth', 200],
  ['rightSideWidth', 200],
  ['fullWidthHeaders', 1],
];

const gDesktopParams = new Params({ name: 'desktop', initialValues: values });

export default class DeskTop extends React.Component<IEditHelperProps, IDeskTopState> {

  private g = desktopGenerator('rlg.desktop.example', gDesktopParams);
  private _edit: EditOptions = EditOptions.none;

  constructor(props: IEditHelperProps) {
    super(props);

    this.state = { update: 0, containersize: { width: 0, height: 0 } };
  }

  public componentDidMount() {
    this.props.editHelper().load([
      { name: 'edit', command: this.setEdit, status: this.editState }
    ])
  }

  public setEdit = (status: Status) => {
    if (status === Status.down) {
      status = Status.up;
      this._edit = EditOptions.all
    } else {
      status = Status.down;
      this._edit = EditOptions.none
    }

    // this.grid(this._gridUnit)
    // this._g.clear();
    this.setState({ update: this.state.update + 1 })

    return status;
  }

  public editState = () => {
    return this._edit ? Status.up : Status.down;
  }

  public render() {

    // const contentcontainersize = this.g.containersize('content');

    return (
      <RLGLayout
        name={'RLGLayout.desktop.example'}
        edit={this._edit ? EditOptions.all : EditOptions.none}
        g={this.g}
      >
        <RLGPanel data-layout={{ name: 'leftSide' }} style={{ backgroundColor: 'hsl(200,100%,80%)' }} >
          {(args: IRLGMetaDataArgs) => (
            <>
              <span>LeftSide</span>
              {args.edit ? (this.closeButton(rectSize(args.container), 'leftSideWidth')) : null}
            </>
          )}
        </RLGPanel>

        <RLGPanel data-layout={{ name: 'header' }} style={{ backgroundColor: 'hsl(210,100%,80%)' }} >
          {(args: IRLGMetaDataArgs) => (
            <>
              <span>Header</span>
              {args.edit ? (this.closeButton(rectSize(args.container), 'headerHeight')) : null}
            </>
          )}
        </RLGPanel>

        <RLGPanel data-layout={{ name: 'footer' }} style={{ backgroundColor: 'hsl(210,100%,80%)' }} >
          {(args: IRLGMetaDataArgs) => (
            <>
              <span>Footer</span>
              {args.edit ? (this.closeButton(rectSize(args.container), 'footerHeight')) : null}
            </>
          )}
        </RLGPanel>

        <RLGPanel data-layout={{ name: 'content' }} style={{ backgroundColor: 'hsl(215,100%,80%)', overflow: 'hidden' }}>
          {(args: IRLGMetaDataArgs) => (
            <>
              <span>Desktop Content</span>
              <List containersize={rectSize(args.container)}>
                <Item containersize={rectSize(args.container)} bold={true}>To disable editing</Item>
                <Instruction containersize={rectSize(args.container)}>Set edit prop equal to false</Instruction>
                <Item containersize={rectSize(args.container)} bold={true}>To change panel sizes</Item>
                <Instruction containersize={rectSize(args.container)}>Drag the borders in this container</Instruction>
                <Item containersize={rectSize(args.container)} bold={true}>To hide a panel</Item>
                <Instruction containersize={rectSize(args.container)}>Set its variable to 0 - for this demo click on the close button in the panel</Instruction>

                <Item containersize={rectSize(args.container)} bold={true}>To make the headers full width</Item>
                <Instruction containersize={rectSize(args.container)}>Set the fullWidthHeaders value to 1</Instruction>

                <Item containersize={rectSize(args.container)} bold={true}>Params used to define the desktop block</Item>
                <List containersize={rectSize(args.container)}>
                  <Item containersize={rectSize(args.container)}>fullWidthHeaders</Item>
                  <Item containersize={rectSize(args.container)}>titleHeight</Item>
                  <Item containersize={rectSize(args.container)}>headerHeight</Item>
                  <Item containersize={rectSize(args.container)}>footerHeight)</Item>
                  <Item containersize={rectSize(args.container)}>leftSideWidth</Item>
                  <Item containersize={rectSize(args.container)}>rightSideWidth</Item>
                </List>
              </List>
            </>
          )}
        </RLGPanel>

        <RLGPanel data-layout={{ name: 'rightSide' }} style={{ backgroundColor: 'hsl(200,100%,80%)' }} >
          {(args: IRLGMetaDataArgs) => (
            <>
              <span>RightSide</span>
              {args.edit ? (this.closeButton(rectSize(args.container), 'rightSideWidth')) : null}
            </>
          )}
        </RLGPanel>
      </RLGLayout>
    );
  }

  public closePanel = (e: React.MouseEvent<HTMLButtonElement>) => {
    // tslint:disable-next-line:no-string-literal
    const value = e.target['value'];
    this.g.params().set(value, 0);
    this.setState({ update: this.state.update + 1 });
  }

  private closeButton = (containersize: ISize, variable: string) => {
    return <Close containersize={containersize} right={0} top={0}
      // tslint:disable-next-line:jsx-no-lambda
      onClick={this.closePanel} value={variable}>
      X
    </Close>;
  }
}


