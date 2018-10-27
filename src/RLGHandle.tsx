import * as React from 'react';

import { /* computePosition, */ ILayout, IEdit,  PositionRef, Params, Value } from './LayoutGenerator';
import { IPoint, IPosition } from './types';
import RLGQuadTree, { IBounds } from './RLGQuadTree';
// import { IRect } from 'lib/src/types';

interface editStyleProps {
  cursor: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

function editStyle(props: editStyleProps): React.CSSProperties {
  //  console.log('editStyle', props.x, props.y, props.width, props.height);

  // console.log(style);
  return {
    boxSizing: 'border-box' as 'border-box',
    transformOrigin: 0,
    transform: `translate(${props.x}px, ${props.y}px)`,
    width: `${props.width}px`,
    height: `${props.height}px`,
    position: 'absolute' as 'absolute',
    cursor: props.cursor,
    background: 'rgba(0, 0, 0, 0.0)',
    zIndex: 1000,
    borderWidth: '4px'
  }
}

export interface RLGHandleProps extends React.HTMLProps<HTMLDivElement> {
  rlgDrag: editStyleProps;
  params: Params;
  edit: IEdit;
  layout: ILayout;
  quadTree: RLGQuadTree;
  onUpdate: () => void
}

interface RLGHandleState {

}

export default class RLGHandle extends React.Component<RLGHandleProps, RLGHandleState> {

  value: Value | undefined;
  origin: IPoint;

  constructor(props: RLGHandleProps) {
    super(props);
    this.state = {

    }
    // console.log('RLGHandleProps', this.props);
  }

  addEventListeners() {
    document.addEventListener('mouseup', this.onHtmlMouseUp);
    document.addEventListener('mousemove', this.onHtmlMouseMove);
    document.addEventListener('touchmove', this.onHtmlTouchMove);
  }

  removeEventListeners() {
    document.removeEventListener('mouseup', this.onHtmlMouseUp);
    document.removeEventListener('mousemove', this.onHtmlMouseMove);
    document.removeEventListener('touchmove', this.onHtmlTouchMove);
  }

  initUpdate(x: number, y: number) {
    this.origin = { x, y };
    this.value = this.props.params.get(this.props.edit.variable);
  }

  getExtent(v: Value, ref: PositionRef): IBounds {
    let left = this.props.layout.location.left;
    let top = this.props.layout.location.top;
    let right = this.props.layout.location.right;
    let bottom = this.props.layout.location.bottom;
    switch (ref) {
      case PositionRef.rect: {
        const vr = v as IPosition;
        left = vr.position.x;
        top = vr.position.y;
        right = vr.size.x;
        bottom = vr.size.y;
        break;
      }
      case PositionRef.height_top: {
        top = this.origin.y - (v as number);
        break;
      }
      case PositionRef.height_bottom: {
        bottom += (v as number)
        break;
      }
      case PositionRef.width_left: {
        left = this.origin.y - (v as number);
        break;
      }
      case PositionRef.width_right: {
        right += (v as number);
        break;
      }
      case PositionRef.point_left_top: {
        const p = v as IPoint;
        left = p.x;
        top = p.y;
        break;
      }
      case PositionRef.point_right_top: {
        const p = v as IPoint;
        right = p.x;
        top = p.y;
        break;
      }
      case PositionRef.point_left_bottom: {
        const p = v as IPoint;
        left = p.x;
        bottom = p.y;
        break;
      }
      case PositionRef.point_right_bottom: {
        const p = v as IPoint;
        right = p.x;
        bottom = p.y;
        break;
      }
      default: {
        console.error(`refPosition: Illegal value`, ref);
        break;
      }
    }

    const h = bottom - top;
    const w = right - left;

    return {
      x: left,
      y: top,
      width: w,
      height: h,
      subWidth: w / 2,
      subHeight: h / 2,
      right: right,
      bottom: bottom
    }
  }

  moveUpdate(x: number, y: number) {

    let value;
    if (typeof this.value === 'number') {
      value = this.value;
    } else {
      // Clone value
      value = Object.assign({}, this.value);
    }

    const v = this.props.edit.update(value, this.props.edit.positionRef, (x - this.origin.x), (y - this.origin.y), this.props.params);
    // console.log('this.props.edit.variable ' + this.props.edit.variable, v);
    // const r = this.getExtent(v, this.props.edit.positionRef);
    // if (this.props.quadTree.getIndex(r) != -1) {
      this.props.params.set(this.props.edit.variable, v);
    // }

    this.props.onUpdate();
  }

  onMouseDown = (event: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
      this.addEventListeners();
      this.initUpdate(event.clientX, event.clientY);
      // console.log('onMouseDown', event.clientX, event.clientY);
    }
  }

  onHtmlMouseMove = (event: MouseEvent) => {
    if (event) {
      event.preventDefault();
      this.moveUpdate(event.clientX, event.clientY);
      // console.log('onMouseMove', event.clientX, event.clientY);
    }
  }

  onHtmlMouseUp = (event: MouseEvent) => {
    if (event) {
      event.preventDefault();
      this.removeEventListeners();
      // console.log('onMouseUp', event.clientX, event.clientY);
    }
  }

  onHtmlTouchMove = (event: TouchEvent) => {
    // TODO implement support for touch
  }

  render = () => {
    // console.log('RLGHandleProps', this.props.rlgDrag);
    return (
      <div style={editStyle(this.props.rlgDrag)}
        onMouseDown={this.onMouseDown}
      />
    );
  }
}