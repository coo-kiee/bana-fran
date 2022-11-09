import { ResponsiveLine, Serie } from '@nivo/line';
import { isWithinInterval } from 'date-fns';
import SalesChartTooltip from './SalesChartTooltip';
    // tempData
    const data: Serie[] | any[] = [
        {
            id: 'total',
            data: [
                {
                    x: '2022-10-01',
                    y: 710000,
                },
                {
                    x: '2022-10-02',
                    y: 620000,
                },
                {
                    x: '2022-10-03',
                    y: 830000,
                },
                {
                    x: '2022-10-04',
                    y: 740000,
                },
                {
                    x: '2022-10-05',
                    y: 750000,
                },
                {
                    x: '2022-10-06',
                    y: 760000,
                },
                {
                    x: '2022-10-07',
                    y: 870000,
                },
                {
                    x: '2022-10-08',
                    y: 880000,
                },
                {
                    x: '2022-10-09',
                    y: 990000,
                },
                {
                    x: '2022-10-10',
                    y: 490000,
                },
            ],
        },
        {
            id: 'paid',
            data: [
                {
                    x: '2022-10-01',
                    y: 210000,
                },
                {
                    x: '2022-10-02',
                    y: 320000,
                },
                {
                    x: '2022-10-03',
                    y: 130000,
                },
                {
                    x: '2022-10-04',
                    y: 340000,
                },
                {
                    x: '2022-10-05',
                    y: 75000,
                },
                {
                    x: '2022-10-06',
                    y: 60000,
                },
                {
                    x: '2022-10-07',
                    y: 270000,
                },
                {
                    x: '2022-10-08',
                    y: 580000,
                },
                {
                    x: '2022-10-09',
                    y: 390000,
                },
                {
                    x: '2022-10-10',
                    y: 300000,
                },
            ],
        },
        {
            id: 'delivery',
            data: [
                {
                    x: '2022-10-01',
                    y: 110000,
                },
                {
                    x: '2022-10-02',
                    y: 120000,
                },
                {
                    x: '2022-10-03',
                    y: 130000,
                },
                {
                    x: '2022-10-04',
                    y: 140000,
                },
                {
                    x: '2022-10-05',
                    y: 150000,
                },
                {
                    x: '2022-10-06',
                    y: 160000,
                },
                {
                    x: '2022-10-07',
                    y: 170000,
                },
                {
                    x: '2022-10-08',
                    y: 180000,
                },
                {
                    x: '2022-10-09',
                    y: 190000,
                },
                {
                    x: '2022-10-10',
                    y: 200000,
                },
            ],
        },
        {
            id: 'free',
            data: [
                {
                    x: '2022-10-01',
                    y: 100000,
                },
                {
                    x: '2022-10-02',
                    y: 200000,
                },
                {
                    x: '2022-10-03',
                    y: 130000,
                },
                {
                    x: '2022-10-04',
                    y: 140000,
                },
                {
                    x: '2022-10-05',
                    y: 150000,
                },
                {
                    x: '2022-10-06',
                    y: 620000,
                },
                {
                    x: '2022-10-07',
                    y: 370000,
                },
                {
                    x: '2022-10-08',
                    y: 580000,
                },
                {
                    x: '2022-10-09',
                    y: 90000,
                },
                {
                    x: '2022-10-10',
                    y: 20000,
                },
            ],
        },
    ];

interface LineChartProps {
    filterSales: any
}

const LineChart = ({ filterSales }: LineChartProps) => {
    
	// const wrapper = useRef<HTMLDivElement>(null);
    
	// 타겟 날짜를 입력하면, 특정 구간에 해당되는지 보여줌.
	const tempRange = (targetDate: Date, start: Date, end: Date) => {
		return isWithinInterval(targetDate, {
		start,
		end
	})}

	const doubleFiltering = () => {
		
		// 조건 1 해당 항목 필터링 (id filter)
		const freeData = data.filter((d) => {
			return (
				(filterSales.total && d.id === 'total') || 
				(filterSales.paid && d.id === 'paid') || 
				(filterSales.delivery && d.id === 'delivery') ||
				(filterSales.free && d.id === 'free')
			)
		});

		// 조건 1로 필터링된 데이터 중, 세부 조건에 해당하는 data filtering (date range filter) 
		const filteredData = freeData.map((fd) => {
			const rtnData = fd.data.filter((dd: any) => {
				return (tempRange(new Date(dd.x), new Date('2022-10-01'), new Date('2022-10-04'))) //조건. 조건 개수에 따라서 배열 원소 수가 달라짐.
			}) // 배열 형태로 return
			// console.log(rtnData) // 조건 개수 === 배열 원소 수
			return({id: '123', data: [...rtnData]}) // 배열안의 배열로 들어가는 것을 막기 위해 spread 복사 후 저장. data객체를 원소르 가지는 1개의 배열로 받아오기
		})
		console.log(freeData);
		console.log(filteredData);
	};
	doubleFiltering();

    

    return (
        <ResponsiveLine
            data={data.filter((d) => {
                return (
                    (filterSales.total && d.id === 'total') ||
                    (filterSales.paid && d.id === 'paid') ||
                    (filterSales.delivery && d.id === 'delivery') ||
                    (filterSales.free && d.id === 'free')
                );
            })}
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
                tickPadding: 10,
                tickRotation: 0,
            }}
            lineWidth={3}
            curve='natural'
            colors={['#f1658a', '#ae88ff', '#6ecfbc', '#ff9177']}
            enableSlices={'x'}
            enableGridX={false}
            enableGridY={true}
            crosshairType={'bottom-left'}
            pointSize={0}
            useMesh={true}
            onMouseEnter={() => {}}
            // pointColor="white"
            // pointBorderWidth={2}
            // pointBorderColor={{ from: "serieColor" }}
            layers={['grid', 'markers', 'areas', 'crosshair', 'mesh', 'lines', 'slices', 'axes', 'points', 'legends', (props) => (<SalesChartTooltip {...props} />)]}
            // theme={{
            //     crosshair: {
            //         line: {
            //             strokeWidth: 2,
            //             stroke: '#774dd7',
            //             strokeOpacity: 1,
            //         },
            //     },
            // }}
        />
    );
}

export default LineChart;