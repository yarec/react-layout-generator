import { Rect } from '../types';

it('size value is a copy', () => {
  const r = new Rect({ x: 0, y: 0, width: 0, height: 0 });
  let s = r.size;
  s.width = 1;
  expect(r.size).toEqual({ width: 0, height: 0 });
});

it('location value is a copy', () => {
  const r = new Rect({ x: 0, y: 0, width: 0, height: 0 });
  let l = r.location;
  l.x = 1;
  expect(r.location).toEqual({ x: 0, y: 0 });
});

it('set location updates correctly', () => {
  const r = new Rect({ x: 0, y: 0, width: 0, height: 0 });
  r.location = {x: 1, y: 0};
  expect(r.location).toEqual({ x: 1, y: 0 });
});

it('set size updates correctly', () => {
  const r = new Rect({ x: 0, y: 0, width: 0, height: 0 });
  r.size = {width: 1, height: 0};
  expect(r.size).toEqual({ width: 1, height: 0 });
});

it('set size updates half size correctly', () => {
  const r = new Rect({ x: 0, y: 0, width: 0, height: 0 });
  r.size = {width: 2, height: 0};
  expect(r.halfWidth).toEqual(1);
});





