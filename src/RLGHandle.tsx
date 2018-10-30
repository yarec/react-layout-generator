import * as React from 'react';

import { computePosition, ILayout, IEdit, PositionRef, Params, Value } from './LayoutGenerator';
import { IPoint, IPosition, IRect } from './types';
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
  quadTree?: RLGQuadTree;
  boundary: IRect;
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

  pin(v: Value, ref: PositionRef, item: IBounds): Value {
    let r: Value = v;

    const deltaLeft = item.x - this.props.boundary.left;
    const deltaRight = this.props.boundary.right - item.right;
    const deltaTop = item.y - this.props.boundary.top;
    const deltaBottom = this.props.boundary.bottom - item.bottom;

    console.log(`pin layout Location: ${this.props.layout.location.left}, ${this.props.layout.location.top}, ${this.props.layout.location.right}, ${this.props.layout.location.bottom} `)

    console.log(`pin deltaLeft: ${deltaLeft}, deltaRight: ${deltaRight}, deltaTop: ${deltaTop}, deltaBottom: ${deltaBottom}`);

    switch (ref) {
      case PositionRef.rect: {
        const vr = v as IRect;
        let left = vr.left;
        let top = vr.top;
        let right = vr.right;
        let bottom = vr.bottom;
        
        if (vr.left < this.props.boundary.left) {
         left = this.props.boundary.left;
         right = left + item.width;
        }
        if (vr.right > this.props.boundary.right) {
          right = this.props.boundary.right;
          left = right - item.width;
        }
        if (vr.top < this.props.boundary.top) {
          top = this.props.boundary.top;
          bottom = top + item.height;
        }
        if (vr.bottom > this.props.boundary.bottom) {
          bottom = this.props.boundary.bottom;
          top = bottom - item.height;
        }
        r = {
         left: left,
         top: top,
         right: right,
         bottom: bottom
        }
        break;
      }
      case PositionRef.position: {
        const vr = v as IPosition;
        const width = this.props.rlgDrag.width;
        const height = this.props.rlgDrag.height;
        r = {
          location: {
            // In percent
            x: (vr.location.x * width - (deltaLeft + deltaRight)) / width,
            y: (vr.location.y * height - (deltaTop + deltaBottom)) / height
          },
          size: vr.size
        }
        break;
      }
      case PositionRef.scalar_height_top: {
        const vr = v as number;
        if (vr - item.height - deltaTop > 0) {
          r = item.height + deltaTop;
        }
        break;
      }
      case PositionRef.scalar_height_bottom: {
        const vr = v as number;
        if (vr - item.height - deltaBottom > 0) {
          r = item.height + deltaBottom;
        }
        break;
      }
      case PositionRef.scalar_width_left: {
        const vr = v as number;
        if (vr - item.width - deltaLeft > 0) {
          r = item.width + deltaLeft;
        }
        break;
      }
      case PositionRef.scalar_width_right: {
        const vr = v as number;
        r = vr;
        if (vr - item.width - deltaRight > 0) {
          r = item.width + deltaRight;
        }
        break;
      }
      case PositionRef.position_height_top: {

        break;
      }
      case PositionRef.position_height_bottom: {
        
        break;
      }
      case PositionRef.position_width_left: {
        
        break;
      }
      case PositionRef.position_width_right: {
        
        break;
      }
      case PositionRef.rect_point_left_top: {
        const vr = v as IRect;
        r = {
          left: vr.left - (deltaLeft + deltaRight),
          top: vr.top - (deltaTop + deltaBottom),
          right: vr.right,
          bottom: vr.bottom
        }
        break;
      }
      case PositionRef.rect_point_right_top: {
        const vr = v as IRect;
        r = {
          left: vr.left,
          top: vr.top - (deltaTop + deltaBottom),
          right: vr.right - (deltaLeft + deltaRight),
          bottom: vr.bottom
        }
        break;
      }
      case PositionRef.rect_point_left_bottom: {
        const vr = v as IRect;
        r = {
          left: vr.left - (deltaLeft + deltaRight),
          top: vr.top,
          right: vr.right,
          bottom: vr.bottom - (deltaTop + deltaBottom)
        }
        break;
      }
      case PositionRef.rect_point_right_bottom: {
        const vr = v as IRect;
        r = {
          left: vr.left,
          top: vr.top,
          right: vr.right - (deltaLeft + deltaRight),
          bottom: vr.bottom - (deltaTop + deltaBottom)
        }
        break;
      }
      case PositionRef.position_point_left_top: {
        const vr = v as IPosition;
        r = {
          location: {
            // In percent
            x: vr.location.x  - (deltaLeft + deltaRight),
            y: vr.location.y - (deltaTop + deltaBottom),
          },
          size: {
            x: vr.size.x,
            y: vr.size.y
          }
        }
        break;
      }
      case PositionRef.rect_point_right_top: {
        const vr = v as IRect;
        r = {
          left: vr.left,
          top: vr.top - (deltaTop + deltaBottom),
          right: vr.right - (deltaLeft + deltaRight),
          bottom: vr.bottom
        }
        break;
      }
      case PositionRef.rect_point_left_bottom: {
        const vr = v as IRect;
        r = {
          left: vr.left - (deltaLeft + deltaRight),
          top: vr.top,
          right: vr.right,
          bottom: vr.bottom - (deltaTop + deltaBottom)
        }
        break;
      }
      case PositionRef.rect_point_right_bottom: {
        const vr = v as IRect;
        r = {
          left: vr.left,
          top: vr.top,
          right: vr.right - (deltaLeft + deltaRight),
          bottom: vr.bottom - (deltaTop + deltaBottom)
        }
        break;
      }
      default: {
        console.error(`pin refPosition: unexpected value`, ref);
        break;
      }
    }
    return r;
  }

  extent(v: Value, ref: PositionRef): IBounds {
    let left = this.props.layout.location.left;
    let top = this.props.layout.location.top;
    let right = this.props.layout.location.right;
    let bottom = this.props.layout.location.bottom;
    switch (ref) {
      case PositionRef.rect: {
        const vr = v as IRect;
        left = vr.left;
        top = vr.top;
        right = vr.right;
        bottom = vr.bottom;
        break;
      }
      case PositionRef.position: {
        const vr = v as IPosition;
        const r = computePosition(vr, this.props.rlgDrag.width, this.props.rlgDrag.height);
        left = r.left;
        top = r.top;
        right = r.right;
        bottom = r.bottom;
        break;
      }
      case PositionRef.scalar_height_top: {
        top = this.origin.y - (v as number);
        break;
      }
      case PositionRef.scalar_height_bottom: {
        bottom += (v as number)
        break;
      }
      case PositionRef.scalar_width_left: {
        left = this.origin.y - (v as number);
        break;
      }
      case PositionRef.scalar_width_right: {
        right += (v as number);
        break;
      }
      case PositionRef.rect_point_left_top: 
      case PositionRef.rect_point_right_top:
      case PositionRef.rect_point_left_bottom: 
      case PositionRef.rect_point_right_bottom: {
        const vr = v as IRect;
        left = vr.left;
        top = vr.top;
        right = vr.right;
        bottom = vr.bottom;
        break;
      }
      default: {
        console.error(`extent refPosition: Illegal value`, ref);
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
    const r = this.extent(v, this.props.edit.positionRef);
    console.log('moveUpdate', r);
    if (r.x >= this.props.boundary.left &&
      r.right <= this.props.boundary.right &&
      r.y >= this.props.boundary.top &&
      r.bottom <= this.props.boundary.bottom
    ) {
      this.props.params.set(this.props.edit.variable, v, this.props.layout);
      this.props.onUpdate();
    } else {
      const uv = this.pin(v, this.props.edit.positionRef, r);
      this.props.params.set(this.props.edit.variable, uv, this.props.layout);
      console.log('moveUpdate pin: ', uv);
    }
  }

  onMouseDown = (event: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
      this.addEventListeners();
      this.initUpdate(event.clientX, event.clientY);
      console.log('onMouseDown', event.clientX, event.clientY);
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