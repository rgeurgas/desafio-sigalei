import React from 'react';

export function getConnectionNodes<T>(connectionObj: {
  edges: Array<T | null> | null;
}): Array<T> {
  let ret: Array<T> = [];
  if (connectionObj && connectionObj.edges && connectionObj.edges.length > 0) {
    connectionObj.edges.forEach((el) => {
      if (el) {
        ret.push(el);
      }
    });
  }
  return ret;
}

interface ErrorBoundaryState {
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  {
    children: React.ReactNode;
    fallback: (error: Error) => any;
  },
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    error: null,
  };

  componentDidCatch(error: Error) {
    this.setState({ error: error });
  }

  render() {
    const { children, fallback } = this.props;
    const { error } = this.state;

    if (error) {
      return React.createElement(fallback, error);
    }

    return children;
  }
}
