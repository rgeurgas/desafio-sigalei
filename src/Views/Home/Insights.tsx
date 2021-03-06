import React from 'react';
import { usePaginationFragment } from 'react-relay/hooks';
import { graphql } from 'babel-plugin-relay/macro';
import { IHash, sortHashBy } from '../../utils';
import { Histogram } from './Histogram';
import { InsightsQuery$key } from './__generated__/InsightsQuery.graphql';
import { Button, Grid, Typography, Card, CardContent } from '@material-ui/core';
import { useAsyncTask, useAsyncRun } from 'react-hooks-async';
import ContentGraphs from './ContentGraphs';

interface Props {
  history: InsightsQuery$key;
}

/**
 * Interface representing the graphql query node
 */
interface Node {
  node: Array<
    | {
        author: { user: { login: string } | null } | null;
        additions: number;
        deletions: number;
      }
    | null
    | undefined
  >;
}

/**
 * Converts and array of nodes from the graphql query into and array counting how many
 * nodes are from the same user and how many additions and deletions he made in total
 * @param node - Array of nodes containing author, additions and deletions
 * @returns Hash with key being the username and data being [commits, additions, deletions]
 */
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

/**
 * Parse data from the graphql query into arrays sorted by how many commits, how many additions
 * and how many deletions the user did
 * @param edges - Graphql edges
 * @returns Commits sorted by different criterias
 */
const parseData = async (
  { signal }: { signal: any },
  edges: ReadonlyArray<{
    readonly node: {
      readonly author: {
        readonly user: {
          readonly login: string;
        } | null;
      } | null;
      readonly additions: number;
      readonly deletions: number;
    } | null;
  } | null>,
) => {
  const { node: parseddata }: Node = { node: [] };
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

/**
 * Component that queries 100 commits initially then queries 100 more each time
 * the user clicks the button
 * @param history - History object from graphql query
 */
export const Insights = ({ history }: Props) => {
  // Create pagination fragment from relay modern to declare data requirements for the query
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

  // Parse data from graphql query asynchronously to not freeze the webpage
  const task = useAsyncTask(parseData);
  useAsyncRun(task, data.history.edges!!);
  const { pending, error, result } = task;

  // If not pending or error rerender the insights and disable button if it is loading
  return (
    <div>
      {!pending && !error ? (
        <Grid
          container
          style={{
            padding: 8,
          }}
        >
          <ContentGraphs
            data={result!!.byCommits}
            totalCount={data.history.totalCount}
            dataTotal={data.history.edges!!.length}
          />

          <Grid item xs={12} lg={6} style={{ padding: 8 }}>
            <Card>
              <CardContent>
                <Typography align="center">
                  Gráfico dos 10 usuários com mais commits
                </Typography>
                <Histogram
                  data={result!!.byCommits.slice(0, 10)}
                  pos={1}
                  ylabel={'Commits'}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} lg={6} style={{ padding: 8 }}>
            <Card>
              <CardContent>
                <Typography align="center">
                  Gráfico dos 10 usuários com mais adições de linhas de código
                </Typography>
                <Histogram
                  data={result!!.byAdditions.slice(0, 10)}
                  pos={2}
                  ylabel={'Adições'}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} lg={6} style={{ padding: 8 }}>
            <Card>
              <CardContent>
                <Typography align="center">
                  Gráfico dos 10 usuários com mais remoções de linhas de código
                </Typography>
                <Histogram
                  data={result!!.byDeletions.slice(0, 10)}
                  pos={3}
                  ylabel={'Remoções'}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : null}
      {hasNext ? (
        <Grid
          container
          style={{
            paddingTop: 8,
            paddingBottom: 8,
            paddingLeft: 16,
            paddingRight: 16,
          }}
        >
          <Button
            fullWidth
            variant="contained"
            disabled={isLoadingNext}
            color="primary"
            onClick={() => loadNext(100)}
          >
            {isLoadingNext || pending ? 'Carregando...' : 'Carregar mais dados'}
          </Button>
        </Grid>
      ) : null}
    </div>
  );
};
