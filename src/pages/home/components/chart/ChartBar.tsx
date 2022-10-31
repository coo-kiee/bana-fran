// custom bar
const ChartBar = ({ bars }: any) => {
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

export default ChartBar;