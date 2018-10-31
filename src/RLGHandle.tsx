import * as React from 'react';

import { ILayout, IEdit, PositionRef, Params, Value } from './LayoutGenerator';
import { IPoint, IPosition, IRect, width, height } from './types';
import {positionToRect, rectToPosition} from './utils';

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
    // does not seem to help
    // switch (this.props.edit.positionRef) {
    //   case PositionRef.position: {
    //     this.origin = {
    //       x: x + width(this.props.layout.location) / 2,
    //       y: y + height(this.props.layout.location) / 2,
    //     }
    //   }
    // }
    this.value = this.props.params.get(this.props.edit.variable);
  }

  pin(v: Value, ref: PositionRef, item: IRect): Value {
    let r: Value = v;

    const deltaLeft = item.left - this.props.boundary.left;
    const deltaRight = this.props.boundary.right - item.right;
    const deltaTop = item.top - this.props.boundary.top;
    const deltaBottom = this.props.boundary.bottom - item.bottom;

    // console.log(`pin layout Location: ${this.props.layout.location.left}, ${this.props.layout.location.top}, ${this.props.layout.location.right}, ${this.props.layout.location.bottom} `)

    // console.log(`pin deltaLeft: ${deltaLeft}, deltaRight: ${deltaRight}, deltaTop: ${deltaTop}, deltaBottom: ${deltaBottom}`);

    switch (ref) {
      case PositionRef.rect: {
        const vr = v as IRect;
        let left = vr.left;
        let top = vr.top;
        let right = vr.right;
        let bottom = vr.bottom;

        if (vr.left < this.props.boundary.left) {
          left = this.props.boundary.left;
          right = left + width(item);
        }
        if (vr.right > this.props.boundary.right) {
          right = this.props.boundary.right;
          left = right - width(item);
        }
        if (vr.top < this.props.boundary.top) {
          top = this.props.boundary.top;
          bottom = top + height(item);
        }
        if (vr.bottom > this.props.boundary.bottom) {
          bottom = this.props.boundary.bottom;
          top = bottom - height(item);
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
        // IPosition location is center as percent and size is in pixels
        const vr = v as IPosition;
        // console.log('pin position init', vr)
        const boundaryWidth = width(this.props.boundary);
        const boundaryHeight = height(this.props.boundary);



        const a = positionToRect(vr, boundaryWidth, boundaryHeight);
        // console.log('pin position rect', a)
        let left = a.left
        let top = a.top;
        let right = a.right;
        let bottom = a.bottom;

        if (left < this.props.boundary.left ) {
          left = this.props.boundary.left;
          right = left + width(item);
        }
        if (right > this.props.boundary.right) {
          right = this.props.boundary.right;
          left = right - width(item);
        }
        if (top < this.props.boundary.top) {
          top = this.props.boundary.top;
          bottom = top + height(item);
        }
        if (bottom > this.props.boundary.bottom) {
          bottom = this.props.boundary.bottom;
          top = bottom - height(item);
        }
        r = rectToPosition({ top: top, left: left, bottom: bottom, right: right }, boundaryWidth, boundaryHeight);
        // console.log('pin position: ', r);
        break;
      }
      case PositionRef.scalar_height_top: {
        const vr = v as number;
        if (vr - height(item) - deltaTop > 0) {
          r = height(item) + deltaTop;
        }
        break;
      }
      case PositionRef.scalar_height_bottom: {
        const vr = v as number;
        if (vr - height(item) - deltaBottom > 0) {
          r = height(item) + deltaBottom;
        }
        break;
      }
      case PositionRef.scalar_width_left: {
        const vr = v as number;
        if (vr - width(item) - deltaLeft > 0) {
          r = width(item) + deltaLeft;
        }
        break;
      }
      case PositionRef.scalar_width_right: {
        const vr = v as number;
        r = vr;
        if (vr - width(item) - deltaRight > 0) {
          r = width(item) + deltaRight;
        }
        break;
      }
      case PositionRef.rect_height_top: {
        console.log('TODO pin PositionRef.rect_height_top');
        break;
      }
      case PositionRef.rect_height_bottom: {
        console.log('TODO pin PositionRef.rect_height_bottom');
        break;
      }
      case PositionRef.rect_width_left: {
        console.log('TODO pin PositionRef.rect_width_left');
        break;
      }
      case PositionRef.rect_width_right: {
        console.log('TODO pin PositionRef.rect_width_left');
        break;
      }
      case PositionRef.position_height_top: {
        // IPosition location is center as percent and size is in pixels
        console.log('TODO pin PositionRef.position_height_top');
        break;
      }
      case PositionRef.position_height_bottom: {
        // IPosition location is center as percent and size is in pixels  
        console.log('TODO pin PositionRef.position_height_bottom');
        break;
      }
      case PositionRef.position_width_left: {
        // IPosition location is center as percent and size is in pixels  
        console.log('TODO pin PositionRef.position_width_left');
        break;
      }
      case PositionRef.position_width_right: {
        // IPosition location is center as percent and size is in pixels  
        console.log('TODO pin PositionRef.position_width_right');
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
        // IPosition location is center as percent and size is in pixels
        const vr = v as IPosition;
        r = {
          location: {
            // In percent
            x: vr.location.x - (deltaLeft + deltaRight),
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

  extend(v: Value, ref: PositionRef): IRect {
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
        // IPosition location is center as percent and size is in pixels
        const vr = v as IPosition;
        const r = positionToRect(vr, width(this.props.boundary), height(this.props.boundary));
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
      case PositionRef.rect_height_top: {
        right += (v as number);
        break;
      }
      case PositionRef.rect_height_bottom: {
        right += (v as number);
        break;
      }
      case PositionRef.rect_width_left: {
        right += (v as number);
        break;
      }
      case PositionRef.rect_width_right: {
        right += (v as number);
        break;
      }
      case PositionRef.position_height_top: {
        right += (v as number);
        break;
      }
      case PositionRef.position_height_bottom: {
        right += (v as number);
        break;
      }
      case PositionRef.position_width_left: {
        right += (v as number);
        break;
      }
      case PositionRef.position_width_right: {
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

    return {
      left: left,
      top: top,
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
    const r = this.extend(v, this.props.edit.positionRef);
    // console.log('moveUpdate extend', r);
    // if (r.left >= this.props.boundary.left &&
    //   r.right <= this.props.boundary.right &&
    //   r.top >= this.props.boundary.top &&
    //   r.bottom <= this.props.boundary.bottom
    // ) {
    //   this.props.params.set(this.props.edit.variable, v, this.props.layout);
    //   this.props.onUpdate();
    // } else {
    const uv = this.pin(v, this.props.edit.positionRef, r);
    this.props.params.set(this.props.edit.variable, uv, this.props.layout);
    this.props.onUpdate();
    // console.log('moveUpdate pin: ', uv);
    //}
  }

  onMouseDown = (event: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
      this.addEventListeners();
      this.initUpdate(event.clientX, event.clientY);
      // console.log('onMouseDown', event.clientX, event.clientY);
      // console.log('onMouseDown', this.props )
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