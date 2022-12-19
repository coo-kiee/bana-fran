import { format } from 'date-fns';
import { CustomLayerProps } from '@nivo/line';

const LineChartMonths = ({ points }: CustomLayerProps) => {

	return (<>{
		points.map((point, idx) => {
			// position value x
			const { x } = point.data;
			const month = format(new Date(x), 'M');
			return (
				<g transform={`translate(${point.x},${250})`} key={idx}>
					<text
						textAnchor='middle'
						dominantBaseline='middle'
						transform={`translate(${0},${90})`}
						style={{
							fill: '#333',
							fontSize: 12,
						}}>
						{month}월
					</text>
				</g>
			);
		})
	}</>);
};

export default LineChartMonths;