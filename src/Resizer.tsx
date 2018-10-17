/* import * as React from 'react';
import { IPoint } from './types';

// const { div } = React.DOM;

interface ResizeProps {
  onResize: (delta: number) => void;
  direction?: string;
};

interface ResizeState {
};

export default class Resize extends React.Component<ResizeProps, ResizeState> {
  // displayName: 'Resizer'

  // propTypes:
  //   className: React.PropTypes.string
  //   handleClassName: React.PropTypes.string
  //   direction: React.PropTypes.string
  //   onResizeStart: React.PropTypes.func
  //   onResize: React.PropTypes.func.isRequired
  //   onResizeEnd: React.PropTypes.func

  // getDefaultProps: ->
  //   className: ''
  //   handleClassName: ''
  //   direction: 'x'

  direction: string = 'x';
  current: IPoint = {
    x: 0,
    y: 0
  };
  startPosition: IPoint = {
    x: 0,
    y: 0
  };

  constructor(props: ResizeProps) {
    super(props);
  }

  componentWillUnmount = () => {

  }


  _handleMouseMove = (e: React.MouseEvent) => {
    e.preventDefault()
    if (this.props.direction === 'x') {
      const diff = this.startPosition.x - e.clientX

      if (diff)
        this.props.onResize(this.startPosition.x - e.clientX)
    }

    if (this.props.direction === 'y') {
      const diff = this.startPosition.y - e.clientY

      if (diff) {
        this.props.onResize(this.startPosition.y - e.clientY);
      }

      @_updateStartPosition(e)
    }
  }

  _handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    this.props.onResizeStart (e);
    this._updateStartPosition(e);
    window.addEventListener('mouseup', this._handleMouseUp);
    window.addEventListener('mousemove', this._handleMouseMove);
  }

  _handleMouseUp = (e: React.MouseEvent) => {
    this.props.onResizeEnd(e);
    this._removeListeners();
  }

  _removeListeners = () => {
    window.removeEventListener('mouseup', this._handleMouseUp);
    window.removeEventListener('mousemove', this._handleMouseMove);
  }

  _updateStartPosition = (e: React.MouseEvent) => {
    this.startPosition.x = e.clientX
    this.startPosition.y = e.clientY
  }

  render = () => {
    return (<div style={} >
      <div onMouseDown={this._handleMouseDown} >
      </div>
      {this.props.children}
    </div>
    );
  }
}
}

 */