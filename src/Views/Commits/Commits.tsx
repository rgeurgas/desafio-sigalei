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

export const Commits = ({ user }: Props) => {
  const [branch, setBranch] = useState('master');
  const variables: CommitsQueryVariables = { expression: branch };

  const { repository } = useLazyLoadQuery<CommitsQuery>(
    graphql`
      query CommitsQuery($expression: String = "master") {
        repository(name: "linux", owner: "torvalds") {
          name
          defaultBranchRef {
            id
          }
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

  if (!repository) {
    return <Typography>Error fetching data</Typography>;
  }

  return <UserCommits user={user as string} history={repository.object!!} />;
};
