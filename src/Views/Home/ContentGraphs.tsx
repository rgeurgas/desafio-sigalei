import React from 'react';
import { Grid, Typography, Card, CardContent } from '@material-ui/core';
import { Histogram } from './Histogram';

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
    <Grid container spacing={2}>
      <Grid item xs={12} lg={6}>
        <Card>
          <CardContent>
            <Typography>Gráfico dos 10 usuários com mais commits</Typography>
            <Histogram data={data.byCommits.slice(0, 10)} pos={1} />
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} lg={6}>
        <Card>
          <CardContent>
            <Typography>
              Gráfico dos 10 usuários com mais adições de linhas de código
            </Typography>
            <Histogram data={data.byAdditions.slice(0, 10)} pos={2} />
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} lg={6}>
        <Card>
          <CardContent>
            <Typography>
              Gráfico dos 10 usuários com mais remoções de linhas de código
            </Typography>
            <Histogram data={data.byDeletions.slice(0, 10)} pos={3} />
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} lg={6}>
        <Card>
          <CardContent>
            <Typography>Número total de commits: {totalCount}</Typography>
            <Typography>
              Informações dos {dataTotal} commits carregados:
            </Typography>
            <Typography>Média de commits por usuário: {meanCommits}</Typography>
            <Typography>
              Média de adições de linhas por usuário: {meanAdditions}
            </Typography>
            <Typography>
              Média de remoções de linhas por usuário: {meanDeletions}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};
