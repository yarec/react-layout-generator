// import LayoutGenerator, { LayoutGeneratorProps }
//   from './LayoutGenerator';

// it('returns undefined with no layouts', () => {
//   const props: LayoutGeneratorProps = {
//     origin: {x: 0, y: 0},
//     scale: {x: 0, y: 0},
//     layouts: []
//   };
//   const g = new LayoutGenerator(props);
//   expect(g.next()).toBe(undefined);
// });

// it('returns rect with one layout', () => {
//   const layout = {
//     name: '',
//     location: { x: 0, y: 0 },
//     rows: 1,
//     cols: 1,
//     blockSize: {x: 100, y: 100},
//     blockMargin:  { top: 0, left: 0, bottom: 0, right: 0 }
//   };
//   const props: LayoutGeneratorProps = {
//     origin: {x: 0, y: 0},
//     scale: {x: 0, y: 0},
//     layouts: [layout]
//   };
//   const g = new LayoutGenerator(props);
//   expect(g.next()).toMatchObject({ top: 0, left: 0, bottom: 100, right: 100 });
//   expect(g.next()).toBe(undefined);
// });

// it('returns rect with two layouts', () => {
//   const layout = {
//     name: '',
//     location: { x: 0, y: 0 },
//     rows: 1,
//     cols: 2,
//     blockSize: {x: 100, y: 100},
//     blockMargin:  { top: 0, left: 0, bottom: 0, right: 0 }
//   };
//   const props: LayoutGeneratorProps = {
//     origin: {x: 0, y: 0},
//     scale: {x: 0, y: 0},
//     layouts: [layout]
//   };
//   const g = new LayoutGenerator(props);
//   expect(g.next()).toMatchObject({ top: 0, left: 0, bottom: 100, right: 100 });
//   expect(g.next()).toMatchObject({ top: 0, left: 100, bottom: 100, right: 200 });
//   expect(g.next()).toBe(undefined);
// });

// it('returns rect with two layouts', () => {
//   const layout = {
//     name: '',
//     location: { x: 0, y: 0 },
//     rows: 2,
//     cols: 2,
//     blockSize: {x: 100, y: 100},
//     blockMargin:  { top: 0, left: 0, bottom: 0, right: 0 }
//   };
//   const props: LayoutGeneratorProps = {
//     origin: {x: 0, y: 0},
//     scale: {x: 0, y: 0},
//     layouts: [layout]
//   };
//   const g = new LayoutGenerator(props);
//   expect(g.next()).toMatchObject({ top: 0, left: 0, bottom: 100, right: 100 });
//   expect(g.next()).toMatchObject({ top: 0, left: 100, bottom: 100, right: 200 });
//   expect(g.next()).toMatchObject({ top: 100, left: 0, bottom: 200, right: 100 });
//   expect(g.next()).toMatchObject({ top: 100, left: 100, bottom: 200, right: 200 });
//   expect(g.next()).toBe(undefined);
// });
