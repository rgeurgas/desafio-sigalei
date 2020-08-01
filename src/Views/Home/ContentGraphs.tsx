import React from 'react';
import {
  Grid,
  Typography,
  Card,
  CardContent,
  Divider,
} from '@material-ui/core';

interface Props {
  totalCount: number;
  dataTotal: number;
  data: any[][];
}

/**
 * Component that creates two cards for showing general data
 * @param totalCount - Number of commits in the repository
 * @param dataTotal - Number of commits fetched with the graphql query
 * @param data - Matrix with the first column being the name of the user, the second how many commits, the third how many additions and the fourth how many deletions they have
 */
export default ({ totalCount, dataTotal, data }: Props) => {
  // Calculate the mean of the
  const sum = data.reduce(
    (a, b) => ['', a[1] + b[1], a[2] + b[2], a[3] + b[3]],
    ['', 0, 0, 0],
  );
  const meanCommits = sum[1] / data.length;
  const meanAdditions = sum[2] / data.length;
  const meanDeletions = sum[3] / data.length;

  return (
    <Grid item xs={12} lg={6} style={{ padding: 8 }}>
      <Grid container>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography>
                Informações dos {dataTotal} commits carregados:
              </Typography>
              <Divider />
              <Typography variant="body2">
                Número de usuários: {data.length}
              </Typography>
              <Typography variant="body2">
                Média de commits por usuário: {meanCommits.toFixed(2)}
              </Typography>
              <Typography variant="body2">
                Média de adições de linhas por usuário:{' '}
                {meanAdditions.toFixed(2)}
              </Typography>
              <Typography variant="body2">
                Média de remoções de linhas por usuário:{' '}
                {meanDeletions.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} style={{ paddingTop: 16 }}>
          <Card>
            <CardContent>
              <Typography>
                Número total de commits no repositório: {totalCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Grid>
  );
};
