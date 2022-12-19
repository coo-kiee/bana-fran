import { BarCustomLayerProps } from '@nivo/bar';
// Utils
import Utils from 'utils/Utils';
// Types
import { HomeSalesTermsData } from 'types/home/homeType';

// custom label (매출)
const ChartLabel = ({ bars }: BarCustomLayerProps<HomeSalesTermsData>) => {
	// 최대 매출 산출
	const maxValue = Math.max(...bars.map((bar) => {
		return bar.data.value || 0
	}), 0);
	
	return <>{
		bars.map((bar) => {
			const { key, width,	x, y, data: { value } } = bar;
			
			return (
				<g key={key} transform={`translate(${x}, ${y})`}>
					<text
						transform={`translate(${width/2 + 1}, ${-12})`}
						textAnchor='middle'
						fontSize='12'
						fontWeight={value === maxValue ?'bold' : 'normal'}
						fill={value === maxValue ? '#f1658a' : '#555555'}>
						{Utils.roundingDown10000(value)}만
					</text>
				</g>
			);
		})
	}</>
};

export default ChartLabel;