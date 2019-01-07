import * as React from 'react';
interface IErrorBoundaryProps {
}
interface IErrorBoundaryState {
    hasError: boolean;
}
export default class ErrorBoundary extends React.Component<IErrorBoundaryProps, IErrorBoundaryState> {
    static getDerivedStateFromError(error: string): {
        hasError: boolean;
    };
    constructor(props: IErrorBoundaryProps);
    componentDidCatch(error: Error, info: React.ErrorInfo): void;
    render(): {} | null | undefined;
}
export {};
