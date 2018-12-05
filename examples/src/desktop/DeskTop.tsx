import * as React from 'react';

import styled from 'styled-components';

import { IGenerator } from '../../../src/generators/Generator';
import RLGDesktop from '../../../src/generators/RLGDesktop';
import ReactLayout from '../../../src/ReactLayout';
import RLGPanel from '../../../src/RLGPanel';
import { ISize } from '../../../src/types'

interface IProps {
  viewport: ISize;
  variable?: string;
  left?: number | string;
  top?: number | string;
  right?: number | string;
  bottom?: number | string;
}

export const Instruction = styled.p<IProps>`
  word-break: break-all;
  max-width: ${p => p.viewport.width};
  overflow-wrap: break-word;
`

export const List = styled.ul<IProps>`
  max-width: ${p => p.viewport.width};
`

export const Item = styled.li<IProps>`
  max-width: ${p => p.viewport.width};
  white-space: wrap;
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
        editLayout={true}
        g={this.g}
      >
        <RLGPanel data-layout={{ name: 'leftSide' }} style={{ backgroundColor: 'hsl(200,100%,80%)' }} >
          {(viewport: ISize, editLayout: boolean, g: IGenerator) => (
            <>
              <span>LeftSide</span>
              {editLayout ? (this.closeButton(viewport, 'leftSideWidth')) : null}
            </>
          )}
        </RLGPanel>

        <div data-layout={{ name: 'header' }} style={{ backgroundColor: 'hsl(210,100%,80%)' }} >
          <span>Header</span>
        </div>

        <div data-layout={{ name: 'footer' }} style={{ backgroundColor: 'hsl(210,100%,80%)' }} >
          <span>Footer</span>
        </div>

        <RLGPanel data-layout={{ name: 'content' }} style={{ backgroundColor: 'hsl(215,100%,80%)' }}>
          {(viewport: ISize) => (
            <>
              <span>Desktop Content</span>
              <List viewport={viewport}>
                <li>To disable editing</li>
                <p>set editLayout prop equal to false</p>
                <li>To change panel sizes</li>
                <p>Drag the borders in this container</p>
                <li>To hide a panel</li>
                <p>Set its variable to 0</p>

                <Item viewport={viewport}>To make the headers full width</Item>
                <p>Set the fullWidthHeaders value to 1</p>

                <List viewport={viewport}>
                  <li>fullWidthHeaders</li>
                  <li>titleHeight</li>
                  <li>headerHeight</li>
                  <li>footerHeight)</li>
                  <li>leftSideWidth</li>
                  <li>rightSideWidth</li>
                </List>
              </List>
            </>
          )}
        </RLGPanel>

        <div data-layout={{ name: 'rightSide' }} style={{ backgroundColor: 'hsl(200,100%,80%)' }} >
          <span>RightSide</span>
        </div>
      </ReactLayout>
    );
  }

  public closePanel = (e: React.MouseEvent<HTMLButtonElement>) => {
    // tslint:disable-next-line:no-string-literal
    const value = e.target['value'];
    this.g.params().set(value, 0);
    this.setState({ update: this.state.update + 1 });
  }

  private closeButton = (viewport: ISize, variable: string) =>{
    return <Close viewport={viewport} right={0} top={0}
      // tslint:disable-next-line:jsx-no-lambda
      onClick={this.closePanel} value={variable}>
      X
    </Close>;
  }
}


