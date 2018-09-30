import * as React from 'react';
import LayoutGenerator from './LayoutGenerator';

export interface ReactLayoutProps extends React.HTMLProps<HTMLDivElement> {
  autoFit: boolean;
  autoFitLimits: [number, number];
  g: LayoutGenerator;

}

export interface ReactLayoutState {

}

export default class ReactLayout extends React.Component<ReactLayoutProps, ReactLayoutState> {
  
  constructor(props: ReactLayoutProps) {
    super(props);
  }

  createChildren = () => {

  }

  render(): React.ReactNode {

    return null;
    
  }
}