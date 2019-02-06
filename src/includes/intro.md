# React Layout Generator

*React-layout-generator (RLG) is exploring a layout system that uses React to compute the layouts directly.*

RLG is focused on layout and editing of both html and svg components. By taking direct control of the layout it enables precise and continuous control of responsive layouts. You're no longer limited to just css and the linear flow of elements.

A [live demo](https://neq1.io) is available at https://neq1.io
___
A key difference from traditional layout is that RLG specifies the layout topdown. This means that the layout is passed down to React components using props rather than letting the browser determine the layout during the rendering process.

Of course, this also means that the author needs to know how the content will fit into the allocated space. We'll add notes on how we are dealing with this as we continue with the development of RLG. Note that this is not always a problem that needs solving.

Another key difference is that since RLG is only using absolute positioning all the blocks are independent of other blocks. This lets us manipulate the blocks. One use of this is to build a flexible layering system that allows rearranging, hiding, and animating layers. It also enables optional services to be added such as editing and drag and drop. The layering system also features a control layers that is excluded from the services.
___

This project was initially inspired by [react-grid-layout](https://www.npmjs.com/package/react-grid-layout).

<!-- TOC -->

- [React Layout Generator](#react-layout-generator)
  - [Install](#install)
    - [Contributing](#contributing)
  - [TODO](#todo)
  - [Features](#features)
  - [Applications](#applications)
  - [Usage](#usage)
    - [RLGLayout](#rlglayout)
      - [Note](#note)
    - [RLGPanel](#rlgpanel)
    - [Responsive Layout](#responsive-layout)
    - [Responsive Desktop Layout](#responsive-desktop-layout)
    - [Layers](#layers)
    - [Drag and Drop](#drag-and-drop)
      - [dragData(id: string) => string[]](#dragdataid-string--string)
      - [dragImage(ids: string[]) => JSX](#dragimageids-string--jsx)
      - [dragEnd(ids: string[]) => void](#dragendids-string--void)
      - [Draggable](#draggable)
    - [Generator](#generator)
      - [Animations](#animations)
      - [Notes](#notes)
    - [Editor](#editor)
      - [Edit commands (in examples)](#edit-commands-in-examples)
      - [Keyboard controls](#keyboard-controls)
  - [FAQ](#faq)
    - [Why not build a system based on React refs](#why-not-build-a-system-based-on-react-refs)
    - [Why is the page flashing](#why-is-the-page-flashing)
    - [How can I right align blocks](#how-can-i-right-align-blocks)
    - [How can I persist the Params for distribution](#how-can-i-persist-the-params-for-distribution)

<!-- /TOC -->

## Install

Use either npm or yarn to install

```js
yarn add react-layout-generator
```

For typescript user, type definitions are not needed since they are included.

### Contributing

We're really glad you're reading this, because we need volunteer developers to help this project come to fruition. In particular we need components that are designed to use RLG.

These steps will guide you through contributing to this project:

- Fork RLG
- Clone it and install dependencies
- Build

git clone `https://github.com/YOUR-USERNAME/react-layout-generator`

Then run `npm install` or `yarn`.

RLG includes an examples sub-project so it too will need to be initialized using npm or yarn. See the package.json for scripts supported.

Make and commit your changes. Make sure the commands start, build, test, and test:prod are working.

Finally send a [GitHub Pull Request](https://github.com/chetmurphy/react-layout-generator/compare?expand=1) with a clear list of what you've done (read more [about pull requests](https://help.github.com/articles/about-pull-requests/)). Make sure all of your commits are atomic (one feature per commit).

## TODO

- Place each layer in its own group so that [z-index](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context) will only have effect in that layer.
- Add move command within a container to drag and drop to allow rearranging draggable blocks).
- Add React PropTypes for non typescript users.
- Add grid command as option to toolBar
- Add arrange group to toolBar (align, layers,
- Implement nudge with arrow keys.
- Implement current select commands.
- Add cut, copy, and paste commands.
- Add options to align columnsGenerator and rowsGenerator.
- Add Touch support in editor.
- Host website on Github

## Features

- Top down design of websites.
- Lightweight - minimal use of other React libraries.
- Core edit capabilities with runtime layout.
- Serializable.

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

Use RLGLayout as a parent element followed by one or more elements with a [data-layout](interfaces/idatalayout.html) property.

```ts
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

#### Note

Do not use generic React components with a data-layout property as direct children of RLGLayout. This is because the generated style needs to applied to the outer most element in the component. Otherwise the component will not be positioned correctly.

A common choice is to wrap a react component with a div element. A disadvantage of this approach is that your content will not have access to meta data. Even so it is also possible that a generic React component will not render correctly within the space allocated (this can be mitigated by using [RLGPanel](#RLGPanel) and/or Unit.unmanaged)

You can only use react components as direct children that apply the style property in their render method like this:

```ts
  render() {
    ...
    return (
      <div style={this.props['style'] }>
        { react components }
      </div>
    )
  }
```

### RLGPanel

Use [RLGPanel](classes/rlgpanel.html) as a direct child of RLGLayout when its children need access their location, size and other information.

```ts
  <RLGPanel data-layout={{ name: 'content' }}>
    {(args: IRLGMetaDataArgs) => (
       ...
    )}
  </RLGPanel>
```

The function (args: [IRLGMetaDataArgs](interfaces/IRLGMetaDataArgs.html)) => () makes its args available to all the jsx included. These args are updated by RLGLayout on every render pass allowing elements to respond to changes including animation.

One way to utilize these args is to use Styled-components with a Style defined like this:

```ts
  const Item = styled.li<{containersize: ISize}>`
    max-width:  ${p => p.containersize.width};
    white-space: wrap;
`
```

then just pass the args to \<Item containersize={args.containersize} \>

Likewise it can be used to define the width and height in a svg element.

```ts
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

RLG provides a number of features to help make layouts responsive.

A key approach is to just define all the elements in a generator as a function of the containersize.

An example of a responsive generator is defined by the [desktopGenerator](globals#desktopgenerator). This generator defines a classical desktop layout consisting of a title, left side panel, header, right side panel, content, and footer. It has a built-in editor to adjust the layout. All the parts are configurable in size and optional. It also can be configured to use full header and footer if desired.

```ts
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

### Layers

RLG has its own implementation of layers. You can merge, reorder, and hide layers. Layers are arranged in numerical order starting with 0. You can also specify negative values for Layers. These are used as control layers that set on top any services activated.

Note: Layers are NOT related to z-index. Layers allows application level grouping of components that are arranged from back to front. Z-index (zIndex) can be used within a layer to arrange elements in the layer's stacking context if
[encapsulation](#RLGLayout) is on in layers.

Layers can be used for animations, to hide or show overlays, to visually filter layers (using a semitransparent layer), and in combination with services such as drag and drop, and editing.

To specify the layer of a block and all its content add the data-layer property to component.

```ts
<div
  key={name}
  data-layout={{
    name
  }}
  data-layer={2}
>
```

To manage the layers add a layers property in RLGLayout. It consists of a maximum layer and a mapper function that takes the layer specified in a block and maps it to the layers that will be rendered. The default mapper just maps the layers in numerical order. Here is an example of mapper function that hides layer 3 and merges all layers greater than 4.

```ts
<RLGLayout
        name='name'
        ...
        layers={{
          maximum: 5,
          service: 4,
          mapper: (layer: number) => {
            if (layer === 3) {
              // hide layer 3
              return undefined
            }
            if (layer > 4) {
              // combine all layers greater than 5
              return 5
            }
            return layer
          }
        }}
        ...
```

In this example any services specified will use layer 4. All layers above 4 will be treated as a control layer.

To animate a layer you just collect all the blocks that will participate in the layer animation in a [generator](#generator). Other animations can be running on other layers.

The reason for having a control layer is that services manage the interactions of lower layers so that event handling will not directly work on these layers, but they will work as normal on the control layer since it is on top of all of the other layers. 

### Drag and Drop

Drag and drop allows you to drag items from one container to another container within a Layout. To activate drag and drop, add the ServiceOptions.dnd to the service property of RLGLayout:

```ts
      <RLGLayout
        name='name'
        service={ServiceOptions.dnd}
        ...
```

Then wrap your draggable elements and components using Draggable and DragDrop

1. Container Source:

```txt
  Handler                Required
  
  dragData                [no]
  dragImage               [no]
  dragEnd                 [yes]
```

2. Draggable:

```txt
  Handler                Required
  
  drag                    [no]
  draggable               [yes]
  dragImage               [yes]
```

3. Droppable:

```txt
  Handler                Required
  
  droppable               [yes]
  canDrop                 [yes]
  drop                    [yes]
  dragEnter               [no]
  dragLeave               [no]
```

#### dragData(id: string) => string[]

Fired once when the user starts dragging a component.

Used on draggable components and on the source container. Optional: default is the block id. This function takes the block id and returns an array of ids or undefined. Undefined will stop the drag.

Uses include: preventing a drag, returning a different block, or a list of blocks. The list of blocks is used in the Solitaire game.

#### dragImage(ids: string[]) => JSX

Fired once when the user starts dragging a component.

Optional: default is the draggable component content. Can be used to provide an image for all ids. Returned value must JSX.

#### dragEnd(ids: string[]) => void

Fired once when the user is ending a drag.

This function is called on the source container when a drag has been completed. It must remove the blocks from this container.

Then mark layers. Only controls need have data-layer value greater then 0. Then enable both drag and drop and a [layers](#layers) property if needed.

The implementation follows this logic:

1. mouse down

    a. start if a draggable component is found

2. drag start

    a. [optional] get DragDrop container

    b. [optional] calls container.dragStart(id: string) => ids: string[]

    c. default is Draggable id

3. get drop image

    a. [optional] calls container.getDragJSX(ids: string[]) => JSX

    b. default is Draggable content

4. drag

    a. look for containers

    b. calls container.canDrop(ids: string[]) => boolean

    c. [optional] calls container.dragEnter(ids: string[]) => void

    d. [optional] alls container.dragLeave(ids: string[]) => void

5. release mouse

    a. calls container.drop(ids: string[]) => void

    b. calls container.endDrop(ids: string[]) => void

#### Draggable



### Generator

*See columnsGenerator, desktopGenerator, and dynamicGenerator for examples.*

A generator is just a function that returns an instance of Generator. A generator function must define its parameter storage, contain an init function and an optional create function. Here is a minimal Empty generator:

```javascript
function emptyGenerator(name: string) {

  // The following code is only executed once
  const params = new Params([
    // containersize will automatically be updated
    ['containersize', {width: 0, height: 0}]
  ])

  // init will be called by the Generator as needed
  // It defines the static named parts of the generator 
  // and computes any needed layouts.
  function init(g: IGenerator): Layouts {
    const layouts = g.layouts();

    // Define static parts of the layout

    // Update layouts as needed

    return layouts;
  }

  return new Generator(name, init, params);
}
```

emptyGenerator will not generate any elements even if it has children that contains data-layout elements.

To make it a useful dynamic generator we add a create function to the generator. That's how the [dynamicGenerator](globals/dynamicgenerator.html) is defined. It lets you define a layout manually and offers the most flexibility, but only limited responsiveness using just the properties of the [position](interfaces/iposition.html) interface.

```jsx
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
        layout.touch(true);
      });
    }
    return layouts;
  }

  function create(args: ICreate): Layout {

    if (!args.position) {
      console.error(`${args.name} dynamicGenerator requires that a position is defined`)
    }

    return args.g.layouts().set(layout.name, args.position, args.g)
  }

  return new Generator(name, init, _params, create);
}
```

#### Animations

Generators can also be used for animations if they compute the layout blocks as a function of time. Here is an example of an [animation](globals.html#rollgenerator) that scrolls up all the children of a RLGLayout in an endless loop.

```ts
function init (...) {
  ...
  let rect = block.rect()
  let velocity = ...
  ...
  if (animate) {
    blocks.map.forEach((block: Block) => {
    const rect = block.rect()
    let location = { x: rect.x, y: rect.y - velocity * deltaTime }
    if (location.y + rect.height < 0) {
      // This creates the endless scroll
      location.y += frameHeight
    }
    block.update(location, { width: rect.width, height: rect.height })
  })
}
```

To activate animation behavior in RLGLayout just pass the optional [animate](interfaces/ianimateprops) property and use a generator that is animation aware.

#### Notes

Note that generators do not have to be packaged as a function. It is easy to implement a generator as part of a class.

### Editor

#### Edit commands (in examples)

** This implementation is a work in progress. Not all commands are currently wired for all pages. A production editor will need many more function. This is just a proof of concept editor. **

The toolbar on the left provides common commands. There is also a context menu which has commands for undo, redo, align, and layer commands.

Before you can edit any of the pages you need to first make sure that the editor is on. This is the topmost command in the toolbar. Just click to toggle on and off. Note that if the data is not persisted then turning the editor off will reset the Layout to it previous state.



#### Keyboard controls

- Constrain dragging to horizontal or vertical. Hold down the ctrl key while dragging.

- Dump params [ctrl + alt + p]. This command dumps the values of the params in a JSON format to the debug console that is suitable for persisting. It can also just be used in debugging.

An example is implemented in the examples sub-folder in Intro.tsx. The persisted data is stored in the params.json file in the assets folder. It is imported in Intro.tsx using `import * as data from '../assets/data/params.json'` and then added to the `params` prop of RLGLayout.

- Select blocks is done by using [shift + click].

## FAQ

### Why not build a system based on React refs

That could work for specific cases but there is more to a layout system than just manipulating the underlying html elements. You need a way to serialize, edit, and present a layout with content. The hard part of a non-linear layout system is the placement of the elements. In a linear system each element just comes after another element. In a non-linear system the author has to decide on each placement. It's the same problem faced by graphic editors. Trying to design a complex React app using only linear flow programming tools involves time consuming steps including a lot of trial and error to get the layout correct.

RLG does use refs internally but only to get information. Placement of elements is done using React properties in a top down flow.

### Why is the page flashing

This can occur when any element extends beyond the borders. Finding those elements changing their size and or location will fix the problem. Another choice is the add overflowX and overflowY hidden property  to the appropriate RLGLayout.

### How can I right align blocks

One way is to set a block [origin]() of {x: 100, y: 0} with the the same x location in all the blocks you wish to have right aligned. A second way is to use the align property. A third way is to use the editor with the align right command. Then persist the Params.

  First way:

```ts
data-layout={{
  name: 'block 1',
  position: {
    origin: {x: 100, y: 0},
    location: { x: 90, y: 10, unit: Unit.percent },
    size: { width: 200, height: 350, unit: Unit.unmanagedHeight }
  }
}}

data-layout={{
  name: 'block 2',
  position: {
    origin: {x: 100, y: 0},
    location: { x: 90, y: 10, unit: Unit.percent },
    size: { width: 200, height: 350 }
  }
}}

```

 Second way:

```ts
data-layout={{
  name: 'block 1',
  position: {
    location: { x: 90, y: 10, unit: Unit.percent },
    size: { width: 200, height: 350, unit: Unit.unmanagedHeight }
  }
}}

data-layout={{
  name: 'block 2',
  position: {
    align: {
      key: 'block 1',
      offset: { x: 0, y: 10 },
      source: { x: 100, y: 100 },
      self: { x: 100, y: 0 }
    }
    location: { x: 90, y: 10, unit: Unit.percent },
    size: { width: 200, height: 350, unit: Unit.unmanagedHeight }
  }
}}
```

Block 2 will be linked to Block 1 and be 10 units below Block 1 and right aligned.

```
 ┌────────┐
 │ 1      │
 └────────o Offset: {X: 100, y: 100}
          │
    ┌─────┐ Offset: {x: 100, y: 0}
    │ 2   │
    └─────┘
```

### How can I persist the Params for distribution

It's currently a manual process because you cannot write to local files. Here are the steps for persisting the params for the Home page in the examples.

1. Go to Home page in the examples. Turn edit on (the topmost toolbar icon). Then use the keyboard and type ctrl + alt + p. This will list the params in the debug console.

2. Open the params.json file in the assets folder in the examples sub-project.

3. Copy the listed parameters from the debug console. Paste into the params.json file.

It should look like this:

```ts
{
  "rlg.intro": [
     ["containersize", {"width":1434,"height":714}],
     ["animationStart", 0],
     ["animationTime", 0],
     ["animationLast", 0],
     ["velocity", 0.1],
     ["update", 0],
     ["frameHeight", 3917.1],
     ["deltaTime", 16.73699999999735],
     ["animate", 1]
  ]
}
```

4. Now import the params.json in the page:

```ts
import * as data from '../assets/data/params.json'
```

5. and add the imported params to the params property as follows (look for the → → →):

```ts
public render() {
    return (
      <RLGLayout
        name={'RLGLayout.intro.example'}
        service={this._edit ? ServiceOptions.edit : ServiceOptions.none}
        debug={DebugOptions.none}
        params={[
→ → →     ...data['rlg.intro'] as Array<[string,ParamValue]>,
          ['velocity', 0.05]
        ]}
        ...
```

Note that this example is in typescript and that the cast is necessary to tell typescript the type of data.
