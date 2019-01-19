# React Layout Generator

React Layout Generator (RLG) is a Layout in React component for dynamic and responsive layout. It is general purpose, supports both html and svg*, and allows precise and continuous control for responsive layouts. Major features include template support, animation support including custom engines, persistance support, built-in editor with position and size editing, fine grain responsiveness, top down design, and overlay support.

This release should be considered pre-alpha.

This component was initially inspired by [react-grid-layout](https://www.npmjs.com/package/react-grid-layout).

\* For SVG to be really useful in React it needs to know its position and size. RLG makes this easy.

## Examples

Live examples (TODO)

## Documentation

See [docs](https://chetmurphy.github.io/react-layout-generator/).

## Install

For the time being, you will need to clone or fork the project to evaluate. To run locally follow these steps: 1) cd to the \<directory\> where you installed RLG, 2) run npm install or yarn, 3) cd to the examples directory, 4) run npm install or yarn, and 4) run start (to build the examples).

### Contributing

We're really glad you're reading this, because we need volunteer developers to help this project come to fruition. In particular there is a need for components designed with RLG.

## TODO

### Library

* Improve documentation.
* Add React PropTypes for non typescript users.
* Implement nudge with arrow keys.
* Implement current select commands.
* Add cut, copy, and paste commands.
* Add options to align columnsGenerator and rowsGenerator.
* Add Touch support in core editor.
* Upload component to npm.

### Example App

* Add grid command as option to toolBar.
* Add animation stop/start to toolBar.
* Add arrange group to toolBar.
* Finish Chart example.
* Wire up Editor to new commands.

## Bugs

* Does not work smoothly with browser magnification +/*.
* Fix flickering when making the browser window smaller/larger.

## Features

* Top down design of websites
* Lightweight
* Edit and runtime support
* Persistence
* Template support
* Animation support
* Typescript
* HTML and SVG
* Fine grain responsiveness

## Applications

* Responsive page layout
* Dashboards
* Organization charts
* Diagrams
* Games
* Animations
* Free form layout
