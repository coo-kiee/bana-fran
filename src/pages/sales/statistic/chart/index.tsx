import { isWithinInterval, format } from 'date-fns';
import { ResponsiveLine } from '@nivo/line';

// Types
import { SalesLineChartProps } from 'types/sales';
// Utils
import Utils from 'utils/Utils';
// Components
import SalesChartTooltip from './SalesChartTooltip';

const LineChart = ({ filterSales, from, to, data }: SalesLineChartProps) => {

    // chart data 가공: Serie[] 형태로 데이터 매핑
    const totalData = data.map((d: any) => {return { x: d.std_date, y: d.total_sales_amt }});
    const appDeliveryData = data.map((d: any) => { return { x: d.std_date, y: d.app_delivery_amt }});
    const paidData = data.map((d: any) => { return { x: d.std_date, y: d.paid_sales_amt }});
    const freeData = data.map((d: any) => { return { x: d.std_date, y: d.free_sales_amt }});

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
				(filterSales.total && fd.id === 'total') || 
				(filterSales.paid && fd.id === 'paid') || 
				(filterSales.app && fd.id === 'app') ||
				(filterSales.free && fd.id === 'free')
			)
		});

		// 조건 1로 필터링된 데이터 중, 세부 조건에 해당하는 data filtering (date range filter) 
		// const filterDateRangeData = filterSalesTypeData.map((fd: any) => {
            // id를 제외한 data 배열을 이용
			// const rtnData = fd.data.filter((dd: any) => {
			// 	return (isWithinInterval(new Date(dd.x), { start: new Date(from), end: new Date(to) })) //조건. 조건 개수에 따라서 배열 원소 수가 달라짐.
			// }) // 배열 형태로 return
			// console.log(rtnData) // 조건 개수 === 배열 원소 수
			// return({id: fd.id, data: fd.data, color: fd.color}) // 배열안의 배열로 들어가는 것을 막기 위해 spread 복사 후 저장. data객체를 원소르 가지는 1개의 배열로 받아오기
		// })
		// console.log(filterSalesTypeData);
		// console.log(filterDateRangeData);
        // return filterDateRangeData
        return filterSalesTypeData
	};

    // chartedData.filter((d: any) => {
    //     return (
    //         (filterSales.total && d.id === 'total') ||
    //         (filterSales.paid && d.id === 'paid') ||
    //         (filterSales.app && d.id === 'app') ||
    //         (filterSales.free && d.id === 'free')
    //     );
    // })
    
    // const totalMax = Math.max(...filteredData()[0].data.map((d: {x: string, y: number}) => { return d.y}))
    // const totalMin = Math.min(...filteredData()[0].data.map((d: {x: string, y: number}) => { return d.y}))
    
    return (
        <ResponsiveLine
            data={filteredData()}
            margin={{ top: 10, right: 80, bottom: 30, left: 80 }}
            animate={true}
            xScale={{ type: 'point' }}
            yScale={{
                type: 'linear',
                stacked: false,
                min: 'auto',
                max: 'auto',
            }}
            axisLeft={{
                tickSize: 0,
                tickPadding: 15,
                tickRotation: 0,
                format: (y) => {return (Utils.numberComma(y))}
            }}
            axisBottom={{
                tickSize: 0,
                tickPadding: 15,
                format: (x) => {return format(new Date(x), 'MM.dd')}
            }}
            lineWidth={3}
            curve='linear'
            colors={(props: any) => {return props.color}}
            enableGridX={false}
            enableGridY={true}
            useMesh={true}
            enablePoints={true}
            // enablePointLabel={true}
            pointSize={5}
            pointColor={(props: any) => {return props.color}}
            pointBorderWidth={2}
            pointBorderColor={(props: any) => {return props.serieColor}}
            // pointLabelYOffset={-12}
            // sliceTooltip={({ slice }) => {
            //                 return (
            //                     <div
            //                         style={{
            //                             background: 'white',
            //                             padding: '9px 12px',
            //                             border: '1px solid #ccc',
            //                         }}
            //                     >
            //                         <div>{}id part</div>
            //                         {slice.points.map(point => (
            //                             <div
            //                                 key={point.id}
            //                                 style={{
            //                                     color: point.serieColor,
            //                                     padding: '3px 0',
            //                                 }}
            //                             >
            //                                 <strong>{point.serieId}</strong> [{point.data.yFormatted}]
            //                             </div>
            //                         ))}
            //                     </div>
            //                 )
            //             }}
            layers={[
                'grid', 
                'markers', 
                'axes', 
                'points', 
                'crosshair', 
                'mesh', 
                'lines', 
                'slices', 
                // (props) => (<SalesChartTooltip {...props} />),
            ]}
        />
    );
}

export default LineChart;