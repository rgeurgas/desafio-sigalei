import React from 'react';
import { usePaginationFragment } from 'react-relay/hooks';
import { graphql } from 'babel-plugin-relay/macro';
import {
  Button,
  Grid,
  Table,
  Typography,
  Paper,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@material-ui/core';
import { useAsyncTask, useAsyncRun } from 'react-hooks-async';
import { UserCommitsQuery$key } from './__generated__/UserCommitsQuery.graphql';

interface Props {
  history: UserCommitsQuery$key;
  user: string;
}

interface Node {
  node: Array<
    | {
        oid: unknown;
        abbreviatedOid: unknown;
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

const parseData = async (
  { signal }: { signal: any },
  edges: ReadonlyArray<{
    readonly node: {
      readonly oid: unknown;
      readonly abbreviatedOid: unknown;
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
  user: string,
) => {
  const { node: parseddata }: Node = { node: [] };
  edges.forEach((el) => {
    if (el) {
      parseddata.push(el.node);
    }
  });

  return edges.filter((el) => {
    if (el && el.node && el.node.author && el.node.author.user) {
      return el.node.author.user.login === user;
    }
    return false;
  });
};

export const UserCommits = ({ history, user }: Props) => {
  const { data, hasNext, loadNext, isLoadingNext } = usePaginationFragment(
    graphql`
      fragment UserCommitsQuery on Commit
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 100 }
          cursor: { type: "String" }
        )
        @refetchable(queryName: "UserCommitsPaginationQuery") {
        history(first: $count, after: $cursor, since: "2020-01-01T00:00:00Z")
          @connection(key: "UserCommits_history") {
          totalCount
          edges {
            node {
              oid
              abbreviatedOid
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

  const task = useAsyncTask(parseData);
  useAsyncRun(task, data.history.edges!!, user);
  const { pending, error, result } = task;

  if (result && result.length === 0) {
    return <Typography>Não foi encontrado commits deste usuário</Typography>;
  }

  return (
    <div style={{ padding: 8 }}>
      {!pending && !error ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>abbreviatedOid</TableCell>
                <TableCell align="right">additions</TableCell>
                <TableCell align="right">deletions</TableCell>
                <TableCell align="right">committedDate</TableCell>
                <TableCell align="right">messageHeadline</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {result!!.map((row) => (
                <TableRow key={row!!.node!!.oid as string}>
                  <TableCell component="th" scope="row">
                    {row!!.node!!.abbreviatedOid as string}
                  </TableCell>
                  <TableCell align="right">{row!!.node!!.additions}</TableCell>
                  <TableCell align="right">{row!!.node!!.deletions}</TableCell>
                  <TableCell align="right">
                    {row!!.node!!.committedDate as string}
                  </TableCell>
                  <TableCell align="right">
                    {row!!.node!!.messageHeadline}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : null}
      {hasNext ? (
        <Grid
          container
          style={{
            paddingTop: 8,
            paddingBottom: 8,
          }}
        >
          <Button
            fullWidth
            variant="contained"
            disabled={isLoadingNext}
            color="primary"
            onClick={() => loadNext(100)}
          >
            {isLoadingNext || pending ? 'Loading...' : 'Load more'}
          </Button>
        </Grid>
      ) : null}
    </div>
  );
};
