# React Layout Generator

*React-layout-generator (RLG) is a project that is exploring a layout system that uses React to compute the layouts directly when arranging elements.*

RLG is focused on layout and editing of both html and svg components. By taking direct control of the layout it enables precise and continuous control of responsive layouts. You're no longer limited to just css and the linear flow of elements.

This component was initially inspired by [react-grid-layout](https://www.npmjs.com/package/react-grid-layout).

## Install

Coming soon on npm.

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

## Bugs

- Fix flickering when making the browser window smaller/larger.

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
        layout.touch();
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

Note that generators do not have to be packaged as a function. It is easy to implement a generator as part of a class.
