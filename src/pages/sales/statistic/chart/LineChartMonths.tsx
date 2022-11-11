import { format } from 'date-fns';

const LineChartMonths = (props: any) => {
    // console.log(props)
	return props.points.map((point: any, idx: number) => {
		// position value x
        const { x } = point.data;
		const month = format(new Date(x), 'MM');

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
		);});
};

export default LineChartMonths;