const ChartDays = ({bars}: any) => {
	return bars.map((bar: any, idx: number) => {
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

export default ChartDays;