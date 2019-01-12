# React Layout Generator

*This document is a work in progress. In the meantime see the source code for details.*
<!-- TOC -->

- [React Layout Generator](#react-layout-generator)
  - [Install](#install)
  - [TODO](#todo)
    - [Bugs](#bugs)
  - [Features](#features)
  - [Applications](#applications)
  - [Usage](#usage)
    - [RLGLayout](#rlglayout)
      - [Options](#options)
        - [DebugOptions](#debugoptions)
        - [EditOptions](#editoptions)
    - [RLGPanel](#rlgpanel)
    - [Responsive Layout](#responsive-layout)
      - [You don't need borders](#you-dont-need-borders)
    - [Responsive Desktop Layout](#responsive-desktop-layout)
      - [Note](#note)
    - [Generator](#generator)
      - [Notes](#notes)
    - [Scaling](#scaling)
    - [Editing](#editing)
      - [Configuration](#configuration)
      - [Controls](#controls)
  - [API](#api)
    - [RLGLayout component](#rlglayout-component)
    - [data-layout property](#data-layout-property)
    - [Layout component](#layout-component)
    - [IPosition interface](#iposition-interface)
      - [Units](#units)
        - [Origin](#origin)
    - [Generator Init and Create](#generator-init-and-create)
      - [Init](#init)
      - [Create](#create)
  - [FAQ](#faq)

<!-- /TOC -->

React Layout Generator (RLG) is a [Layout in React](https://github.com/chetmurphy/react-layout-generator/blob/master/LayoutInRect.md) component for dynamic and responsive layout. It is ideal for laying out both html and svg components and allows precise and continuous control for responsive layouts. This is an early pre-alpha release.



This component was inspired by [react-grid-layout](https://www.npmjs.com/package/react-grid-layout).

## Install

For the time being, you will need to clone or fork the project to evaluate.

## TODO

- Update this readme.
- Describe saving and restoring.
- Implement layers, bring forward, ...
- Support dynamic addition of elements to page (alternative to params?)
- Add grid command as option to toolBar
- Add arrange group to toolBar (align, layers,
- Implement nudge with arrow keys.
- Implement current select commands.
- Add cut, copy, and paste commands.
- Finish implementing editor
- Add options to align RLGColumn and RLGColumn.
- Add Touch support in editor.
- Upload component to npm
- Host website on Github

### Bugs

- Does not work smoothly with browser magnification +/-.
- Fix flickering when making the browser window smaller. 

## Features

* Top down design of websites.
* Lightweight - minimal use of other React libraries.
* Editor, interactive, and runtime layout
* Serializable

## Applications

* Responsive page layout
* Dashboards
* Organization charts
* Diagrams
* Editors
* Games

## Usage

The basic use is to use RLGLayout as a parent element followed by one or more elements with a data-layout property.

```javascript
<RLGLayout />
  <div data-layout={{name: 'name1'}} >
    elements...
  </div>
  ...
  <div data-layout={{name: 'name2'}} >
    elements...
  </div>
</RLGLayout>
```

RLGLayout can contain instances of RLGLayout. And as usual with React, children of RLGLayout can be programmatically generated.

### RLGLayout

#### Options

##### DebugOptions

To dynamically control DebugOptions you can set the variable 'debugOptions' using params from the generator.

##### EditOptions

To dynamically control EditOptions you can set the variable 'editOptions' using params from the generator.

### RLGPanel

Use RLGPanel as a child of RLGLayout when children need to use the containersize assigned by RLGLayout.

```javascript
  <RLGPanel data-layout={{ name: 'content' }}>
    {(containersize: ISize) => (
        <List containersize={containersize}>
        // ...
        </List>
    )}
  </RLGPanel>
```

The function (containersize: ISize) => () makes the property containersize available to all its elements. The actual value of containersize is updated by RLGLayout on every render pass allowing elements to respond to changes in the size of the containersize.

It can be used to set the max-width in css like this:

```javascript
  export const Item = styled.li<IProps>`
    max-width:  ${p => p.containersize.width};
    white-space: wrap;
`
```

and it can be used to define the containersize in svg.

```javascript
  <svg
    width={containersize.width}
    height={containersize.height}
    viewBox="0 0 50 20"
  >
      <rect x="20" y="10" width="10" height="5"
            style="stroke: #000000; fill:none;"/>
  </svg>
```

The viewBox defines the coordinates system used by svg elements which will be mapped to the containersize.

RLGLayout will also update the containersize param on every render pass. The containersize param can be used by the generator.

You should think of the containersize as the size of every container. The top level containersize in a [generator](#Generator) is set by [ReactSizeDetector](https://www.npmjs.com/package/react-resize-detector). Its children's containersizes are computed by the generator.

### Responsive Layout

#### You don't need borders

Borders can distract. Instead let the eye see organize your elements. Use RLGColumns and RLGRows to layout.

### Responsive Desktop Layout

*See examples/src/index.tsx.*

RLG provides a number of tools to allow for responsive design.

The simplest one is to just define all the elements in a generator as a function of the containersize.

An example of a responsive generator is defined by the [generator](#Generator) desktopGenerator. It defines a classical desktop layout consisting of a title, left side panel, header, right side panel, content, and footer. It has a built-in editor to adjust the layout. All the parts are configurable in size and optional except for the content (it is the remaining area). It also can be configured to use full header and footer if desired.

```html
<RLGLayout
  name={'RLGLayout.desktop.example'}
  edit={false}
  g={new desktopGenerator()}
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
</RLGLayout>
```

#### Note

In general, you should use RLGPanel as the children of RLGLayout.

```javascript
  <RLGPanel data-layout={{ name: 'footer' }} >
    {(containersize: ISize) => (
      {/* React components here */}
    )}
  </RLGPanel>
```

 A good choice for styling is styled-components since styled-components can be defined to accept properties.

```javascript
  interface IProps {
    containersize: ISize;
  }

  const List = styled.ul<IProps>`
    max-width:  ${p => p.containersize.width};
  `
```

Or you may use html elements to wrap React components rather than directly using React components with a data-layout property. A common choice in this case is the div element. A disadvantage of this approach is that your content will not have access to the containersize.

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

*See columnsGenerator, desktopGenerator, and dynamicGenerator for examples.*

A generator is just a function that returns an instance of Generator. The function must define the generators Param, contain an init function and an optional create function. Here is a simple Empty generator:

```javascript
function emptyGenerator(name: string) {

  // The following code is only executed once
  const params = new Params([
    // containersize will automatically be updated
    ['containersize', {width: 0, height: 0}]
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

emptyGenerator will not generate any elements even if it contains data-layout elements.

To make it a useful dynamic generator we just add a create function to the generator. That's how the dynamicGenerator is defined. It lets you define a layout manually and offers the best flexibility, but only limited responsiveness by using just the properties of the [position](#IPosition) interface.

```javascript
function dynamicGenerator(name: string): IGenerator {
  const _params = new Params([
    ['containersize', { width: 0, height: 0 }]
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

### Editing

#### Configuration

#### Controls

| Control |  Description |
|------------------ :------------------------------------------------:|
| Drag + ctlr | constrain to horizontal or vertical |

## API

### RLGLayout component

This is the main component that a user needs. It is the manager for each RLG group. Its purpose is to dynamically define the layout using the generator and the data-layout specification.

### data-layout property

### Layout component

This is an internal component. It is accessible when building a generator function.

### IPosition interface

These parameters are a per element configuration. For parameters that apply to all elements in a RLGLayout use the Params object.

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

### Generator Init and Create

#### Init

The init function passed to the Generator must define the complete view of a layout. If the create function is being used then the init function should respect the layouts added by create.

#### Create

## FAQ