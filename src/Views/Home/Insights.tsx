import React from 'react';
import { usePaginationFragment } from 'react-relay/hooks';
import { graphql } from 'babel-plugin-relay/macro';
import { IHash, sortHashBy, loading } from '../../utils';
import { InsightsQuery$key } from './__generated__/InsightsQuery.graphql';
import { Button, Grid, Typography } from '@material-ui/core';
import { useAsyncTask, useAsyncRun } from 'react-hooks-async';
import ContentGraphs from './ContentGraphs';

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
  const ranking: IHash<Array<number>> = {};

  array.forEach((el) => {
    if (el && el.author && el.author.user) {
      if (el.author.user.login in ranking) {
        const temp: Array<number> = ranking[el.author.user.login];
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

const parseData = async (
  { signal }: { signal: any },
  edges: ReadonlyArray<{
    readonly node: {
      readonly oid: unknown;
      readonly messageHeadline: string;
      readonly author: {
        readonly user: {
          readonly login: string;
        } | null;
      } | null;
      readonly committedDate: unknown;
      readonly additions: number;
      readonly deletions: number;
    } | null;
  } | null>,
) => {
  const { node: parseddata }: Node = { node: [] };
  console.log(edges.length);
  edges.forEach((el) => {
    if (el) {
      parseddata.push(el.node);
    }
  });

  const ranking: IHash<Array<number>> = createRanking({ node: parseddata });
  const array1 = sortHashBy(
    ranking,
    (a, b) => {
      return a[1] - b[1];
    },
    false,
  );

  const array2 = sortHashBy(
    ranking,
    (a, b) => {
      return a[2] - b[2];
    },
    false,
  );

  const array3 = sortHashBy(
    ranking,
    (a, b) => {
      return a[3] - b[3];
    },
    false,
  );

  return { byCommits: array1, byAdditions: array2, byDeletions: array3 };
};

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
          edges {
            node {
              author {
                user {
                  login
                }
              }
              additions
              deletions
            }
          }
        }
      }
    `,
    history,
  );

  const task = useAsyncTask(parseData);
  useAsyncRun(task, data.history.edges!!);
  const { pending, error, result } = task;

  if (pending) {
    return loading();
  }

  if (error) {
    return <Typography>Falha tratando os dados</Typography>;
  }

  return (
    <Grid
      container
      spacing={2}
      style={{
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 16,
        paddingRight: 16,
      }}
    >
      <Grid item xs={12}>
        <ContentGraphs
          data={result!!}
          totalCount={data.history.totalCount}
          dataTotal={data.history.edges!!.length}
        />
      </Grid>
      <Grid item xs={12}>
        {hasNext ? (
          <Button variant="contained" onClick={() => loadNext(100)}>
            Load more
          </Button>
        ) : null}
      </Grid>
    </Grid>
  );
};
