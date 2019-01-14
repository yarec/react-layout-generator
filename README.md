# React Layout Generator

*React-layout-generator is a project that is exploring a layout system that uses React to compute the layouts directly when arranging the basic elements. We call this [Layout in React](layout-in-react.md).*

React Layout Generator (RLG) is a Layout in React component for dynamic and responsive layout. It is focused on layout and editing of both html and svg components. The approach used enables precise and continuous control of responsive layouts.

This release should be considered pre-alpha.

This component was initially inspired by [react-grid-layout](https://www.npmjs.com/package/react-grid-layout).

## Examples

Live examples (TODO)

## Documentation

See [docs](https://www.cnn.html).

## Install

For the time being, you will need to clone or fork the project to evaluate. To run locally follow these steps: 1) cd to the \<directory\> where you installed RLG, 2) run npm install or yarn, 3) cd to the examples directory, 4) run npm install or yarn, and 4) run start (to build the examples).

### Contributing

We're really glad you're reading [this](CONTRIBUTING.md), because we need volunteer developers to help this project come to fruition. Also see the [code of conduct](code-of-conduct.md) before working on the repo.

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

## Bugs

- Does not work smoothly with browser magnification +/-.
- Fix flickering when making the browser window smaller.

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

