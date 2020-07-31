import React from 'react';
import { XYPlot, VerticalBarSeries, XAxis, YAxis } from 'react-vis';

interface Props {
  data: Array<any>;
  pos: number;
}

export const Histogram = ({ data, pos }: Props) => {
  const matrixData = data.map((el, index) => {
    return {
      x: index,
      y: el[pos],
    };
  });

  const nameData: Array<string> = data.map((el) => {
    return el[0];
  });

  return (
    <XYPlot width={700} height={300}>
      <VerticalBarSeries barWidth={0.5} data={matrixData} style={{}} />
      <XAxis
        tickFormat={(x) => {
          return nameData[x];
        }}
      />
      <YAxis />
    </XYPlot>
  );
};
