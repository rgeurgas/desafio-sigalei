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

// Makes the graph has a responsive width
const FlexibleXYPlot = makeWidthFlexible(XYPlot);

/**
 * Component that creates a histogram using the first column and another chosen column
 * of an matrix matrix and links the bar of the histogram to the user page for more
 * information
 * @param data - Matrix being the first column strings and the rest numbers
 * @param pos - Column for the y axis
 * @param ylabel - Label for the y axis
 */
export const Histogram = ({ data, pos, ylabel }: Props) => {
  // Change mouse pointer while hovering the histogram bars
  const [hovering, setHovering] = useState(false);
  // Hook for routing
  const history = useHistory();

  // Formats data for the histogram
  const matrixData = data.map((el, index) => {
    return {
      x: index,
      y: el[pos],
    };
  });

  // Strings for the y axis
  const nameData: Array<string> = data.map((el) => {
    return el[0];
  });

  return (
    <FlexibleXYPlot height={300} padding>
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
