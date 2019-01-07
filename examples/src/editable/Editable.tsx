import * as React from 'react';

import styled from 'styled-components';

import Params, { ParamValue } from '../../../src/components/Params';
import desktopGenerator from '../../../src/generators/desktopGenerator';
import { loadFromLocalStorage, saveToLocalStorage } from '../../../src/generators/utils';
import RLGLayout, { EditOptions } from '../../../src/RLGLayout';
import RLGPanel, { IRLGPanelArgs } from '../../../src/RLGPanel';
import { DebugOptions, ISize, rectSize } from '../../../src/types'

import { IUnit } from '../../../src/components/Layout';
import { IEditHelperProps, Status } from '../../../src/editors/EditHelper';
import { IGenerator } from '../../../src/generators/Generator';
import EditableText from '../components/EditableText';

// tslint:disable-next-line:variable-name
export const T = styled.div`
  font-family: Arial, Helvetica, sans-serif;
  background: transparent;
  color: white;
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`

// const Description = styled.p`
//   word-break: normal;
//   white-space: normal;
//   text-align: center;
// `

interface IDeskTopState {
  update: number;
  containersize: ISize;
}

const values: Array<[string, ParamValue]> = [
  ['containersize', { width: 0, height: 0 }],
  ['fullWidthHeaders', 1],
  ['titleHeight', 200],
  ['leftSideWidth', 0],
  ['rightSideWidth', 0],
  ['headerHeight', 100],
  ['footerHeight', 0],
  ['title', { content: `Click to Edit`, fontSize: 30 }],
  ['subtitle', { content: `Click to Edit` }],
  ['content', { content: `Click to Edit` }],
];

const gEditableParams = new Params({
  name: 'editable',
  initialValues: values,
  save: saveToLocalStorage,
  load: loadFromLocalStorage
});

export default class Editable extends React.Component<IEditHelperProps, IDeskTopState> {

  private g: IGenerator;
  private _edit: EditOptions = EditOptions.all;
  private _save: boolean = true;

  constructor(props: IEditHelperProps) {
    super(props);

    this.state = { update: 0, containersize: { width: 0, height: 0 } };
    this.g = desktopGenerator('rlg.eTemplate.example', gEditableParams);
  }

  public componentDidMount() {
    console.log('EditHelpers load Intro');

    if (this._save) {
      const edit = loadFromLocalStorage('rlg.eTemplate.example', 'edit');
      this._edit = edit === 1 ? EditOptions.all : EditOptions.none;
      this.setState({ update: this.state.update + 1 })
    }

    this.props.editHelper().load([
      { name: 'edit', command: this.setEdit, status: this.editState },
      { name: 'save', command: this.setSave, status: this.saveState }
    ])
  }

  public setEdit = (status: Status) => {
    if (status === Status.down) {
      status = Status.up;
      this._edit = EditOptions.all
    } else {
      // save before turning edit off
      if (this._save) {
        saveToLocalStorage('rlg.eTemplate.example', 'edit', this._edit ? 1 : 0)
      }
      status = Status.down;
      this._edit = EditOptions.none
    }

    this.setState({ update: this.state.update + 1 })

    return status;
  }

  public editState = () => {
    return this._edit === EditOptions.all ? Status.up : Status.down;
  }

  public setSave = (status: Status) => {
    // TODO
    // this._save = !this._save;
    // this.setState({ update: this.state.update + 1 })
    // saveToLocalStorage('rlg.eTemplate.example', 'save', this._save ? 1 : 0)
    return undefined;
  }

  public saveState = () => {
    return this._save ? Status.up : Status.down;
  }

  public render() {
    return (
      <RLGLayout
        name={'RLGLayout.ETemplate.example'}
        edit={this._edit ? EditOptions.all : EditOptions.none}
        debug={[DebugOptions.mouseEvents]}
        g={this.g}
      >
        <RLGPanel data-layout={{ name: 'title' }} style={{ backgroundColor: 'hsl(200,100%,80%)' }} >
          {(args: IRLGPanelArgs) => (
            <EditableText
              edit={args.edit}
              debug={args.debug}
              params={args.g.params()}
              variable={'title'}
              containersize={rectSize(args.container)}
            />
          )}
        </RLGPanel>

        <RLGPanel data-layout={{ name: 'header' }} style={{ backgroundColor: 'hsl(210,100%,80%)' }} >
          {(args: IRLGPanelArgs) => (
            <div />
          )}
        </RLGPanel>

        <RLGPanel data-layout={{ name: 'content' }} style={{ backgroundColor: 'hsl(220,100%,80%)' }} >
          {(args: IRLGPanelArgs) => (
            <div />
          )}
        </RLGPanel>

        <div data-layout={{
          name: 'note1',
          position: {
            units: { origin: { x: 0, y: 0 }, location: IUnit.percent, size: IUnit.pixel },
            location: { x: 80, y: 60 },
            size: { width: 200, height: 200 },
            editor: {
              selectable: true
            }
          }
        }}
        >
          <p>Save state enabled and currently can not be disabled.</p>
        </div>

        <div data-layout={{
          name: 'note2',
          position: {
            units: { origin: { x: 0, y: 0 }, location: IUnit.percent, size: IUnit.pixel },
            location: { x: 80, y: 70 },
            size: { width: 200, height: 200 },
            editor: {
              selectable: true
            }
          }
        }}
        >
          <p>Change size of title panel to change font size. Use the drag bar at the bottom.</p>
        </div>

        <div data-layout={{
          name: 'note3',
          position: {
            units: { origin: { x: 0, y: 0 }, location: IUnit.percent, size: IUnit.pixel },
            location: { x: 80, y: 80 },
            size: { width: 200, height: 200 },
            editor: {
              selectable: true
            }
          }
        }}
        >
          <p>Editable text widget does not allow line breaks at this time.</p>
        </div>


      </RLGLayout>
    );
  }
}

{/* <RLGElement data-name='note4' location={{ x: 80, y: 95 }} size={{ width: 200, height: 200 }}>
<p>Test RLGDiv</p>
</RLGElement> */}

