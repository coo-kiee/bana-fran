
import { BasicTooltip } from '@nivo/tooltip';

const SalesChartTooltip = ({ data }: any) => {
	// const { id, data, color} = data;
	console.log(data);
	// return data.map((dd: any, idx: number) => {
	// 	const { id, data, color } = dd;
	// 	console.log(data);

	// 	return dd.data.map((point: any, idx: number) => {
	// 		// const { id, value, color } = point;
	// 		return (
	// 			<BasicTooltip
	// 				id={id}
	// 				value={point.y}
	// 				color={color}
	// 				key={idx}
	// 				renderContent={() => {
	// 					return (
	// 						<div>
	// 							<div>
	// 								<svg width={13} height={10}>
	// 									<rect width={8} height={8} fill={color}></rect>
	// 								</svg>
	// 								<span style={{ color: '#f1658a' }}>{id}</span>
	// 							</div>
	// 							<div style={{ fontWeight: 'bold', color: '#444', marginLeft: '13px' }}>{11}</div>
	// 						</div>
	// 					);
	// 				}}
	// 			/>
	// 		);
	// 	});
	// });
	return <div>tooltipTest</div>
};

export default SalesChartTooltip;
