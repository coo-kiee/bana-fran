import { useMemo } from 'react';
import { Point, ResponsiveLine } from '@nivo/line';

// Types
import { SalesLineChartProps } from 'types/sales/salesType';
// Utils
import Utils from 'utils/Utils';
// Components
import LineChartDays from './LineChartDays';
import LineChartMonths from './LineChartMonths';
import LineChartTooltip from './LineChartTooltip';

const LineChart = ({ chartFilter, searchType, data }: SalesLineChartProps) => {
    // 매출 유형별 필터
	const filteredData = useMemo(() => {
        const { total, paid, app, free } = chartFilter;

        // chart data 가공
        const totalData = data.map((sales) => {return { x: sales.std_date, y: sales.total_sales_amt }});
        const appData = data.map((sales) => {return { x: sales.std_date, y: sales.app_delivery_amt }});
        const paidData = data.map((sales) => {return { x: sales.std_date, y: sales.paid_sales_amt }});
        const freeData = data.map((sales) => {return { x: sales.std_date, y: sales.free_sales_amt }});

        const chartData = [
            { id: 'total', data: totalData, color: '#f1658a' },
            { id: 'paid', data: paidData, color: '#ae88ff' },
            { id: 'app', data: appData, color: '#6ecfbc' },
            { id: 'free', data: freeData, color: '#ff9177' },
        ]
		// 선택 매출 유형과 일치하는 항목만 리턴
		return chartData.filter(({ id }) => {
			return (
				(total && id === 'total') || 
				(paid && id === 'paid') || 
				(app && id === 'app') ||
				(free && id === 'free')
			)
		});
	}, [chartFilter, data]);

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
                format: (y) => {return (Utils.numberComma(y))}
            }}
            axisBottom={null}
            lineWidth={4}
            curve='linear'
            colors={props => {return props.color}}
            useMesh={true}
            enableGridX={true}
            enableGridY={true}
            enablePoints={true}
            pointSize={10}
            pointColor='#ffffff'
            pointBorderWidth={4}
            pointBorderColor={(props: Point) => {return props.serieColor}}
            role='graphics-doc'
            tooltip={({point}) => {return <LineChartTooltip point={point} searchType={searchType} />}}
            layers={[
                'grid', 
                'axes', 
                (props) => {return searchType === 'D' ? <LineChartDays {...props} /> : <LineChartMonths {...props} />},
                'crosshair', 
                'lines', 
                'points',
                'slices', 
                'mesh',  
            ]}
        />
    );
}

export default LineChart;
