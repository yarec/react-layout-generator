import Values, { RightWidth } from '../generators/Value';
import BasicLayoutGenerator, { Params, Layouts, ILayoutGenerator, ILayout } from '../LayoutGenerator';

function init(params: Params, layouts?: Layouts): Layouts {
  if (!layouts) {
    return new Layouts([]);
  }
  return layouts;
}

function create(index: number, name: string, g: ILayoutGenerator, position: IPosition): ILayout {
  const p = new Position(position, g)

  const box: ILayout = {
    name: name,
    location: new Rect(p.rect())
  }

  const layouts = g.layouts();
  const params = g.params();
  if (layouts) {
    layouts.set(box.name, box);
  }
  params.set(name, p);
  return box;
}

const g: ILayoutGenerator = new BasicLayoutGenerator(name, init, params, create);

it('RightWidth #1', () => {
  const ref = new RightWidth({
    width: 200
  });

  expect(ref.rect({left: 100, top: 100, right: 200, bottom: 200}, g)).toEqual({x: 0, y: 10});
});

