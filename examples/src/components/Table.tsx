import * as React from 'react';
import styled from 'styled-components';

import Block, { IPosition } from '../../../src/components/Block';
import Blocks from '../../../src/components/Blocks';
import Params from '../../../src/components/Params';
import { updateParamLocation } from '../../../src/editors/update';
import Generator, { ICreate, IGenerator } from '../../../src/generators/Generator';
import { RLGLayout} from '../../../src/RLGLayout';
import { IRLGPanelArgs, RLGPanel } from '../../../src/RLGPanel';
import { DebugOptions, ISize, PositionRef, Unit } from '../../../src/types';
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

    const blocks = g.blocks();

    if (this._params.changed()) {
      // update Layout for each update
      blocks.map.forEach((block) => {
        block.touch();
      });
    }

    if (containersize) {

      const title: IPosition = {
        units: { origin: { x: 0, y: 0 }, location: Unit.pixel, size: Unit.pixel },
        location: { x: 0, y: 0 },
        size: { width: containersize.width, height: titleHeight },
        editor: {
          edits: [
            { ref: PositionRef.position, variable: 'titleHeight', updateParam: updateParamLocation }
          ]
        }
      }
      // console.log('cardSize', cardSize);

      blocks.set('title', title, g);

      const row: IPosition = {
        units: { origin: { x: 0, y: 0 }, location: Unit.pixel, size: Unit.pixel },
        location: { x: 0, y: titleHeight },
        size: { width: containersize.width, height: rowHeight },
        positionChildren: this.positionRowChildren
      }

      blocks.set('row', row, g);

    }
    return blocks;
  }

  private positionRowChildren = (block: Block, g: IGenerator, index: number) => {
    // Return a Layout relative to block starting at position at (0, 0)

    const rowHeight = this._params.get('rowHeight') as number;
    const containersize = this._params.get('containersize') as ISize;
    const titleHeight = this._params.get('titleHeight') as number;

    // These children get placed vertically based on index
    const child: IPosition = {
      units: block.units,
      location: { x: 0, y: titleHeight + index * rowHeight },
      size: { width: containersize.width, height: rowHeight }
    };

    // This block is temp and will not be stored in blocks
    return new Block('temp', child, g);
  }

  private create(args: ICreate): Block {

    if (!args.position) {
      console.error(`TODO default position ${args.name}`);
    }

    const block = args.g.blocks().set(args.name, args.position, args.g);

    return block;
  }
}