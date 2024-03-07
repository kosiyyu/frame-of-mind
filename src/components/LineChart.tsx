import React from 'react';
import { Svg, Path, Rect, Line, Text, Defs, LinearGradient, Stop } from 'react-native-svg';

export type Point = {
  x: number;
  y: number;
}

interface LineChartProps {
  data: Point[];
  xLabel: string[];
  yLabel: string[];

  lineWidth: number;
  width: number;
  height: number;

  backgroundColor: string;
  xLineColor: string;
  yLineColor: string;
  lineColor: string;
  gridColor: string;
  gradientStartColor: string;
  gradientEndColor: string;
  xLabelTextColor: string;
  yLabelTextColor: string;

  gradientStartOpacity: string;
  gradientEndOpacity: string;

  displayGrid: boolean;
}

const LineChart: React.FC<LineChartProps> = ({ data, xLabel, yLabel, lineWidth, width, height, backgroundColor, xLineColor, yLineColor, lineColor, gradientStartColor, gradientStartOpacity, gradientEndColor, gradientEndOpacity, gridColor, xLabelTextColor, yLabelTextColor, displayGrid }) => {
  if (data.length === 0) {
    return null;
  }

  const padding = 30;

  const maxY = Math.max(...data.map(p => p.y));
  const minY = Math.min(...data.map(p => p.y));

  // X scale point
  const xPoint = (point: Point) => (point.x * (width - 2 * padding)) / (data.length - 1) + padding;

  // Y scale point
  const yPoint = (point: Point) => height - padding - ((point.y - minY) / (maxY - minY)) * (height - 2 * padding);

  // Create a line path
  const linePath = data
    .map((point, i, arr) => {
      if (i === 0) return `M ${xPoint(point)} ${yPoint(point)}`;
      const prevPoint = arr[i - 1];
      const midPointX = (xPoint(prevPoint) + xPoint(point)) / 2;
      return `C ${midPointX} ${yPoint(prevPoint)}, ${midPointX} ${yPoint(point)}, ${xPoint(point)} ${yPoint(point)}`;
    })
    .join(' ');

  const gradientPath = `${linePath} V ${height - padding} H ${xPoint(data[0])} Z`;

  const yLabelOffset = 0;

  return (
    <Svg
      width={width}
      height={height}
    >
      <Rect
        width={width}
        height={height}
        fill={backgroundColor}
      />
      {displayGrid &&
        <>
          {yLabel.map((_, i) => (
            <Line
              key={i}
              x1={padding} y1={yPoint({ x: 0, y: i })}
              x2={width - padding} y2={yPoint({ x: 0, y: i })}
              stroke={gridColor}
            />
          ))}
          {xLabel.map((_, i) => (
            <Line
              key={i}
              x1={xPoint({ x: i, y: 0 })} y1={padding}
              x2={xPoint({ x: i, y: 0 })} y2={height - padding}
              stroke={gridColor}
            />
          ))}
        </>
      }
      <Path
        d={gradientPath}
        fill="url(#gradient)"
      />
      <Path
        d={linePath}
        fill="none"
        stroke={lineColor}
        strokeWidth={lineWidth}
      />
      <Line
        x1={padding} y1={height - padding}
        x2={width - padding} y2={height - padding}
        stroke={xLineColor}
      />
      <Line
        x1={padding} y1={height - padding}
        x2={padding} y2={padding}
        stroke={yLineColor}
      />
      {xLabel.map((label, i) => (
        <Text
          key={i}
          x={xPoint({ x: i, y: 0 })} y={height - padding / 2}
          textAnchor="middle"
          fill={xLabelTextColor}
          fontSize="14"
          fontWeight="bold"
          stroke={xLabelTextColor}
        >
          {label}
        </Text>
      ))}
      {yLabel.map((label, i) => (
        <Text
          key={i}
          x={padding / 2 - yLabelOffset} y={yPoint({ x: 0, y: i })}
          textAnchor="middle"
          fill={yLabelTextColor}
          fontSize="14"
          fontWeight="bold"
          stroke={yLabelTextColor}
        >
          {label}
        </Text>
      ))}
      <Defs>
        <LinearGradient
          id="gradient"
          x1="0" y1="0"
          x2="0" y2="1"
        >
          <Stop
            offset="0%"
            stopColor={gradientStartColor}
            stopOpacity={gradientStartOpacity}
          />
          <Stop
            offset="100%"
            stopColor={gradientEndColor}
            stopOpacity={gradientEndOpacity}
          />
        </LinearGradient>
      </Defs>
    </Svg>
  );
};

export default LineChart;