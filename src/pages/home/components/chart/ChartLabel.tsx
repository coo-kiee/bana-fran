// Utils
import Utils from 'utils/Utils';

// custom label (매출액)
const ChartLabel = ({ bars }: any) => {
	// 최대 매출액 산출
	const maxValue: number = Math.max(...bars.map((bar: any) => {
		return bar.data.value
	}), 0)
	
	return bars.map((bar: any) => {
		const { key, width,	x, y, data: { value } } = bar;
		
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

export default ChartLabel;