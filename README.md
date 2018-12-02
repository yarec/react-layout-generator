# React Layout Generator

*This document is a work in progress. In the meantime see the source code for details.*

React Layout Generator (RLG) is a [Layout in React](https://github.com/chetmurphy/react-layout-generator/blob/master/LayoutInRect.md) component for dynamic and responsive layout. It is ideal for laying out both html and svg components and allows precise and continuous control for responsive layouts.

This component was inspired by [react-grid-layout](https://www.npmjs.com/package/react-grid-layout).

## Install

For the time being, you will need to clone or fork the project to evaluate.

## TODO

* Update intro to use both RLGRow and RLGColumn
* Finish implementing editor
* Add left and right align to RLGColumn
* Implement RLGRow
* Touch
* Serialization - should be possible now by saving/restoring params and layouts
* Breakpoints
* Additional generators
* More tests
* Upload component to npm
* Host website on Github
* Alpha version - current release is early pre-alpha

### Bugs

* Cleanup initialization of generators and viewport to potentially allow generators to be reused. See 1) ReactLayout initLayout which is called at the beginning of each render and 2) Generator which calls the user supplied init function during the initLayout call.
* Fix flickering when making the browser window smaller for elements in RLGColumns. This appears to be due to an update issue causing the computed element size to include the scroll bar since the initial layout is being used with the newer smaller element.

## Features

* Lightweight - uses only a few other lightweight React components
* Design, interactive, and runtime layout
* Bounds checking
* Separate layouts per responsive breakpoint
* Serializable

## Applications

* Responsive page layout
* Dashboards
* Organization charts
* Diagrams
* Editors
* Games

## Use

The basic use is to use ReactLayout as a parent element followed by zero or more elements with a data-layout property.

```javascript
<ReactLayout />
  <div data-layout={{name: 'name1'}} >
    elements...
  </div>
  ...
  <div data-layout={{name: 'name2'}} >
    elements...
  </div>
</ReactLayout>
```

ReactLayout can contain instances of ReactLayout. And as usual with React, children of ReactLayout can be programmatically generated.

### RLGPanel

Use RLGPanel as a child of ReactLayout when children need to use the viewport assigned by ReactLayout.

```javascript
  <RLGPanel data-layout={{ name: 'content' }}>
    {(viewport: ISize) => (
        <List viewport={viewport}>
        // ...
        </List>
    )}
  </RLGPanel>
```

The function (viewport: ISize) => () makes the property viewport available to all its elements. The actual value of viewport is updated by ReactLayout on every render pass. It can be used to set the max-width in css like this:

```javascript
  export const Item = styled.li<IProps>`
    max-width:  ${p => p.viewport.width};
    white-space: wrap;
`
```

and it can be used to define the viewport in svg.

```javascript
  <svg
    width={viewport.width}
    height={viewport.height}
    viewBox="0 0 50 20"
  >
      <rect x="20" y="10" width="10" height="5"
            style="stroke: #000000; fill:none;"/>
  </svg>
```

The viewBox defines the coordinates system used by svg elements which will be mapped to the viewport.

ReactLayout will also update the viewport param on every render pass. The viewport param can be used by the generator.

You should think of the viewport as the size of every container. The top level viewport in a [generator](#Generator) is set by [ReactSizeDetector](https://www.npmjs.com/package/react-resize-detector). Its children's viewports are computed by the generator.

### Responsive Layout

#### You don't need borders

Borders can distract. Instead let the eye see organize your elements. Use RLGColumns and RLGRows to layout.

### Responsive Desktop Layout

*See examples/src/index.tsx.*

RLG provides a number of tools to allow for responsive design. 

The simplest one is to just define all the elements in a generator as a function of the viewport.

A Responsive Desktop is defined by the [generator](#Generator) RLGDesktop. It defines a classical desktop layout consisting of a title, left side panel, header, right side panel, content, and footer. It has a built-in editor to adjust the layout. All the parts are configurable in size and optional except for the content (it is the remaining area). It also can be configured to use full header and footer if desired.

```html
<ReactLayout
  name={'reactLayout.desktop.example'}
  editLayout={false}
  g={new RLGDesktop()}
>
  <div data-layout={{ name: 'title' }} >
    <span>Title</span>
  </div>

  <div data-layout={{ name: 'leftSide' }} >
    <span>Left side content</span>
  </div>

  <div data-layout={{ name: 'header' }} >
      <span>Header content</span>
  </div>

  <div data-layout={{ name: 'content' }}>
    <span>App content</span>
  </div>

   <div data-layout={{ name: 'rightSide' }} >
    <span>Right side content</span>
  </div>

   <div data-layout={{ name: 'footer' }} >
    <span>Footer content</span>
  </div>
</ReactLayout>
```

#### Note

In general, you should use RLGPanel as the children of ReactLayout.

```javascript
  <RLGPanel data-layout={{ name: 'footer' }} >
    {(viewport: ISize) => {
      {/* React components here */}
    }}
  </RLGPanel>
```

For content styled-components are a good choice for styling since styled-components can be defined to accept properties.

```javascript
  interface IProps {
    viewport: ISize;
  }

  const List = styled.ul<IProps>`
    max-width:  ${p => p.viewport.width};
  `
```

Or you may use html elements to wrap React components rather than directly using React components with a data-layout property. A common choice in this case is the div element. The disadvantage of this approach is that your content will not have access to the viewport.

```javascript
  render() {
    ...
    return (
      <div style={this.props['style'] }>
        ...
      </div>
    )
  }
```

This is because RLG uses css internally and css only transforms html. If you do use React component directly that does not do apply the style property to the root element of the component, it will not be displayed at the correct position.

### Generator

*See RLGColumn, RLGDesktop, RLGDynamic and RLGList for examples.*

A generator is just a function that returns an instance of Generator. The function must define the generators Param, contain an init function and an optional create function. Here is a simple Empty generator:

```javascript
function RLGEmpty(name: string) {

  // The following code is only executed once
  const params = new Params([
    // viewport will automatically be updated
    ['viewport', {width: 0, height: 0}]
  ])

  // init will be called by the Generator as needed
  // It defines the static named parts of the generator and computes any needed layouts.
  function init(g: IGenerator): Layouts {
    const layouts = g.layouts();

    // Define static parts of the layout

    // Update layouts if needed

    return layouts;
  }

  return new Generator(name, init, params);
}
```

RLGEmpty will not generate any elements even if it contains data-layout elements.

To make it a useful dynamic generator we just add a create function to the generator. That's how the RLGDynamic generator is defined. It lets you define a layout manually and offers the best flexibility, but only limited responsiveness by using just the properties of the [position](#IPosition) interface.

```javascript
function RLGDynamic(name: string): IGenerator {
  const _params = new Params([
    ['viewport', { width: 0, height: 0 }]
  ])

  function init(g: IGenerator): Layouts {
    const params = g.params();
    const layouts = g.layouts();

    if (params.changed()) {
      // update Layout for each update
      layouts.map.forEach((layout) => {
        layout.touch();
      });
    }
    return layouts;
  }

  function create(args: ICreate): Layout {

    if (!args.position) {
      console.error(`TODO default position ${args.name}`)
    }

    const layout = new Layout(args.name, args.position, args.g);

    args.g.layouts().set(layout.name, layout);

    return layout;
  }

  return new Generator(name, init, _params, create);
}
```

### Scaling

RLG offers multiple builtin options for scaling. 

## API

### ReactLayout component

This is the only component that a user needs. It is the manager for each RLG group. Its purpose is to dynamically define the layout using the generator and the data-layout specification.

### data-layout property

### Layout component

This is an internal component. It is accessible when building a generator function.

### IPosition interface

These parameters are a per element configuration. For parameters that apply to all elements in a ReactLayout use the Params object.

```javascript
interface IPosition {
  units: {
    origin: IOrigin,
    location: IUnit,
    size: IUnit
  }
  align?: {
    origin: IOrigin;
    key: string | number,
    offset: IPoint,
    source: IAlign,
    self: IAlign
  },
  edit?: IEdit[];
  handlers?: IHandlers;
  location: IPoint;
  size: ISize;
}
```
