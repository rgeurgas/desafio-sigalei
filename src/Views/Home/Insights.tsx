import React from 'react';
import { usePaginationFragment } from 'react-relay/hooks';
import { graphql } from 'babel-plugin-relay/macro';
import { IHash } from '../../utils';
import { InsightsQuery$key } from './__generated__/InsightsQuery.graphql';

interface Props {
  history: InsightsQuery$key;
}

interface Node {
  node: Array<
    | {
        oid: unknown;
        messageHeadline: string;
        author: { user: { login: string } | null } | null;
        committedDate: unknown;
        additions: number;
        deletions: number;
      }
    | null
    | undefined
  >;
}

function createRanking({ node: array }: Node) {
  const ranking: IHash = {};

  array.forEach((el) => {
    if (el && el.author && el.author.user) {
      if (el.author.user.login in ranking) {
        const temp = ranking[el.author.user.login];
        ranking[el.author.user.login] = [
          temp[0] + 1,
          temp[1] + el.additions,
          temp[2] + el.deletions,
        ];
      } else {
        ranking[el.author.user.login] = [1, el.additions, el.deletions];
      }
    }
  });

  return ranking;
}

export const Insights = ({ history }: Props) => {
  const { data, hasNext, loadNext, isLoadingNext } = usePaginationFragment(
    graphql`
      fragment InsightsQuery on Commit
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 100 }
          cursor: { type: "String" }
        )
        @refetchable(queryName: "InsightsPaginationQuery") {
        history(first: $count, after: $cursor, since: "2020-01-01T00:00:00Z")
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

  const { node: parseddata }: Node = { node: [] };
  data.history.edges!!.forEach((el) => {
    if (el) {
      parseddata.push(el.node);
    }
  });

  const ranking = createRanking({ node: parseddata });

  return (
    <div>
      {}
      {hasNext ? (
        <button disabled={isLoadingNext} onClick={() => loadNext(100)}>
          {isLoadingNext ? 'Loading...' : 'Load more'}
        </button>
      ) : null}
    </div>
  );
};
