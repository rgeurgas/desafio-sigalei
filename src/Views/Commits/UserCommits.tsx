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
  Box,
} from '@material-ui/core';
import { useAsyncTask, useAsyncRun } from 'react-hooks-async';
import { UserCommitsQuery$key } from './__generated__/UserCommitsQuery.graphql';
import { formatDate } from '../../utils';

interface Props {
  history: UserCommitsQuery$key;
  user: string;
}

/**
 * Interface representing the graphql query node
 */
interface Node {
  node: Array<
    | {
        oid: unknown;
        abbreviatedOid: unknown;
        message: string;
        author: { user: { login: string } | null } | null;
        committedDate: unknown;
        additions: number;
        deletions: number;
      }
    | null
    | undefined
  >;
}

/**
 * Parse data from the graphql query into an array with only commits made by the user
 * @param edges - Graphql edges
 * @param user - User for filtering the commits
 * @returns Commits made by the user
 */
const parseData = async (
  { signal }: { signal: any },
  edges: ReadonlyArray<{
    readonly node: {
      readonly oid: unknown;
      readonly abbreviatedOid: unknown;
      readonly message: string;
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

/**
 * Component that queries 100 commits initially then queries 100 more each time
 * the user clicks the button
 * @param history - History object from graphql query
 * @param user - User that we want the commits from
 */
export const UserCommits = ({ history, user }: Props) => {
  // Create pagination fragment from relay modern to declare data requirements for the query
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
              message
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

  // Parse data from graphql query asynchronously to not freeze the webpage
  const task = useAsyncTask(parseData);
  useAsyncRun(task, data.history.edges!!, user);
  const { pending, error, result } = task;

  // If no valid commit of the user was found
  if (result && result.length === 0) {
    return <Typography>Não foi encontrado commits deste usuário</Typography>;
  }

  // If not pending or error rerender the table and disable button if it is loading
  return (
    <div style={{ padding: 8 }}>
      {!pending && !error ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography>
                    <Box fontWeight="fontWeightBold">abbreviatedOid</Box>
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>
                    <Box fontWeight="fontWeightBold">additions</Box>
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>
                    <Box fontWeight="fontWeightBold">deletions</Box>
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>
                    <Box fontWeight="fontWeightBold">committedDate</Box>
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>
                    <Box fontWeight="fontWeightBold">message</Box>
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {result!!.map((row) => (
                <TableRow key={row!!.node!!.oid as string}>
                  <TableCell component="th" scope="row">
                    {row!!.node!!.abbreviatedOid as string}
                  </TableCell>
                  <TableCell>{row!!.node!!.additions}</TableCell>
                  <TableCell>{row!!.node!!.deletions}</TableCell>
                  <TableCell>
                    {formatDate(row!!.node!!.committedDate as string)}
                  </TableCell>
                  <TableCell>{row!!.node!!.message}</TableCell>
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
