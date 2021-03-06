import React from 'react';
import { Route } from 'react-router';
import { Grid, Typography, Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

interface Props {
  code: number;
  children: React.ReactNode;
}

/**
 * @param code - Error code
 */
const Status = ({ code, children }: Props) => (
  <Route
    render={({ staticContext }) => {
      if (staticContext) staticContext.statusCode = code;
      return children;
    }}
  />
);

/**
 * Component that shows error on invalid route
 */
export default () => {
  // Hook for routing
  const history = useHistory();

  return (
    <Status code={404}>
      <Grid container direction="column" justify="center" alignItems="center">
        <Typography variant="h1">Oops!</Typography>
        <Typography>Looks like you're lost...</Typography>
        <Button
          variant="contained"
          onClick={() => {
            history.push('/');
          }}
        >
          Guide me to the right path!
        </Button>
      </Grid>
    </Status>
  );
};
