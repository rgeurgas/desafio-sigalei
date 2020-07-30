import React from 'react';
import { useLazyLoadQuery } from 'react-relay/hooks';
import { graphql } from 'babel-plugin-relay/macro';
import { HomeQuery } from './__generated__/HomeQuery.graphql';
import { Insights } from './Insights';

interface Props {
  expression: string;
}

export const Home = ({ expression }: Props) => {
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
    {
      expression,
    },
  );

  if (!repository) {
    return <div>hm</div>;
  }

  return <Insights history={repository.object!!} />;
};
