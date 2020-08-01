import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  makeWidthFlexible,
  XYPlot,
  VerticalBarSeries,
  XAxis,
  YAxis,
  VerticalBarSeriesPoint,
  ChartLabel,
} from 'react-vis';

interface Props {
  data: Array<any>;
  pos: number;
  ylabel: string;
}

const FlexibleXYPlot = makeWidthFlexible(XYPlot);

export const Histogram = ({ data, pos, ylabel }: Props) => {
  const [hovering, setHovering] = useState(false);
  const history = useHistory();

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
    <FlexibleXYPlot height={300} padding color="#3f51b5">
      <VerticalBarSeries
        style={hovering ? { cursor: 'pointer' } : {}}
        barWidth={0.5}
        data={matrixData}
        onValueMouseOver={(datapoint, event) => {
          if (!hovering) setHovering(true);
        }}
        onValueMouseOut={(datapoint, event) => {
          if (hovering) setHovering(false);
        }}
        onValueClick={(el: VerticalBarSeriesPoint) => {
          if (el.x !== null) {
            history.push(`/commits?user=${nameData[el.x as number]}`);
          }
        }}
      />
      <XAxis
        tickFormat={(x) => {
          return nameData[x];
        }}
      />
      <YAxis tickTotal={10} tickPadding={0} />
      <ChartLabel text={'Usuário'} xPercent={0.5} yPercent={0.85} />
      <ChartLabel
        text={ylabel}
        xPercent={0.015}
        yPercent={0.3}
        style={{
          transform: 'rotate(-90)',
          textAnchor: 'end',
        }}
      />
    </FlexibleXYPlot>
  );
};
