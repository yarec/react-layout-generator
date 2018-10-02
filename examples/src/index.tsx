import * as React from 'react';
import { render } from 'react-dom';
import ReactLayout from '../../src/ReactLayout';
import LayoutGenerator, { IGridGenerator, mobileDashboard} from '../../src/LayoutGenerator';

interface ExampleProps {

}

interface ExampleState {
  
}

class ExampleLayout extends React.Component<ExampleProps, ExampleState> {

  g: LayoutGenerator;
  
  constructor(props: ExampleProps) {
    super(props);

    const args: IGridGenerator = {
      cols: 2,
      rows: 2,
      blockSize: { x: 200, y: 200 }
    };

    this.g = mobileDashboard(args)
  }

  render() {

    return (
      <ReactLayout autoFit={true} autoFitLimits={[.75, 1.25]} g={this.g}>
        <span key={1}>1</span>
        <span key={2}>2</span>
        <span key={3}>3</span>
        <span key={4}>4</span>
      </ReactLayout>
    );
  }
}

render(<ExampleLayout />, document.getElementById("root"));