# React Layout Generator

*This document is a work in progress. In the meantime see the source code for details.*

React Layout Generator (RLG) is a [Layout in React](https://github.com/chetmurphy/react-layout-generator/blob/master/LayoutInRect.md) component for dynamic and responsive layout. It started with an experimental simple state machine that produced a sequence of blocks (think grid) and then was expanded to allow responsive and dynamic layout.

This component was inspired by [react-grid-layout](https://www.npmjs.com/package/react-grid-layout).

## Install

For the time being, you will need to clone or fork the project to evaluate.

## TODO

* Finish implementing editor
* Add left and right align to RLGColumn
* Implement RLGRow
* Drop and touch
* Serialization - should be possible now by saving/restoring params and positions
* Breakpoints
* Additional generators
* More tests
* Upload component to npm
* Host website on Github
* Alpha version - current release is early pre-alpha

### Bugs

* Use the extent prop in ReactLayout props rather than use 
* Cleanup initialization of generators and viewport to potentially allow generators to be reused. See 1) ReactLayout initLayout which is called at the beginning of each render and 2) Generator which calls the user supplied init function during the initLayout call.
* Fix flickering when making the browser window smaller for elements in RLGColumns. This appears to be due to an update issue causing the computed element size to include the scroll bar since the initial layout is being used with the newer smaller element.

## Features

* Lightweight - uses only a few other lightweight React components
* Drag and drop
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

```html
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

### Responsive Desktop Layout

*See examples/src/index.tsx.*

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

In general, you need to use html elements to wrap React components rather than directly using React components with a data-layout property. A common choice is the div element.

```html
  <div data-layout={{ name: 'footer' }} >
    {/* React components here */}
  </div>
```

It is possible to use a React component in some cases, such as styled-component of a html element, or a custom component if it applies the style property to its root html element like this:

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

This generator will not generate any elements even if it contains data-layout elements.

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
      console.error('TODO default position')
    }

    const layout = new Layout(args.name, args.position, args.g);

    args.g.layouts().set(layout.name, layout);

    return layout;
  }

  return new Generator(name, init, _params, create);
}
```

## API

### ReactLayout component

This is the only component that a user needs. It is the manager for each RLG group. Its purpose is to dynamically define the layout using the generator and the data-layout specification.

### data-layout property

### Layout component

This is an internal component

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
