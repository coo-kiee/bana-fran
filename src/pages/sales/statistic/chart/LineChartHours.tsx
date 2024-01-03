import { CustomLayerProps } from '@nivo/line';

const LineChartHours = ({ points }: CustomLayerProps) => {
  return (
    <>
      {points.map((point, idx) => {
        // 시간대
        const { xFormatted } = point.data;
        const hourlyTime = Number(xFormatted);

        return (
          <g transform={`translate(${point.x},${250})`} key={idx}>
            <text
              textAnchor="middle"
              dominantBaseline="middle"
              transform={`translate(${0},${95})`}
              style={{ fill: '#333', fontSize: 12 }}
            >
              {xFormatted}~{hourlyTime < 9 ? `0${hourlyTime + 1}` : hourlyTime + 1}시
            </text>
          </g>
        );
      })}
    </>
  );
};

export default LineChartHours;
