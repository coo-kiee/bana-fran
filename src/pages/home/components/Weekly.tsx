import { ResponsiveBar, BarDatum, BarItemProps, Bar } from '@nivo/bar';
import { linearGradientDef } from '@nivo/core';
import { BasicTooltip, Tooltip } from '@nivo/tooltip';
import { useRecoilValue } from 'recoil';

import { franState } from 'state';

import HOME_SERVICE from 'service/homeService';

import Utils from 'utils/Utils';
import Board from './Board';

interface ChartProps {
	// data: BarDatum[];
}

const Weekly = ({}: ChartProps) => {
	const fCode = useRecoilValue(franState);
	const { data } = HOME_SERVICE.useSalesTerms({ f_code: fCode, search_type: 'W', search_month: '2022-10-01' });
	
	// mouse hover tooltip
	const Tooltip = (props: any) => {
		return (
			<BasicTooltip id={props.data.날짜} value={Utils.numberComma(props.value)} color={props.color} enableChip />
		);
	};

	return (
		<Board title='Week' boardClass='week-sales' suffix='총 매출'>
			<div className='contents-list chart'>
			<ResponsiveBar
					data={data || []}
					keys={['sales_charge']}
					indexBy='std_date'
					margin={{ top: 70, right: 0, bottom: 50, left: 0 }}
					padding={0.84}
					groupMode='grouped'
					valueScale={{ type: 'linear' }}
					indexScale={{ type: 'band', round: true }}
					colors={{ scheme: 'nivo' }}
					defs={[
						// linearGradientDef('gradientDefault', [
						// 	{ offset: 0, color: '#f6af8a' },
						// 	{ offset: 100, color: '#f1658a' },
						// ]),
						// linearGradientDef('gradientMax', [
						// 	{ offset: 0, color: '#f1658a' },
						// 	{ offset: 100, color: '#f1658a' },
						// ]),
						// linearGradientDef('gradientMin', [
						// 	{ offset: 0, color: '#3a3a4d' },
						// 	{ offset: 100, color: '#3a3a4d' },
						// ]),
						// using plain object
						// {
						// 	id: 'gradientToday',
						// 	type: 'linearGradient',
						// 	colors: [
						// 		{ offset: 0, color: '#fa7f5f' },
						// 		{ offset: 100, color: '#f1658a' },
						// 	],
						// },
					]}
					fill={[
						{
							match: {
								id: '매출',
							},
							id: 'gradientDefault',
						},
					]}
					tooltip={({id, value, color}) => {
						return <div>{id}, {value}, {color}</div>
					}}
					// onMouseEnter={(v) => {console.log(v)}}
					// borderColor={{
					// 	from: 'color',
					// 	modifiers: [['darker', 1.6]],
					// }}
					enableGridY={false}
					axisTop={null}
					axisRight={null}
					axisBottom={
						null
						// {
						// 	tickSize: 0,
						// 	tickPadding: 5,
						// 	tickRotation: 0,
						// 	legend: '',
						// 	legendPosition: 'middle',
						// 	legendOffset: 32,
						// 	format: (val) => { // data to date(format: MM/dd)
						// 		let date = new Date(val);
						// 		return (`${date.getMonth()+1}/${date.getDate()}`)
						//	}
						// }
					}
					axisLeft={null}
					theme={{
						axis: {
							ticks: {
								text: { // axis label font properties
									fontSize: 12,
									fontWeight: 'bold',
								}
							}
						}
					}}
					enableLabel={false}
					// labelSkipWidth={2}
					// labelSkipHeight={6}
					// labelTextColor={{
					// 	from: 'color',
					// 	modifiers: [['darker', 1.6]],
					// }}
					// labelFormat={
					// 	labelValue => (
					// 		`${<tspan y={-10}>{labelValue}</tspan>}`
					// 	)
					// }
					// legends={[
					// 	{
					// 		dataFrom: 'keys',
					// 		anchor: 'top-right',
					// 		direction: 'column',
					// 		justify: false,
					// 		translateX: 128,
					// 		translateY: 0,
					// 		itemsSpacing: 2,
					// 		itemWidth: 100,
					// 		itemHeight: 20,
					// 		itemDirection: 'left-to-right',
					// 		itemOpacity: 0.85,
					// 		symbolSize: 20,
					// 		effects: [
					// 			{
					// 				on: 'hover',
					// 				style: {
					// 					itemOpacity: 1,
					// 				},
					// 			},
					// 		],
					// 	},
					// ]}
					role='application'
					ariaLabel='Daily Sales'
					barAriaLabel={function (e) {
						return e.id + ' ' + e.formattedValue + e.indexValue;
					}}
					layers={['grid', 'axes', (props) => <CustomLabel {...props} />, (props) => <CustomBar {...props} />, 'markers', 'legends', (props) => <CustomDay {...props} />]}
				/>
			</div>
			<p className='noti'>* 부가세 포함</p>
		</Board>
	);
};

export default Weekly;

// custom label (매출)
const CustomLabel = ({ bars }: any) => {
	const maxValue: number = Math.max(...bars.map((bar: any) => {
		return bar.data.value
	}), 0)
	
	return bars.map((bar: any) => {
		const {
			key,
			width,
			x,
			y,
			data: { value },
		} = bar;
		
		return (
			<g key={key} transform={`translate(${x}, ${y})`}>
				<text
					transform={`translate(${width/2 + 1}, ${-12})`}
					textAnchor='middle'
					fontSize='12px'
					fontWeight={value === maxValue ?'bold' : 'normal'}
					fill={value === maxValue ? '#f1658a' : '#555555'}>
					{/* YOUR LABEL HERE */}
					{Utils.roundingDown10000(value)}만
				</text>
			</g>
		);
	});
};

// custom bar
const CustomBar = ({ bars }: any) => {
	const maxValue: number = Math.max(...bars.map((bar: any) => {
		return bar.data.value
	}), 0)

	return bars.map((bar: any) => {
		const {
			key,
			width,
			height,
			x,
			y,
			data: { value },
		} = bar;
		
	
		return (
			<g key={key} transform={`translate(${x}, ${y})`}>
				<circle
					transform={`translate(${width/2}, ${0})`}
					cx={0} 
					cy={0} 
					r={width / 2}
					fill={value === maxValue ? '#f1658a' : '#fddce5'}
				>
				</circle>
				<rect
					transform={`translate(0, 0)`} 
					width={width}
					height={height}
					fill={value === maxValue ? '#f1658a' : '#fddce5'}
					onMouseOver={(e) => {
						// showTooltip(<Tooltip currentBar={data} />)
					}}
					>
				</rect>
			</g>
		);
	});
};

const CustomDay = ({bars}: any) => {
	return bars. map((bar: any, idx: number) => {
		// console.log(new Date(bar.data.data.std_date).getDay())
		const dayNum = new Date(bar.data.data.std_date).getDay(); // day value number
		const month = new Date(bar.data.data.std_date).getMonth() + 1; // day month
		const date = new Date(bar.data.data.std_date).getDate(); // day date
		let dayText = '';
		switch (dayNum) {
			case 0: dayText = '일';	break;
			case 1: dayText = '월';	break;
			case 2: dayText = '화';	break;
			case 3: dayText = '수';	break;
			case 4: dayText = '목';	break;
			case 5: dayText = '금';	break;
			default: dayText = '토'; break;
		}
		const dayColor = (dayText: string) => {
			if (dayText === '토') return '#0000ff'; 
			else if (dayText === '일') return '#ff0000';
			else return '#333';
		}
		return (<g transform={`translate(${bar.x},${250})`} key={idx}>
			{/* <rect x={0} y={0} rx={0} ry={0} width={28} height={24} fill='rgba(0, 0, 0, .05)' transform={`translate(${tick.width}, 0)`} /> */}
			{/* <rect width={24} height={24} fill='rgb(232, 193, 160)' transform={`translate(${-bar.width + 1}, ${0})`} /> */}
			<text
				textAnchor='middle'
				dominantBaseline='middle'
				transform={`translate(${4},${5})`}
				style={{
					fill: dayColor(dayText),
					fontSize: 12,
				}}>
				{month}/{date}
			</text>
			<text
				textAnchor='middle'
				dominantBaseline='middle'
				transform={`translate(${4},${20})`}
				style={{
					fill: dayColor(dayText),
					fontSize: 12,
					fontWeight: 'bold',
				}}>
				({dayText})
			</text>
		</g>
	)});
};