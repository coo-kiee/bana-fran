import { format, getDay } from 'date-fns';
import { ResponsiveLine } from '@nivo/line';

// Types
import { SalesLineChartProps } from 'types/sales';
// Utils
import Utils from 'utils/Utils';
// Components
import LineChartDays from './LineChartDays';
import LineChartMonths from './LineChartMonths';
import LineChartTooltip from './LineChartTooltip';
import { useMemo } from 'react';

const LineChart = ({ filterSales, data, searchType }: SalesLineChartProps) => {
    const { total, paid, app, free } = filterSales;
    // chart data 가공: Serie[] 형태로 데이터 매핑
    const totalData = data.map((d: any) => {return { x: d.std_date, y: d.total_sales_amt }});
    const appDeliveryData = data.map((d: any) => {return { x: d.std_date, y: d.app_delivery_amt }});
    const paidData = data.map((d: any) => {return { x: d.std_date, y: d.paid_sales_amt }});
    const freeData = data.map((d: any) => {return { x: d.std_date, y: d.free_sales_amt }});
    
	const chartedData = [
        { id: 'total', data: totalData, color: '#f1658a' },
        { id: 'paid', data: paidData, color: '#ae88ff' },
        { id: 'app', data: appDeliveryData, color: '#6ecfbc' },
        { id: 'free', data: freeData, color: '#ff9177' },
    ]
    // 이중 필터 (매출유형별, 기간별)
	const filteredData = () => {
		// 조건 1 해당 항목 필터링 (id filter)
		const filterSalesTypeData = chartedData.filter((fd: any) => {
			return (
				(total && fd.id === 'total') || 
				(paid && fd.id === 'paid') || 
				(app && fd.id === 'app') ||
				(free && fd.id === 'free')
			)
		});

        return filterSalesTypeData
	};

    // const totalMax = Math.max(...filteredData()[0].data.map((d: {x: string, y: number}) => { return d.y}))
    // const totalMin = Math.min(...filteredData()[0].data.map((d: {x: string, y: number}) => { return d.y}))
    
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
                format: (y: any) => {return (Utils.numberComma(y))}
            }}
            axisBottom={null}
            // axisBottom={{
            //     tickSize: 0,
            //     tickPadding: 15,
            //     format: (x: any) => {
            //         const dayNum = getDay(new Date(x));
            //         let dayText = '일'
            //         switch (dayNum) {
            //             case 1: dayText = '월'; break;
            //             case 2: dayText = '화'; break;
            //             case 3: dayText = '수'; break;
            //             case 4: dayText = '목'; break;
            //             case 5: dayText = '금'; break;
            //             case 6: dayText = '토'; break;
            //             default: dayText = '일'; break;
            //         }
            //         const formattedValue = format(new Date(x), 'MM.dd') + (dayText);
            //         return (formattedValue)
            //     }
            // }}
            lineWidth={4}
            curve='linear'
            colors={(props: any) => {return props.color}}
            useMesh={true}
            enableGridX={true}
            enableGridY={true}
            enablePoints={true}
            // enablePointLabel={(total || paid || app || free) ? true : false}
            pointSize={10}
            pointColor='#ffffff'
            pointBorderWidth={4}
            pointBorderColor={(props: any) => {return props.serieColor}}
            tooltip={({point}) => {
                return <LineChartTooltip point={point} searchType={searchType} />}
            }
            layers={[
                'grid', 
                // 'markers', 
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
