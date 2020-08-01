import React, { useState } from 'react';
import { useLazyLoadQuery } from 'react-relay/hooks';
import { graphql } from 'babel-plugin-relay/macro';
import {
  CommitsQuery,
  CommitsQueryVariables,
} from './__generated__/CommitsQuery.graphql';
import { UserCommits } from './UserCommits';
import { Typography } from '@material-ui/core';

interface Props {
  user: string;
}

/**
 * Component that does the graphql query for repositories using the fragment UserCommitsQuery
 * @param user - User for filtering the commits
 */
export const Commits = ({ user }: Props) => {
  // Create state for changing the branch to search
  const [branch, setBranch] = useState('master');
  const variables: CommitsQueryVariables = { expression: branch };

  // Hook for the graphql query
  const { repository } = useLazyLoadQuery<CommitsQuery>(
    graphql`
      query CommitsQuery($expression: String = "master") {
        repository(name: "linux", owner: "torvalds") {
          object(expression: $expression) {
            ... on Commit {
              oid
              ...UserCommitsQuery
            }
          }
        }
      }
    `,
    variables,
  );

  // If there is an error in the response
  if (!repository) {
    return <Typography>Error fetching data</Typography>;
  }

  return <UserCommits user={user as string} history={repository.object!!} />;
};
