import React, { useState } from 'react';
import { useLazyLoadQuery } from 'react-relay/hooks';
import { graphql } from 'babel-plugin-relay/macro';
import {
  HomeQuery,
  HomeQueryVariables,
} from './__generated__/HomeQuery.graphql';
import { Insights } from './Insights';
import { Typography } from '@material-ui/core';

/**
 * Component that does the graphql query for repositories using the fragment InsightsQuery
 */
export const Home = () => {
  // Create state for changing the branch to search
  const [branch, setBranch] = useState('master');
  const variables: HomeQueryVariables = { expression: branch };

  // Hook for the graphql query
  const { repository } = useLazyLoadQuery<HomeQuery>(
    graphql`
      query HomeQuery($expression: String = "master") {
        repository(name: "linux", owner: "torvalds") {
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

  // If there is an error in the response
  if (!repository) {
    return <Typography>Error fetching data</Typography>;
  }

  return <Insights history={repository.object!!} />;
};
