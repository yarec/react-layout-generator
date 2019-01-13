# React Layout Generator

*This document is a work in progress. In the meantime see the source code for details.*

React Layout Generator (RLG) is a [Layout in React](https://github.com/chetmurphy/react-layout-generator/blob/master/LayoutInRect.md) component for dynamic and responsive layout. It is ideal for laying out both html and svg components and allows precise and continuous control for responsive layouts.

This component was inspired by [react-grid-layout](https://www.npmjs.com/package/react-grid-layout).

## Install

For the time being, you will need to clone or fork the project to evaluate.

## TODO

* 
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

* Fix overflow: hidden bug. Css clips anything outside of its RLGLayout container due to setting overflow: hidden. Scroll bars and overflow hidden should only be set for the outermost RLGLayout.
* Update not working with browser magnification +/-.
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

## Usage

### RLGLayout

Use [RLGLayout](classes/rlglayout.html) as a parent element followed by one or more elements with a data-layout property.

```javascript
<RLGLayout name={ name } g={ generator }>
  <div data-layout={{name: 'name1'}} >
    elements...
  </div>
  ...
  <div data-layout={{name: 'name2'}} >
    elements...
  </div>
</RLGLayout>
```

Note that RLGLayout can contain instances of RLGLayout. And as usual with React, children of RLGLayout can be programmatically generated (be sure to add keys so that React is happy).

### RLGPanel

Use RLGPanel as a child of RLGLayout when children need access to the Block assigned by RLGLayout.

```javascript
  <RLGPanel data-layout={{ name: 'content' }}>
    {(args: ISize) => (
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

### Responsive Layout

RLG provides a number of options to allow for responsive design including the generator functions. You can also define the location and size parameters specialized units including pixel and percent.

The best approach is to define all the elements in a generator as a function of the containersize. An example of this is the[desktopGenerator](globals.html#desktopgenerator). It defines a classical desktop layout consisting of a title, left side panel, header, right side panel, content, and footer. It has a built-in editor to adjust the layout. All the parts are configurable in size and optional except for the content (it is the remaining area). It also can be configured to use full header and footer if desired.

```javascript
<ReactLayout
  name={'reactLayout.desktop.example'}
  edit={false}
  g={desktopGenerator(...)}
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

By using the desktopGenerator you are assured that all components are always responsive. And since the generator is just a javascript function you have the flexibility to adapt logically to the physical size of the container. The desktopGenerator will for example hide the left and right panels if the width is too small.

#### Note

In general, you should use RLGPanel as the children of ReactLayout.

```javascript
  <RLGPanel data-layout={{ name: 'footer' }} >
    {(viewport: ISize) => (
      {/* React components here */}
    )}
  </RLGPanel>
```

 A good choice for styling is styled-components since styled-components can be defined to accept properties.

```javascript
  interface IProps {
    viewport: ISize;
  }

  const List = styled.ul<IProps>`
    max-width:  ${p => p.viewport.width};
  `
```

Or you may use html elements to wrap React components rather than directly using React components with a data-layout property. A common choice in this case is the div element. A disadvantage of this approach is that your content will not have access to the viewport.

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

#### Notes

When accessing params be sure to clone the value if you intend on making changes to the value, otherwise you could end up modifying the value in the Params store.

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

#### Units

##### Origin

Origin specifies the position within an element that location uses to position the element. Origin is expressed in percent of the width and height of an element. An origin of (0, 0) specifies the left top position of the element. An origin of (50,50) specifies the center of the element. Thus to position an element in the center of a container you would use:

```javascript
  units: {
    origin: {50, 50}
    location: IUnit.percent
    size: ...
  }
  location: {50, 50}
  size: ...
```

If you use an origin of (0, 0) then the left top of the element would be placed at the center of the container.