import React from 'react';
import { Grid, CircularProgress } from '@material-ui/core';

/**
 * Interface for Hash types
 */
export interface IHash<T> {
  [details: string]: T;
}

/**
 * Formats string date into locale format
 * @param date - Date to format
 * @returns {string} Locale converted string
 */
export function formatDate(date: string) {
  const ndate = new Date(date);
  return ndate.toLocaleString();
}

/**
 * @returns {React.Component} Default loading Component
 */
export function loading() {
  return (
    <Grid container justify="center" alignItems="center">
      <CircularProgress />
    </Grid>
  );
}

/**
 * Transforms an Hash into an Array containing [key, ...data] then sorts data
 * @param hash - Hash to be converted
 * @param compareFn - Function used to sort data
 * @param {boolean} [asc=true] - If resulting array will be ascending
 * @returns {Arrau<Array<any>>} Sorted array containing [key, ...data]
 */
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

/**
 * Interface for Errors
 */
interface ErrorBoundaryState {
  error: Error | null;
}

/**
 * Default error boundary Component
 */
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
