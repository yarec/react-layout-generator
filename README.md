# React Layout Generator

*This document is a work in progress. In the meantime see the source code for details.*

React Layout Generator is a css in typescript (javascript) component for dynamic and responsive layout. It started with an experimental simple state machine that produced a sequence of blocks (think grid) and then was expanded to allow responsive and dynamic layout.

This component was inspired by [react-grid-layout](https://www.npmjs.com/package/react-grid-layout).

## Use

For the time being clone or fork the project to evaluate.

## TODO

* Upload component to npm
* Host website on Github
* Alpha version - current release is early pre-alpha
* Drop and touch
* Serializable - should be possible now by saving/restoring params and positions
* Breakpoints
* Additional generators
* Documentation
* More tests

### Bugs

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

### Responsive Desktop Layout

*See examples/src/index.tsx.*

The Responsive Desktop is defined by the [generator](#Generator) RLGDesktop. It defines a classical desktop layout consisting of a title, left side panel, header, right side panel, content, and footer. All the parts are configurable in size and optional except for the content (it is the remaining area). It also can be configured to use full header and footer if desired.

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

### Generator

*See RLGDesktop, RLGDynamic and RLGList for examples.*

A generator is just a function that returns an instance of Generator. The function must define the generators Param, contain an init function and an optional create function. Here is a simple do nothing generator:

```javascript
function DoNothing(name: string) {

  // The following code is only executed once
  const params = new Params([
    // viewport will automatically be updated
    ['viewport', {width: 0, height: 0}]
  ])

  // init will be called by the Generator as needed
  // It defines the static named parts of the generator
  function init(g: IGenerator): Layouts {
    const layouts = g.layouts();

    // Define static parts of the layout

    // Update layouts if needed

    return layouts;
  }

  return new Generator(name, init, params);
}
```
