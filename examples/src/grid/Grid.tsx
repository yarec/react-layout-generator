import * as React from 'react';

import styled from 'styled-components';

import { 
  DebugOptions,
  dynamicGenerator,
  EditOptions,
  IEditHelperProps,
  IPoint,
  IRLGMetaDataArgs,
  ISize,
  rectSize,
  RLGLayout, 
  RLGPanel, 
  Status,
  toPixel, 
  Unit
} from '../importRLG'

import Button from '../components/Button';
import Table from '../components/Table';

export interface IProps {
  containersize: ISize;
}

const Description = styled.p`
  word-break: normal;
  white-space: normal;
  text-align: center;
`

const CalloutBottom = styled.div<IProps>`
  position: absolute;
  color: #000;
  width: ${(p) => p.containersize.width};
  height: ${(p) => p.containersize.height};
  background: #f3961c;
  border-radius: 10px;
  background: linear-gradient(top, #f9d835, #f3961c);
`

export { CalloutBottom }

export default class Grid extends React.Component<IEditHelperProps, { update: number }> {

  private _g = dynamicGenerator('example.grid');
  private _grid: HTMLCanvasElement;
  private _gridUnitSquare = { x: 0, y: 0 };
  private _gridUnit = Unit.pixel;
  private _units = '1%';
  private _edit = EditOptions.none;

  constructor(props: IEditHelperProps) {
    super(props);
    this.state = { update: 0 }
  }

  public setPixel = (event: React.MouseEvent<HTMLButtonElement>) => {
    this.grid(Unit.pixel)
    this._g.clear();
    this._gridUnit = Unit.pixel;
    this.setState({ update: this.state.update + 1 })
  }

  public setPercent = (event: React.MouseEvent<HTMLButtonElement>) => {
    this.grid(Unit.percent)
    this._g.clear();
    this._gridUnit = Unit.percent;
    this.setState({ update: this.state.update + 1 })
  }

  public setPreserve = (event: React.MouseEvent<HTMLButtonElement>) => {
    this.grid(Unit.preserve)
    this._g.clear();
    this._gridUnit = Unit.preserve;
    this.setState({ update: this.state.update + 1 })
  }

  public componentDidMount() {
    // console.log('Grid componentDidMount load grid');
    this.props.editHelper().load([
      { name: 'edit', command: this.setEdit, status: this._edit ? Status.up : Status.down }
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

  public render() {
    return (
      <RLGLayout
        name='example.Grid'
        debug={[DebugOptions.none]}
        edit={this._edit ? EditOptions.all : EditOptions.none}
        g={this._g}
      >
        <RLGPanel
          data-layout={{
            name: 'grid',
            position: {
              location: { x: 0, y: 0, unit: Unit.percent },
              size: { width: 100, height: 100, unit: Unit.percent }
            }
          }}
          style={{ overflow: 'hidden' }}
        >
          {(args: IRLGMetaDataArgs) => {
            return (
            <canvas
              ref={(element: HTMLCanvasElement) => { this.setGrid(args, element) }}
              width={args.container.width}
              height={args.container.height}
            />
            )}}
        </RLGPanel>

        <RLGPanel
          data-layout={{
            name: 'square (pixel, pixel)',
            position: {
              location: { x: 200, y: 50 },
              size: { width: 200, height: 200 }
            }
          }}
          style={{ backgroundColor: 'tan' }}
        >
          {(args: IRLGMetaDataArgs) => {
            return (
              <Table
                name={args.block.name}
                containersize={rectSize(args.container)}
                title={args.block.name}
                rowData={[
                  [`x: ${args.container.x}`, `y: ${args.container.y}`],
                  [`w: ${args.container.width}`, `h: ${args.container.height}`]
                ]}
              />
            )
          }}
        </RLGPanel>

        <RLGPanel
          data-layout={{
            name: 'square(percent, preserve)',
            position: {
              location: { x: 30, y: 20, unit: Unit.percent },
              size: { width: 30, height: 30, unit: Unit.preserve }
            }
          }}

          style={{ backgroundColor: 'LightSkyBlue' }}
        >
          {(args: IRLGMetaDataArgs) => (
            <>
            <span>Square (percent, preserve) </span> <br/><br/><br/>
            <span>Use Alt-click to change grids when editing</span>
            </>
          )}
        </RLGPanel>

        <RLGPanel
          data-layout={{
            name: 'square(preserve, preserve)',
            position: {
              location: { x: 60, y: 60, unit: Unit.preserve },
              size: { width: 20, height: 20, unit: Unit.preserve  }
            }
          }}

          style={{ backgroundColor: 'lime' }}
        >
          {(args: IRLGMetaDataArgs) => (
            <span>Square (preserve, preserve) </span>
          )}

        </RLGPanel>

        <RLGPanel
          data-layout={{
            name: 'square(percent, percent)',
            position: {
              location: { x: 50, y: 50, unit: Unit.percent  },
              size: { width: 20, height: 20, unit: Unit.percent }
            }
          }}

          style={{ backgroundColor: 'gold' }}
        >
          {(args: IRLGMetaDataArgs) => (
            <>
            <span>Square (percent, percent) </span> <br/><br/><br/>
            <span>Click the edit button to edit. </span> <br/>
            </>

          )}
        </RLGPanel>

        <div
          data-layout={{
            name: 'callout',
            position: {
              location: { x: 40, y: 40, unit: Unit.percent },
              size: { width: 100, height: 80, unit: Unit.unmanagedHeight },
              align: {
                key: 'square(percent, percent)',
                offset: { x: 20, y: 10 },
                source: { x: 100, y: 100 },
                self: { x: 0, y: 0 }
              }
            }
          }}

          style={{ backgroundColor: 'yellow' }}
        >
          <Description>
            Drag Me
          </Description>
        </div>

        {this.controls()}
        {this.gridLegend()}

      </RLGLayout>
    );
  }

  protected gridLegend = () => {

    return (
      <div
        data-layout={{
          name: 'Legend',
          position: {
            location: { x: 5, y: 20, unit: Unit.preserve },
            size: { width: 100, height: 80, unit: Unit.unmanaged},
          }
        }}
      >
        <span>{`Grid unit ${this._units}`}</span> <br />
        <span>{`width: ${this._gridUnitSquare.x.toFixed(2)}px`}</span> <br />
        <span>{`height: ${this._gridUnitSquare.y.toFixed(2)}px`}</span> <br />
      </div>
    );
  }

  protected controls = () => {
    const style = {
      fontSize: '1rem',
      background: 'white',
      color: 'gray'
    }
    const selectedStyle = {
      fontSize: '1rem',
      background: 'white',
      color: 'black'
    }

    return (
      <>
        <Button
          name='Pixel'
          key={'Pixel'}
          data-layout={{
            name: 'Pixel',
            position: {
              location: { x: 5, y: 5, unit: Unit.preserve },
              size: { width: 90, height: 24 }
            }
          }}
          style={this._gridUnit === Unit.pixel ? selectedStyle : style}
          onClick={this.setPixel}
        />
        <Button
          name={'Percent'}
          key={'Percent'}
          data-layout={{
            name: 'Percent',
            position: {
              location: { x: 5, y: 10, unit: Unit.preserve },
              size: { width: 90, height: 24 }
            }
          }}
          style={this._gridUnit === Unit.percent ? selectedStyle : style}
          onClick={this.setPercent}
        />
        <Button
          name={'Preserve'}
          key={'Preserve'}
          data-layout={{
            name: 'Preserve',
            position: {
              location: { x: 5, y: 15, unit: Unit.preserve },
              size: { width: 90, height: 24 }
            }
          }}
          style={this._gridUnit === Unit.preserve ? selectedStyle : style}
          onClick={this.setPreserve}
        />
      </>
    )
  }

  protected control(selected: boolean, props: any) {
    const CtrlButton = styled(Button)`
      font-size: 1rem;
      background: white;
      color: lightgray;
    `
    const CtrlSelectedButton = styled(Button)`
      font-size: 1rem;
      background: 'white';
      color: black;
    `
    if (selected) {
      return <CtrlSelectedButton {...props} />
    } else {
      return <CtrlButton {...props} />
    }
  }

  protected grid = (unit: Unit) => {
    const containersize = this._g.params().get('containersize') as ISize;

    const w = Math.round(containersize.width);
    const h = Math.round(containersize.height);

    const lineWidth = 1;

    let unitStep = { x: 1, y: 1 };

    if (this._grid) {
      const ctx = this._grid.getContext("2d")

      if (ctx) {
        this.clearCanvas(ctx, this._grid);

        // setup axis divisions
        switch (unit) {
          case Unit.pixel: {
            this._units = '10px'
            unitStep = toPixel(
              {
                unit: Unit.pixel,
                value: { x: 10, y: 10 }
              },
              { width: w, height: h }) as IPoint;
            break;
          }
          case Unit.percent: {
            this._units = '1%'
            unitStep = toPixel(
              {
                unit: Unit.percent,
                value: { x: 1, y: 1 }
              },
              { width: w, height: h }) as IPoint;
            break;
          }

          case Unit.preserve: {
            this._units = '1%'
            unitStep = toPixel(
              {
                unit: Unit.preserve,
                value: { x: 1, y: 1 }
              },
              { width: w, height: h }) as IPoint;
            break;
          }
          case Unit.preserveHeight: {
            this._units = '1%'
            unitStep = toPixel(
              {
                unit: Unit.preserveHeight,
                value: { x: 1, y: 1 }
              },
              { width: w, height: h }) as IPoint;
            break;
          }
          case Unit.preserveWidth: {
            this._units = '1%'
            unitStep = toPixel(
              {
                unit: Unit.preserveWidth,
                value: { x: 1, y: 1 }
              },
              { width: w, height: h }) as IPoint;
            break;
          }
        }

        this._gridUnitSquare = unitStep;

        // Horizontal lines
        let index = -1;
        for (let j = 0; j < h; j += unitStep.y) {
          index += 1;
          let background = (index % 5 === 0) ? 'hsl(210,100%,75%)' : 'hsl(210,100%,90%)';
          background = (index % 10 === 0) ? 'hsl(210,100%,60%)' : background;
          ctx.strokeStyle = background;
          ctx.lineWidth = lineWidth;
          ctx.beginPath();
          ctx.moveTo(0, j);
          ctx.lineTo(w, j);
          ctx.stroke();
        }

        // Vertical lines
        index = -1;
        for (let i = 0; i < w; i += unitStep.x) {
          index += 1;
          let background = (index % 5 === 0) ? 'hsl(210,100%,75%)' : 'hsl(210,100%,90%)';
          background = (index % 10 === 0) ? 'hsl(210,100%,60%)' : background;
          ctx.strokeStyle = background;
          ctx.lineWidth = lineWidth;
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i, h);
          ctx.stroke();
        }
      }
    }
  }

  private clearCanvas(context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    const w = canvas.width;
    canvas.width = 1;
    canvas.width = w;
  }

  private setGrid = (args: IRLGMetaDataArgs, element: HTMLCanvasElement) => {

    if (this._grid !== element && element) {
      this._grid = element;
      this.grid(Unit.pixel)
      this.setState({ update: this.state.update + 1 });
    }
  }
}

