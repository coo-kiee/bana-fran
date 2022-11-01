import { useRecoilValue } from 'recoil';
import { ResponsiveBar, BarDatum, BarItemProps, Bar } from '@nivo/bar';
import { linearGradientDef } from '@nivo/core';
import { BasicTooltip, Tooltip } from '@nivo/tooltip';

// global state
import { franState } from 'state';
// API
import HOME_SERVICE from 'service/homeService';
// Components
import Board from 'pages/home/components/board/Board';
import ChartLabel from './chart/ChartLabel';
import ChartBar from './chart/ChartBar';
import ChartDays from './chart/ChartDays';
import { useTooltip } from '@nivo/tooltip';
import ChartTooltip from './chart/ChartTooltip';


const Weekly = () => {
	const fCode = useRecoilValue(franState);
	const { data } = HOME_SERVICE.useSalesTerms({ f_code: fCode, search_type: 'W', search_month: '2022-10-01' });
	const { hideTooltip, showTooltipAt } = useTooltip();
	

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
					onMouseLeave={(e) => {hideTooltip()}}
					// defs={[
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
					// ]}
					// fill={[
					// 	{
					// 		match: {
					// 			id: '매출',
					// 		},
					// 		id: 'gradientDefault',
					// 	},
					// ]}
					// tooltip={({id, value, color}) => {
					// 	return <ChartTooltip id={id} value={value} color={color} />
					// }}
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
					layers={['grid', 'axes', (props) => <ChartLabel {...props} />, (props) => <ChartBar {...props} />, 'markers', 'legends', (props) => <ChartDays {...props} />]}
				/>
			</div>
			<p className='noti'>* 부가세 포함</p>
		</Board>
	);
};

export default Weekly;





