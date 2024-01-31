import { useCallback, useMemo } from 'react';
import { CustomLayerProps, Point, ResponsiveLine } from '@nivo/line';

// Constants
import { STATISTIC_SEARCH_TYPE } from 'constants/sales';
// Types
import { SalesLineChartProps } from 'types/sales/salesType';
// Utils
import Utils from 'utils/Utils';
// Components
import LineChartDays from './LineChartDays';
import LineChartMonths from './LineChartMonths';
import LineChartTooltip from './LineChartTooltip';
import LineChartHours from './LineChartHours';

const LineChart = ({ chartFilter, searchType, data }: SalesLineChartProps) => {
  // 매출 유형별 필터
  const filteredData = useMemo(() => {
    const { total, paid, app, free } = chartFilter;

    // chart data 가공
    const totalData = data.map(({ std_date, str_hour, total_sales_amt }) => ({
      x: std_date || str_hour || '',
      y: total_sales_amt,
    }));
    const appData = data.map(({ std_date, str_hour, app_delivery_amt }) => ({
      x: std_date || str_hour || '',
      y: app_delivery_amt,
    }));
    const paidData = data.map(({ std_date, str_hour, paid_sales_amt }) => ({
      x: std_date || str_hour || '',
      y: paid_sales_amt,
    }));
    const freeData = data.map(({ std_date, str_hour, free_sales_amt }) => ({
      x: std_date || str_hour || '',
      y: free_sales_amt,
    }));

    const chartData = [
      { id: 'total', data: totalData, color: '#f1658a' },
      { id: 'paid', data: paidData, color: '#ae88ff' },
      { id: 'app', data: appData, color: '#6ecfbc' },
      { id: 'free', data: freeData, color: '#ff9177' },
    ];
    // 선택 매출 유형과 일치하는 항목만 리턴
    return chartData.filter(({ id }) => {
      return (total && id === 'total') || (paid && id === 'paid') || (app && id === 'app') || (free && id === 'free');
    });
  }, [chartFilter, data]);

  // searchType별 차트 렌더링 함수
  const lineChart = useCallback(
    (props: CustomLayerProps) => {
      switch (searchType) {
        case STATISTIC_SEARCH_TYPE.DAILY:
          return <LineChartDays {...props} />;
        case STATISTIC_SEARCH_TYPE.MONTHLY:
          return <LineChartMonths {...props} />;
        case STATISTIC_SEARCH_TYPE.HOURLY:
          return <LineChartHours {...props} />;
        default:
          return null;
      }
    },
    [searchType],
  );

  return (
    <ResponsiveLine
      data={filteredData}
      margin={{ top: 20, right: 30, bottom: 40, left: 70 }}
      animate={true}
      yScale={{
        type: 'linear',
        min: 'auto',
        max: 'auto',
        stacked: false,
      }}
      axisLeft={{
        tickSize: 0,
        tickPadding: 15,
        tickRotation: 0,
        format: (y) => Utils.numberComma(y),
      }}
      axisBottom={null}
      lineWidth={4}
      curve="linear"
      colors={(props) => props.color}
      useMesh={true}
      enableGridX={true}
      enableGridY={true}
      enablePoints={true}
      pointSize={10}
      pointColor="#ffffff"
      pointBorderWidth={4}
      pointBorderColor={(props: Point) => props.serieColor}
      role="img"
      tooltip={({ point }) => <LineChartTooltip point={point} searchType={searchType} />}
      layers={['grid', 'axes', (props) => lineChart(props), 'crosshair', 'lines', 'points', 'slices', 'mesh']}
    />
  );
};

export default LineChart;
