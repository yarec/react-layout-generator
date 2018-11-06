import {Layouts, ILayout} from '../LayoutGenerator';
import { Rect } from '../types';

it('Layouts index returns the correct key value #1', () => {
  const t: ILayout = {
    name: 'a',
    location: new Rect({left: 0, top: 0, right: 0, bottom: 0})
  }
  const l = new Layouts([['a', t]])
  expect(l.find(0)).toBe(t);
});

it('Layouts index returns the correct key value #2', () => {
  const t1: ILayout = {
    name: 'a',
    location: new Rect({left: 0, top: 0, right: 0, bottom: 0})
  }
  const l = new Layouts([['a', t1]]);
  const t2: ILayout = {
    name: 'b',
    location: new Rect({left: 0, top: 0, right: 0, bottom: 0})
  }

  l.set('b', t2);

  expect(l.find(1)).toBe(t2);
});