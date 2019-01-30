# React Layout Generator

*React-layout-generator (RLG) is exploring a layout system that uses React to compute the layouts directly.*

RLG allows both dynamic and responsive layout. It is general purpose, supports both html and svg*, and allows precise and continuous control for responsive layouts. Major features include template support, animation support including custom engines, persistance support, built-in editor with position and size editing, fine grain responsiveness, top down design, drag and drop, and layers support.

\* For SVG to be more than an icon generator or canvas in React it needs to know position and size along with relationships. RLG makes this easy. For example to use svg to generate a line connecting two react components requires access to the layout details of both components. It also needs to assume that it and the two components layout will not change. This can be done in React but small changes in layout can easily break the assumption. In RLG you just link the two components.

## Examples

Live examples (TODO). 

## Documentation

See [docs](https://chetmurphy.github.io/react-layout-generator/).

## Install

Use either npm or yarn to install.

```ts
yarn add react-layout-generator

or

npm install react-layout-generator
```

You can also clone or fork the project to evaluate. To run locally follow these steps: 1) cd to the \<directory\> where you installed RLG, 2) run npm install or yarn, 3) cd to the examples directory, 4) run npm install or yarn, and 4) yarn start (to build the examples).

## Features

* Top down design of pages
* Edit and runtime support
* Persistence
* Template support
* Animation support
* HTML and SVG
* Fine grain responsiveness
* Layers with support for grouping, reordering, hiding, and animation
* Drag and drop

## Applications

* Responsive page layout
* Dashboards
* Organization charts
* Diagrams
* Games
* Animations
* Free form layout
