/// <reference types="react-scripts" />
/**
 * Needed for babel to work
 */
declare module 'babel-plugin-relay/macro' {
  export { graphql } from 'react-relay';
}
