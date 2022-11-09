import { format } from 'date-fns';

const ChartDays = ({bars}: any) => {
	return bars.map((bar: any, idx: number) => {
		const { x, width } = bar;

		const dayNum = new Date(bar.data.data.std_date).getDay(); // day value number
		const month = format(new Date(bar.data.data.std_date), 'MM'); // day month
		const date = format(new Date(bar.data.data.std_date), 'dd'); // day date

		// 요일 이름
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

		// 주말 css color hexcode
		const dayColor = (dayText: string) => {
			if (dayText === '토') return '#0000ff'; 
			else if (dayText === '일') return '#ff0000';
			else return '#333';
		}

		return (
			<g transform={`translate(${x},${250})`} key={idx}>
				<text
					textAnchor='middle'
					dominantBaseline='middle'
					transform={`translate(${width/2},${5})`}
					style={{
						fill: dayColor(dayText),
						fontSize: 12,
					}}>
					{month}/{date}
				</text>
				<text
					textAnchor='middle'
					dominantBaseline='middle'
					transform={`translate(${width/2},${20})`}
					style={{
						fill: dayColor(dayText),
						fontSize: 12,
						fontWeight: 'bold',
					}}>
					({dayText})
				</text>
			</g>
		);});
};

export default ChartDays;