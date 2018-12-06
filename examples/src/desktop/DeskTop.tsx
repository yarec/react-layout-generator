import * as React from 'react';

import styled from 'styled-components';

// import { IGenerator } from '../../../src/generators/Generator';
import RLGDesktop from '../../../src/generators/RLGDesktop';
import ReactLayout from '../../../src/ReactLayout';
import RLGPanel, { IRLPanelArgs } from '../../../src/RLGPanel';
import { ISize } from '../../../src/types'

interface IProps {
  viewport: ISize;
  variable?: string;
  left?: number | string;
  top?: number | string;
  right?: number | string;
  bottom?: number | string;
  bold?: boolean;
}

export const Instruction = styled.p<IProps>`
  word-break: break-all;
  max-width: ${p => p.viewport.width};
  overflow-wrap: break-word;
`

export const List = styled.ul<IProps>`
  max-width: ${p => p.viewport.width};
  list-style: none;
`

export const Item = styled.li<IProps>`
  max-width: ${p => p.viewport.width};
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
interface IDeskTopProps {
  name?: string;
}

interface IDeskTopState {
  update: number;
  viewport: ISize;
}

export default class DeskTop extends React.Component<IDeskTopProps, IDeskTopState> {

  private g = RLGDesktop('rlg.desktop.example');

  constructor(props: IDeskTopProps) {
    super(props);

    this.state = { update: 0, viewport: { width: 0, height: 0 } };

    const p = this.g.params();

    // Set variables to 0 to hide section
    p.set('titleHeight', 0);
    p.set('headerHeight', 24);
    p.set('footerHeight', 24);
    p.set('leftSideWidth', 200);
    p.set('rightSideWidth', 200);

    // Show full width header and footer
    p.set('fullWidthHeaders', 1);
  }

  public render() {

    const contentViewport = this.g.viewport('content')
    console.log(`contentViewport width: ${contentViewport.width} height: ${contentViewport.height}`)

    return (
      <ReactLayout
        name={'reactLayout.desktop.example'}
        edit={true}
        g={this.g}
      >
        <RLGPanel data-layout={{ name: 'leftSide' }} style={{ backgroundColor: 'hsl(200,100%,80%)' }} >
          {(args: IRLPanelArgs) => (
            <>
              <span>LeftSide</span>
              {args.edit ? (this.closeButton(args.viewport, 'leftSideWidth')) : null}
            </>
          )}
        </RLGPanel>

        <RLGPanel data-layout={{ name: 'header' }} style={{ backgroundColor: 'hsl(210,100%,80%)' }} >
          {(args: IRLPanelArgs) => (
            <>
              <span>Header</span>
              {args.edit ? (this.closeButton(args.viewport, 'headerHeight')) : null}
            </>
          )}
        </RLGPanel>

        <RLGPanel data-layout={{ name: 'footer' }} style={{ backgroundColor: 'hsl(210,100%,80%)' }} >
          {(args: IRLPanelArgs) => (
            <>
              <span>Footer</span>
              {args.edit ? (this.closeButton(args.viewport, 'footerHeight')) : null}
            </>
          )}
        </RLGPanel>

        <RLGPanel data-layout={{ name: 'content' }} style={{ backgroundColor: 'hsl(215,100%,80%)', overflow: 'hidden' }}>
          {(args: IRLPanelArgs) => (
            <>
              <span>Desktop Content</span>
              <List viewport={args.viewport}>
                <Item viewport={args.viewport} bold={true}>To disable editing</Item>
                <Instruction viewport={args.viewport}>Set edit prop equal to false</Instruction>
                <Item viewport={args.viewport} bold={true}>To change panel sizes</Item>
                <Instruction viewport={args.viewport}>Drag the borders in this container</Instruction>
                <Item viewport={args.viewport} bold={true}>To hide a panel</Item>
                <Instruction viewport={args.viewport}>Set its variable to 0 - for this demo click on the close button in the panel</Instruction>

                <Item viewport={args.viewport} bold={true}>To make the headers full width</Item>
                <Instruction viewport={args.viewport}>Set the fullWidthHeaders value to 1</Instruction>

                <Item viewport={args.viewport} bold={true}>Params used to define the desktop layout</Item>
                <List viewport={args.viewport}>
                  <Item viewport={args.viewport}>fullWidthHeaders</Item>
                  <Item viewport={args.viewport}>titleHeight</Item>
                  <Item viewport={args.viewport}>headerHeight</Item>
                  <Item viewport={args.viewport}>footerHeight)</Item>
                  <Item viewport={args.viewport}>leftSideWidth</Item>
                  <Item viewport={args.viewport}>rightSideWidth</Item>
                </List>
              </List>
            </>
          )}
        </RLGPanel>

        <RLGPanel data-layout={{ name: 'rightSide' }} style={{ backgroundColor: 'hsl(200,100%,80%)' }} >
          {(args: IRLPanelArgs) => (
            <>
              <span>RightSide</span>
              {args.edit ? (this.closeButton(args.viewport, 'rightSideWidth')) : null}
            </>
          )}
        </RLGPanel>
      </ReactLayout>
    );
  }

  public closePanel = (e: React.MouseEvent<HTMLButtonElement>) => {
    // tslint:disable-next-line:no-string-literal
    const value = e.target['value'];
    this.g.params().set(value, 0);
    this.setState({ update: this.state.update + 1 });
  }

  private closeButton = (viewport: ISize, variable: string) => {
    return <Close viewport={viewport} right={0} top={0}
      // tslint:disable-next-line:jsx-no-lambda
      onClick={this.closePanel} value={variable}>
      X
    </Close>;
  }
}


