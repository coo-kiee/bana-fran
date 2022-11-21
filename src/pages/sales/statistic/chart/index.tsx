import { ResponsiveLine } from '@nivo/line';

// Types
import { SalesLineChartProps } from 'types/sales/salesType';
// Utils
import Utils from 'utils/Utils';
// Components
import LineChartDays from './LineChartDays';
import LineChartMonths from './LineChartMonths';
import LineChartTooltip from './LineChartTooltip';

const LineChart = ({ filterChart, data, searchType }: SalesLineChartProps) => {
    const { total, paid, app, free } = filterChart;
    // chart data 가공: Serie[] 형태로 데이터 매핑
    const totalData = data.map((d: any) => {return { x: d.std_date, y: d.total_sales_amt }});
    const appDeliveryData = data.map((d: any) => {return { x: d.std_date, y: d.app_delivery_amt }});
    const paidData = data.map((d: any) => {return { x: d.std_date, y: d.paid_sales_amt }});
    const freeData = data.map((d: any) => {return { x: d.std_date, y: d.free_sales_amt }});
    
	const chartData = [
        { id: 'total', data: totalData, color: '#f1658a' },
        { id: 'paid', data: paidData, color: '#ae88ff' },
        { id: 'app', data: appDeliveryData, color: '#6ecfbc' },
        { id: 'free', data: freeData, color: '#ff9177' },
    ]

    // 필터 (매출유형별)
	const filteredData = () => {
		// 조건 해당 항목 필터링 (id filter)
		const filteredDataById = chartData.filter((fd: any) => {
			return (
				(total && fd.id === 'total') || 
				(paid && fd.id === 'paid') || 
				(app && fd.id === 'app') ||
				(free && fd.id === 'free')
			)
		});

        return filteredDataById;
	};

    return (
        <ResponsiveLine
            data={filteredData()}
            margin={{ top: 20, right: 70, bottom: 40, left: 70 }}
            animate={true}
            // xScale={{ type: 'point' }}
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
                format: (y: number) => {return (Utils.numberComma(y))}
            }}
            axisBottom={null}
            lineWidth={4}
            curve='linear'
            colors={(props: any) => {return props.color}}
            useMesh={true}
            enableGridX={true}
            enableGridY={true}
            enablePoints={true}
            pointSize={10}
            pointColor='#ffffff'
            pointBorderWidth={4}
            pointBorderColor={(props: any) => {return props.serieColor}}
            tooltip={({point}) => {
                return <LineChartTooltip point={point} searchType={searchType} />}
            }
            layers={[
                'grid', 
                'axes', 
                (props: any) => {return searchType === 'D' ? <LineChartDays {...props} /> : <LineChartMonths {...props} />},
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
