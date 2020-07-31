import React from 'react';
import {
  makeWidthFlexible,
  XYPlot,
  VerticalBarSeries,
  XAxis,
  YAxis,
} from 'react-vis';

interface Props {
  data: Array<any>;
  pos: number;
}

const FlexibleXYPlot = makeWidthFlexible(XYPlot);

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
    <FlexibleXYPlot height={300} padding>
      <VerticalBarSeries barWidth={0.5} data={matrixData} style={{}} />
      <XAxis
        tickFormat={(x) => {
          return nameData[x];
        }}
      />
      <YAxis tickTotal={10} tickPadding={4} />
    </FlexibleXYPlot>
  );
};
