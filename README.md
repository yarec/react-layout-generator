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
    - [RLGPanel](#rlgpanel)
    - [Responsive Layout](#responsive-layout)
    - [Responsive Desktop Layout](#responsive-desktop-layout)
      - [Note](#note)
    - [Generator](#generator)
    - [Editing](#editing)
      - [Configuration](#configuration)
      - [Controls](#controls)
  - [FAQ](#faq)

<!-- /TOC -->

React Layout Generator (RLG) is a [Layout in React](https://github.com/chetmurphy/react-layout-generator/blob/master/LayoutInRect.md) component for dynamic and responsive layout. It is focused on layout and editing of both html and svg components. The approach used enables precise and continuous control of responsive layouts.

This release should be considered pre-alpha.

This component was initially inspired by [react-grid-layout](https://www.npmjs.com/package/react-grid-layout).

## Install

For the time being, you will need to clone or fork the project to evaluate. To run locally follow these steps: 1) cd to the \<directory\> where you installed RLG, 2) run npm install or yarn, 3) cd to the examples directory, 4) run npm install or yarn, and 4) run start (to build the examples).

## TODO

- Describe saving and restoring.
- Implement layers, bring forward, ...
- Add React PropTypes for non typescript users.
- Add grid command as option to toolBar
- Add arrange group to toolBar (align, layers,
- Implement nudge with arrow keys.
- Implement current select commands.
- Add cut, copy, and paste commands.
- Add options to align columnsGenerator and rowsGenerator.
- Add Touch support in editor.
- Upload component to npm
- Host website on Github

### Bugs

- Does not work smoothly with browser magnification +/-.
- Fix flickering when making the browser window smaller.

## Features

- Top down design of websites.
- Lightweight - minimal use of other React libraries.
- Includes core edit capabilities with runtime layout.
- Layout is fully serializable.

## Applications

- Responsive page layout
- Dashboards
- Organization charts
- Diagrams
- Games
- Animations
- Free from layout

## Usage

### RLGLayout

Use RLGLayout as a parent element followed by one or more elements with a data-layout property.

```javascript
<RLGLayout name='layoutName' ... />
  <div data-layout={{name: 'name1', ...}} >
    elements...
  </div>
  ...
  <div data-layout={{name: 'nameN', ...}} >
    elements...
  </div>
</RLGLayout>
```

RLGLayout can contain instances of RLGLayout. And as usual with React, children of RLGLayout can be programmatically generated.

### RLGPanel

Use [RLGPanel](classes/rlgpanel.html) as a direct child of RLGLayout when its children need access to information about their container including their location and size.

```javascript
  <RLGPanel data-layout={{ name: 'content' }}>
    {(args: IRLGPanelArgs) => (
       ...
    )}
  </RLGPanel>
```

The function (args: [IRLGPanelArgs](interfaces/irlgpanelargs.html)) => () makes its args available to all the jsx included. These args are updated by RLGLayout on every render pass allowing elements to respond to changes including animation.

One way to utilize these args is to use Styled-components with a Style defined like this:

```javascript
  const Item = styled.li<{containersize: ISize}>`
    max-width:  ${p => p.containersize.width};
    white-space: wrap;
`
```

then just pass the args to \<Item containersize={args.containersize} \>

Likewise it can be used to define the width and hight in a svg element.

```javascript
  <svg
    width={args.containersize.width}
    height={args.containersize.height}
    viewBox="0 0 50 20"
  >
    <rect x="20" y="10" width="10" height="5"
      style="stroke: #000000; fill:none;"/>
  </svg>
```

In the above snippet the viewBox defines the coordinates system used by svg elements which will now be mapped to the containersize.

### Responsive Layout

### Responsive Desktop Layout

RLG provides a number of features to allow for responsive design.

The simplest approach is to just define all the elements in a generator as a function of the containersize.

An example of a responsive [generator](#Generator) is defined by the desktopGenerator. This generator defines a classical desktop layout consisting of a title, left side panel, header, right side panel, content, and footer. It has a built-in editor to adjust the layout. All the parts are configurable in size and optional except for the content (it is the remaining area). It also can be configured to use full header and footer if desired.

```javascript
<RLGLayout
  name={'example'}
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
    <span>Page content</span>
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

A generator is just a function that returns an instance of Generator. A generator function must define its parameters storage, contain an init function and an optional create function. Here is a simple Empty generator:

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

emptyGenerator will not generate any elements even if it has children that contains data-layout elements.

To make it a useful dynamic generator we just add a create function to the generator. That's how the [dynamicGenerator](globals/dynamicgenerator.html) is defined. It lets you define a layout manually and offers the best flexibility, but only limited responsiveness using just the properties of the [position](interfaces/iposition.html) interface.

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

### Editing

#### Configuration

#### Controls

| Control |  Description |
|------------------ :------------------------------------------------:|
| Drag + ctlr | constrain to horizontal or vertical |

## FAQ