import {rectToPosition, positionToRect} from '../utils';
import { IOrigin, IUnit } from '../types';

it('rectToPosition is the inverse of positionToRect #1', () => {
  const r = {
    left: 100,
    top: 100,
    right: 200,
    bottom: 200
  }

  const units = {
    origin: IOrigin.center,
    location: IUnit.percent,
    size: IUnit.pixel
  }

  const p = rectToPosition(r, 500, 500, units);
  const ir = positionToRect(p, 500, 500);
  expect(ir).toEqual(r);
});

it('rectToPosition is the inverse of positionToRect #2', () => {
  const r = {
    left: 100,
    top: 100,
    right: 200,
    bottom: 200
  }

  const units = {
    origin: IOrigin.leftTop,
    location: IUnit.percent,
    size: IUnit.pixel
  }

  const p = rectToPosition(r, 500, 500, units);
  const ir = positionToRect(p, 500, 500);
  expect(ir).toEqual(r);
});

it('rectToPosition is the inverse of positionToRect #3', () => {
  const r = {
    left: 100,
    top: 100,
    right: 200,
    bottom: 200
  }

  const units = {
    origin: IOrigin.leftTop,
    location: IUnit.pixel,
    size: IUnit.pixel
  }

  const p = rectToPosition(r, 500, 500, units);
  const ir = positionToRect(p, 500, 500);
  expect(ir).toEqual(r);
});

it('rectToPosition is the inverse of positionToRect #4', () => {
  const r = {
    left: 100,
    top: 100,
    right: 200,
    bottom: 200
  }

  const units = {
    origin: IOrigin.leftTop,
    location: IUnit.percent,
    size: IUnit.pixel
  }

  const p = rectToPosition(r, 500, 500, units);
  const ir = positionToRect(p, 500, 500);
  expect(ir).toEqual(r);
});

it('rectToPosition is the inverse of positionToRect #5', () => {
  const r = {
    left: 100,
    top: 100,
    right: 200,
    bottom: 200
  }

  const units = {
    origin: IOrigin.leftTop,
    location: IUnit.percent,
    size: IUnit.percent
  }

  const p = rectToPosition(r, 500, 500, units);
  const ir = positionToRect(p, 500, 500);
  expect(ir).toEqual(r);
});

it('rectToPosition is the inverse of positionToRect #6', () => {
  const r = {
    left: 100,
    top: 100,
    right: 200,
    bottom: 200
  }

  const units = {
    origin: IOrigin.center,
    location: IUnit.percent,
    size: IUnit.percent
  }

  const p = rectToPosition(r, 500, 500, units);
  const ir = positionToRect(p, 500, 500);
  expect(ir).toEqual(r);
});