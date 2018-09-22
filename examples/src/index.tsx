import * as React from 'react';
import { render} from 'react-dom';
import MyComponent from '../../src/components';

const App = () => (
    <MyComponent />
);

render(<App />, document.getElementById("root"));