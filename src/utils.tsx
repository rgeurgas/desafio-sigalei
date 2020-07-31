import React from 'react';
import { Grid, CircularProgress } from '@material-ui/core';

export interface IHash<T> {
  [details: string]: T;
}

export function loading() {
  return (
    <Grid container justify="center" alignItems="center">
      <CircularProgress />
    </Grid>
  );
}

export function sortHashBy(
  hash: IHash<any>,
  compareFn: (a: any, b: any) => number,
  asc: boolean = true,
) {
  const array: Array<Array<any>> = [];

  for (let key in hash) {
    const obj = hash[key];
    array.push([key]);
    if (obj instanceof Array) {
      obj.forEach((el) => {
        array[array.length - 1].push(el);
      });
    } else {
      array[array.length - 1].push(obj);
    }
  }

  array.sort(compareFn);
  if (!asc) {
    array.reverse();
  }

  return array;
}

export function getConnectionNodes<T>(
  connectionObj: Array<T | null> | null,
): Array<T> {
  let ret: Array<T> = [];
  if (connectionObj && connectionObj.length > 0) {
    connectionObj.forEach((el) => {
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
