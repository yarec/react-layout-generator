import * as React from 'react';
import { render } from 'react-dom';
import ReactLayout from '../../../src/ReactLayout';
import { IGenerator } from '../../../src/generators/Generator';
import RLGDesktop from '../../../src/generators/RLGDesktop';


interface ExampleProps {
  name?: string;

}
export default class Example extends React.PureComponent<ExampleProps> {
  render = () => {
    return (
      <div>
        <button style={{ width: '120' }}>{this.props.name}</button>
      </div>
    )
  }
}

interface DesktopLayoutProps {}

class DesktopLayout extends React.Component<DesktopLayoutProps> {

  g: IGenerator;

  constructor(props: DesktopLayoutProps) {
    super(props);

    this.g = RLGDesktop('rlg.desktop.example');

    const p = this.g.params();

    // Set variables to 0 to hide section
    p.set('titleHeight', 0);
    p.set('headerHeight', 24);
    p.set('footerHeight', 24);
    p.set('leftSideWidth', 200);
    p.set('rightSideWidth', 200);

    // Show full width header and footer
    p.set('fullWidthHeaders', 1);
  }

  render() {

    return (
      <>
        <ReactLayout
          name={'reactLayout.desktop.example'}
          editLayout={true}
          g={this.g}
        >
          <div data-layout={{ name: 'leftSide' }} style={{ backgroundColor: 'hsl(200,100%,80%)' }} >
            <span>Header</span>
            <ul>
              <li>Drag the right side of this container to change its width</li>
              <li>Set the value of 'leftSideWidth' to 0 to hide all the time</li>
              <li>Shrink the size of the browser window to responsively hide the sidebars</li>
            </ul>
          </div>

          <div data-layout={{ name: 'header' }} style={{ backgroundColor: 'hsl(210,100%,80%)' }} >
            <span>Header</span>
          </div>

          <div data-layout={{ name: 'footer' }} style={{ backgroundColor: 'hsl(210,100%,80%)' }} >
            <span>Footer</span>
          </div>

          <div data-layout={{ name: 'content' }} style={{ backgroundColor: 'hsl(215,100%,80%)' }}>
            <span>Content</span>
          </div>

          <div data-layout={{ name: 'rightSide' }} style={{ backgroundColor: 'hsl(200,100%,80%)' }} >
            <span>rightSide</span>
            <i>Drag the left side of this container to change its width.</i>
          </div>
        </ReactLayout>
      </>
    );
  }
}

render(<DesktopLayout />, document.getElementById("root"));


