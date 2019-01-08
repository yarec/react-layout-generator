import * as React from 'react';
import styled from 'styled-components';

// These paths are for the examples only. In an application you
// would get these by importing from 'react-layout-generator'
import { IPosition } from '../../../src/components/Block';
import Params from '../../../src/components/Params';
import EditHelper, { IEditTool, Status } from '../../../src/editors/EditHelper'
import { IGenerator } from '../../../src/generators/Generator';
import rowsGenerator from '../../../src/generators/rowsGenerator';
import {RLGLayout} from '../../../src/RLGLayout';
import { DebugOptions, ISize, Unit } from '../../../src/types';
import cssColor from '../assets/colors';

// tslint:disable-next-line:variable-name
export const Button = styled.button`
  font-size: 24;
  padding: 0;
  background: transparent;
  border: none;
  color: ${cssColor.lightMiddle};
`

export const SelectedButton = styled.button`
  font-size: 24;
  background: 'white';
  border: none;
  color: ${cssColor.middle};
`
interface IButton {
  component: (props: any) => JSX.Element;
  name: string;
}

interface IButtonRef extends IButton {
  handler: (event: React.MouseEvent) => void;
}

interface IToolBarProps {
  commands: IButton[];
  editHelper: EditHelper;
}

interface IToolBarState {
  update: number;
}

export default class ToolBar extends React.Component<IToolBarProps, IToolBarState> implements IEditTool{
  private _n: IGenerator;
  private _params: Params;

  constructor(props: IToolBarProps) {
    super(props);

    this._n = rowsGenerator({name: 'example.toolBar', editHelper: props.editHelper});

    this._params = this._n.params();
    this._params.set('itemSize', {width: 30, height: 24});
    this.state = { update: 0 };

    this.props.editHelper.register(this);
  }

  public componentWillReceiveProps(props: IToolBarProps) {
    this.props.editHelper.register(this);
  }

  public updateTool = () => {
    this.setState({ update: this.state.update + 1 });
  }

  public render() {
    this._n.reset();

    return (
      <RLGLayout
        name='ToolBar'
        debug={DebugOptions.none}
        g={this._n}
      >
        {this.createElements()}
      </RLGLayout>
    );
  }

  private onClick = (name: string) => {
    return (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      this.props.editHelper.do(name);
      this.setState({ update: this.state.update + 1 });
    }
  }

  private createElements = () => {

    const r = this.props.commands.map((e: IButtonRef, i) => {
      // const width = this._size.get(e.name)

   
      let v: any = null;
      const fontSize = (this._params.get('itemSize') as ISize).height;
      if (e.name !== '') {
        const status = this.props.editHelper.status(e.name);
        if (status !== undefined) {
        
          // console.log(`ToolBar ${e.name} ${status}`);
          
          const color = (status === 0) ? cssColor.middle : ((status === Status.down) ? cssColor.light : cssColor.darkMiddle);
          const background = status === Status.up ? cssColor.light : 'transparent';
          const props = { color, fontSize, style: {background }}
         
          v = (
            <Button key={e.name} data-layout={{ name: e.name }} onClick={this.onClick(e.name)} style={{background}}>
              {e.component(props)}
            </Button>
          );
        }
      } else {
        const name1 = `separator${i}`;
        const p: IPosition = {
          units: {
            origin: { x: 0, y: 0 },
            location: Unit.pixel,
            size: Unit.pixel
          },
          location: { x: 0, y: 0 },
          size: { width: fontSize, height: fontSize / 2 }
        }
        v = e.component({ key: name1, 'data-layout': { name: name1, position: p }, color: cssColor.lightMiddle, fontSize })
      }
      return v;
    });
    return r;
  }
}