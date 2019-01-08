import * as React from 'react';
import styled from 'styled-components';

import Block, { IPosition, IUnit, PositionRef } from '../../../src/components/Block';
import Blocks from '../../../src/components/Blocks';
import Params from '../../../src/components/Params';
import { updateParamLocation } from '../../../src/editors/update';
import Generator, { ICreate, IGenerator } from '../../../src/generators/Generator';
import RLGLayout from '../../../src/RLGLayout';
import RLGPanel, { IRLGPanelArgs } from '../../../src/RLGPanel';
import { DebugOptions, ISize } from '../../../src/types';
import cssColor from '../assets/colors';

// tslint:disable-next-line:variable-name
const Title = styled.span`
  font-family: Arial, Helvetica, sans-serif;
  background: transparent;
  color: ${cssColor.light};
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); 
`

interface ITableProps extends React.HTMLProps<HTMLDivElement> {
  name: string;
  title: string;
  containersize: ISize;
  rowData: string[][];
}

export default class Table extends React.Component<ITableProps> {
  private _g: IGenerator;
  private _params: Params;

  constructor(props: ITableProps) {
    super(props);

    this._params = new Params({
      name: 'props.name', initialValues: [
        ['containersize', { width: 0, height: 0 }],
        ['titleHeight', 36],
        ['rowHeight', 24]
      ]
    });
    this._g = new Generator('chart', this.init, this._params, this.create);
  }

  public render() {

    return (
      <RLGLayout
        name={this.props.name}
        debug={DebugOptions.none}
        g={this._g}
        containersize={this.props.containersize}
      >
        <RLGPanel data-layout={{ name: 'title' }} style={{ backgroundColor: 'black' }} >
          {(args: IRLGPanelArgs) => (
              <>
                <Title>{this.props.name}</Title>
                {this.createRows()}
              </>
         )}
        </RLGPanel>
      </RLGLayout>
    );
  }

  private createRows = () => {
    return null;
  }

  private init = (g: IGenerator): Blocks => {

    const containersize = this._params.get('containersize') as ISize;
    const titleHeight = this._params.get('titleHeight') as number;
    const rowHeight = this._params.get('rowHeight') as number;
    // const footerHeight = this._params.get('footerHeight') as number;

    const layouts = g.layouts();

    if (this._params.changed()) {
      // update Layout for each update
      layouts.map.forEach((layout) => {
        layout.touch();
      });
    }

    if (containersize) {

      const title: IPosition = {
        units: { origin: { x: 0, y: 0 }, location: IUnit.pixel, size: IUnit.pixel },
        location: { x: 0, y: 0 },
        size: { width: containersize.width, height: titleHeight },
        editor: {
          edits: [
            { ref: PositionRef.position, variable: 'titleHeight', updateParam: updateParamLocation }
          ]
        }
      }
      // console.log('cardSize', cardSize);

      layouts.set('title', title, g);

      const row: IPosition = {
        units: { origin: { x: 0, y: 0 }, location: IUnit.pixel, size: IUnit.pixel },
        location: { x: 0, y: titleHeight },
        size: { width: containersize.width, height: rowHeight },
        positionChildren: this.positionRowChildren
      }

      layouts.set('row', row, g);

    }
    return layouts;
  }

  private positionRowChildren = (layout: Block, g: IGenerator, index: number) => {
    // Return a Layout relative to layout starting at position at (0, 0)

    const rowHeight = this._params.get('rowHeight') as number;
    const containersize = this._params.get('containersize') as ISize;
    const titleHeight = this._params.get('titleHeight') as number;

    // These children get placed vertically based on index
    const child: IPosition = {
      units: layout.units,
      location: { x: 0, y: titleHeight + index * rowHeight },
      size: { width: containersize.width, height: rowHeight }
    };

    // This layout is temp and will not be stored in layouts
    return new Block('temp', child, g);
  }

  private create(args: ICreate): Block {

    if (!args.position) {
      console.error(`TODO default position ${args.name}`);
    }

    const layout = args.g.layouts().set(args.name, args.position, args.g);

    return layout;
  }
}