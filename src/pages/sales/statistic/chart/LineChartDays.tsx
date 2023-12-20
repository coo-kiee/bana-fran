import { format } from 'date-fns';
import { CustomLayerProps } from '@nivo/line';
// Utils
import Utils from 'utils/Utils';

const LineChartDays = ({ points }: CustomLayerProps) => {
	return <>{
		points.map((point, idx) => {
			// position value x
			const { x } = point.data;

			const month = format(new Date(x), 'MM'); // day month
			const date = format(new Date(x), 'dd'); // day date

			// 요일명
			const dayName = Utils.getDayName(x);
			
			// 주말 css color hexcode
			const dayColor = (dayName: string) => {
				if (dayName === '토') return '#0000ff';
				else if (dayName === '일') return '#ff0000';
				else return '#333';
			};

			return (
				<g transform={`translate(${point.x},${250})`} key={idx}>
					<text
						textAnchor='middle'
						dominantBaseline='middle'
						transform={`translate(${0},${90})`}
						style={{ fill: dayColor(dayName), fontSize: 10 }}>
						{month}.{date}
					</text>
					<text
						textAnchor='middle'
						dominantBaseline='middle'
						transform={`translate(${0},${105})`}
						style={{ fill: dayColor(dayName), fontSize: 10 }}>
						({dayName})
					</text>
				</g>
			);
		})
	}</>;
};

export default LineChartDays;
