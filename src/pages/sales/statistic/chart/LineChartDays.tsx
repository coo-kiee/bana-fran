import { format } from 'date-fns';
// Utils
import Utils from 'utils/Utils';

const LineChartDays = (props: any) => {
	return props.points.map((point: any, idx: number) => {
		// position value x
		const { x } = point.data;

		const month = format(new Date(x), 'MM'); // day month
		const date = format(new Date(x), 'dd'); // day date

		// 요일명
		let dayText = Utils.getDayName(x);

		// 주말 css color hexcode
		const dayColor = (dayText: string) => {
			if (dayText === '토') return '#0000ff';
			else if (dayText === '일') return '#ff0000';
			else return '#333';
		};

		return (
			<g transform={`translate(${point.x},${250})`} key={idx}>
				<text
					textAnchor='middle'
					dominantBaseline='middle'
					transform={`translate(${0},${90})`}
					style={{
						fill: dayColor(dayText),
						fontSize: 10,
					}}>
					{month}.{date}
				</text>
				<text
					textAnchor='middle'
					dominantBaseline='middle'
					transform={`translate(${0},${105})`}
					style={{
						fill: dayColor(dayText),
						fontSize: 10,
					}}>
					({dayText})
				</text>
			</g>
		);
	});
};

export default LineChartDays;
