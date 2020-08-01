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
  data: {
    byCommits: any[][];
    byAdditions: any[][];
    byDeletions: any[][];
  };
}

export default ({ totalCount, dataTotal, data }: Props) => {
  const sum = data.byCommits.reduce(
    (a, b) => ['', a[1] + b[1], a[2] + b[2], a[3] + b[3]],
    ['', 0, 0, 0],
  );
  const meanCommits = sum[1] / data.byCommits.length;
  const meanAdditions = sum[2] / data.byCommits.length;
  const meanDeletions = sum[3] / data.byCommits.length;

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
                Número de usuários: {data.byCommits.length}
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
