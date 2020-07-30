import React from 'react';
import { usePaginationFragment } from 'react-relay/hooks';
import { graphql } from 'babel-plugin-relay/macro';
import { getConnectionNodes } from '../../utils';
import { InsightsPaginationQuery } from './__generated__/InsightsPaginationQuery.graphql';
import { InsightsQuery$key } from './__generated__/InsightsQuery.graphql';

interface Props {
  history: InsightsQuery$key;
}

export const Insights = ({ history }: Props) => {
  const { data, hasNext, loadNext, isLoadingNext } = usePaginationFragment<
    InsightsPaginationQuery,
    any
  >(
    graphql`
      fragment InsightsQuery on Commit
        @argumentDefinitions(
          first: { type: "Int!", defaultValue: 5 }
          after: { type: "String" }
        )
        @refetchable(queryName: "InsightsPaginationQuery") {
        history(first: $first, after: $after, since: "2020-01-01T00:00:00Z")
          @connection(key: "Insights_history") {
          totalCount
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node {
              oid
              messageHeadline
              author {
                user {
                  login
                }
              }
              committedDate
              additions
              deletions
            }
          }
        }
      }
    `,
    history,
  );
  console.log(data);

  return (
    <div>
      {}
      {hasNext ? (
        <button disabled={isLoadingNext} onClick={() => loadNext(5)}>
          {isLoadingNext ? 'Loading...' : 'Load more'}
        </button>
      ) : null}
    </div>
  );
};
