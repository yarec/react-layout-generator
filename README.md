This component is a static and dynamic adaptable Layout generator for react.

## LayoutGenerator

This is the core internal generator class. It is a state machine that generates a sequence of blocks that can be used to define the location of an element.

```javascript
export interface ILayoutGenerator {
  reset: () => void;
  next: () => IBlock | undefined;
  lookup: (name: string) => IBlock | undefined;
}
```

The default generator allows the defintion of simple layouts. 

A generator instance is defined by using a generator function. For example the following will geneerate a mobile dashboard.

