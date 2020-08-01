import React, { useState } from 'react';
import { useLazyLoadQuery } from 'react-relay/hooks';
import { graphql } from 'babel-plugin-relay/macro';
import {
  HomeQuery,
  HomeQueryVariables,
} from './__generated__/HomeQuery.graphql';
import { Insights } from './Insights';
import { Typography } from '@material-ui/core';

export const Home = () => {
  const [branch, setBranch] = useState('master');
  const variables: HomeQueryVariables = { expression: branch };

  const { repository } = useLazyLoadQuery<HomeQuery>(
    graphql`
      query HomeQuery($expression: String = "master") {
        repository(name: "linux", owner: "torvalds") {
          name
          defaultBranchRef {
            id
          }
          object(expression: $expression) {
            ... on Commit {
              oid
              ...InsightsQuery
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

  return <Insights history={repository.object!!} />;
};
