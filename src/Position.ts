import { IPosition, IPoint, IRect } from './types';
import { ILayoutGenerator } from './LayoutGenerator';

export enum IAlign {
  topLeft = 1,
  topCenter,
  topRight,
  rightTop,
  rightCenter,
  rightBottom,
  bottomRight,
  bottomCenter,
  bottomLeft,
  leftBottom,
  leftCenter,
  leftTop
}

export enum IUnit {
  pixel = 1,
  percent
}

export enum IOrigin {
  leftTop = 1,
  center
}

export interface IPosition {
  units: {
    origin: IOrigin,
    location: IUnit,
    size: IUnit
  }
  align?: {
    key: string,
    offset: IPoint,
    source: IAlign,
    self: IAlign
  }
  location: IPoint; // in percent
  size: IPoint; // in absolute
}

export default class Position implements IPosition {
  units: {
    origin: IOrigin,
    location: IUnit,
    size: IUnit
  }
  align?: {
    key: string,
    offset: IPoint,
    source: IAlign,
    self: IAlign
  }
  location: IPoint; // in percent
  size: IPoint; // in absolute

  g: ILayoutGenerator;

  constructor(p: IPosition, g: ILayoutGenerator) {
    this.units = p.units;
    this.align = p.align;
    this.location = p.location;
    this.size = p.size;
  }

  rect = () => {
    const width = this.g.params().get('width') as number;
    const height = this.g.params().get('height') as number;

    let top = this.location.y;
    let left = this.location.x;

    let sizeWidth = this.size.x;
    let sizeHeight = this.size.y;

    if (this.units.size === IUnit.percent) {
      sizeHeight = this.size.y * height / 100;
      sizeWidth = this.size.x * width / 100;
    }

    if (this.units.location === IUnit.percent) {
      top = this.location.y * height / 100
      left = this.location.x * width / 100;
    }

    if (this.units.origin === IOrigin.center) {
      top -= sizeHeight / 2;
      left -= sizeWidth / 2;
    }

    return {
      top: top,
      left: left,
      bottom: top + sizeHeight,
      right: left + sizeWidth
    }
  }

  update = (r: IRect) => {
    const width = this.g.params().get('width') as number;
    const height = this.g.params().get('height') as number;

    let xo = r.left;
    let yo = r.top;
    if (this.units.origin === IOrigin.center) {
      xo += (r.right - r.left) / 2;
      yo += (r.bottom - r.top) / 2;
    }
  
    if(this.units.location === IUnit.percent) {
      xo = xo / width * 100;
      yo = yo / height * 100;
    }
  
    let xs = r.right - r.left;
    let ys = r.bottom - r.top;
    if(this.units.size === IUnit.percent) {
      xs = xs / width * 100;
      ys = ys / height * 100;
    }

    this.location = {
      x: xo,
      y: yo
    },
    this.size = {
      x: xs,
      y: ys
    }
  }
}