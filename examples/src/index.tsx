import * as React from 'react';

import { render } from 'react-dom';
import styled from 'styled-components';

// styles
import 'highlight.js/styles/vs';

import {
  columnsGenerator,
  DebugOptions,
  desktopGenerator,
  EditHelper,
  EditOptions,
  IGenerator,
  IRLGMetaDataArgs,
  RLGLayout,
  RLGPanel
} from './importRLG'

// Examples
import cssColor from './assets/colors';
import CardDeck from './carddeck/CardDeck';
import Chart from './chart/Chart';
import ErrorBoundary from './components/ErrorBoundary';
import NavBar from './components/NavBar'
import ToolBar from './components/ToolBar';
import DeskTop from './desktop/DeskTop';
import Editable from './editable/Editable';
import Grid from './grid/Grid';
import Intro from './intro/Intro';
import Solitaire from './solitaire/Solitaire';

// Icons
import { FaRegEdit, FaRegSave } from 'react-icons/fa';
import { IconBaseProps } from 'react-icons/lib/iconBase';
import { MdContentCopy, MdContentCut, MdContentPaste, MdRedo, MdUndo } from 'react-icons/md'


// tslint:disable-next-line:variable-name
const Title = styled.h2`
  font-family: Arial, Helvetica, sans-serif;
  background: transparent;
  color: ${cssColor.light};
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`

// function RLGDivElement(n: string) {
//   return <div data-layout={{name: n}}  
// }

// tslint:disable-next-line:max-classes-per-file
export class Examples extends React.Component<{}, { app: JSX.Element }> {

  public g: IGenerator;
  public n: IGenerator;

  private _editHelper: EditHelper;

  constructor(props: any) {
    super(props);

    this.g = desktopGenerator('index');
    const p = this.g.params();

    // Set variables to 0 to hide section
    p.set('titleHeight', 60);
    p.set('headerHeight', 20);
    p.set('footerHeight', 0);
    p.set('leftSideWidth', 40);
    p.set('rightSideWidth', 0);

    // Show full width header and footer
    p.set('fullWidthHeaders', 1);

    this.n = columnsGenerator('navbar');

    this._editHelper = new EditHelper();
    this.state = { app: <Intro editHelper={this.getEditHelper} /> }
  }

  public select = (element: JSX.Element) => {
    this._editHelper.clear();
    this.setState({ app: element });
  }

  public getEditHelper = () => {
    return this._editHelper;
  }

  public render() {
    return (
      <ErrorBoundary>
        <RLGLayout
          name='framework'
          debug={DebugOptions.none}
          edit={EditOptions.none}
          g={this.g}
        >
          <RLGPanel data-layout={{ name: 'title' }} style={{ backgroundColor: cssColor.dark, textAlign: 'center' }} >
            {(args: IRLGMetaDataArgs) => (
              <Title>React Layout Generator Examples</Title>
            )}
          </RLGPanel>

          <div data-layout={{ name: 'header' }} style={{ backgroundColor: cssColor.dark }}>
            <NavBar elements={[
              // if props change then the props should be functions that return the correct value
              { component: <Intro editHelper={this.getEditHelper} />, name: 'Home' },
              { component: <DeskTop editHelper={this.getEditHelper} />, name: 'DeskTop' },
              { component: <CardDeck editHelper={this.getEditHelper} />, name: 'CardDeck' },
              { component: <Solitaire editHelper={this.getEditHelper} />, name: 'Solitaire' },
              { component: <Grid editHelper={this.getEditHelper} />, name: 'Grid' },
              { component: <Chart editHelper={this.getEditHelper} />, name: 'Chart' },
              { component: <Editable editHelper={this.getEditHelper} />, name: 'Editable' },
            ]}
              callback={this.select}
            />
          </div>

          <div data-layout={{ name: 'leftSide' }} style={{ backgroundColor: cssColor.dark }} >
            <ToolBar editHelper={this._editHelper} commands={[
              // These just define the buttons for the toolbar - behavior is controlled by EditHelpers
              { component: FaRegEdit, name: 'edit' },
              { component: FaRegSave, name: 'save' },
              { component: this.separator, name: '' },
              { component: MdUndo, name: 'undo' },
              { component: MdRedo, name: 'redo' },
              { component: this.separator, name: '' },
              { component: MdContentCut, name: 'cut' },
              { component: MdContentCopy, name: 'copy' },
              { component: MdContentPaste, name: 'paste' },
              { component: this.separator, name: '' },
            ]}
            />
          </div>

          <div data-layout={{ name: 'content' }} >
            {this.state.app}
          </div>
        </RLGLayout>
      </ErrorBoundary >
    );

  }

  // private onClickEdit = (event: React.MouseEvent<SVGElement>) => {
  //   console.log('onClickEdit');
  // }

  private separator = (props: IconBaseProps & { key: string }) => {
    const fontSize = typeof props.fontSize === 'string' ? parseInt(props.fontSize, 10) : props.fontSize!;
    const mid = fontSize / 2;
    return (
      <svg key={props.key} data-layout={props['data-layout']} width={props.fontSize} height={mid}>
        <line x1='0' y1={mid / 2} x2={props.fontSize} y2={mid / 2} style={{
          stroke: props.color,
          strokeWidth: '1'
        }} />
      </svg>
    )
  }
}

render(<Examples />, document.getElementById("root"));