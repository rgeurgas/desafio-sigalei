import { graphql } from 'babel-plugin-relay/macro';

export default graphql`
  query HomeQuery {
    repository(name: "linux", owner: "torvalds") {
      name
      defaultBranchRef {
        id
      }
    }
  }
`;
