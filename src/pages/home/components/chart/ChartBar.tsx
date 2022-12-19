import { BarCustomLayerProps } from "@nivo/bar";
import { useTooltip } from "@nivo/tooltip";
import { format } from "date-fns";
// Utils
import Utils from "utils/Utils";
// Types
import { BarChartTooltipHandlerParams, HomeSalesTermsData } from 'types/home/homeType';
// Components
import ChartTooltip from "./ChartTooltip";

// custom bar
const ChartBar = ({ bars }: BarCustomLayerProps<HomeSalesTermsData>) => {
	const { showTooltipAt, hideTooltip } = useTooltip();

	// 최대 매출액
	const maxValue = Math.max(...bars.map((bar) => {
		return bar.data.value || 0
	}), 0)

	// 툴팁 생성
	const handleTooltip = ({pageX, pageY, color, data: {std_date, sales_charge}}: BarChartTooltipHandlerParams) => {
		showTooltipAt(
			<ChartTooltip 
				id={format(new Date(std_date), 'MM/dd')} 
				value={Utils.numberComma(sales_charge || 0) + '원'} 
				color={color} 
			/>,
			[	// chart bar에서 마우스의 위치에 따라 툴팁 표시 위치 변경
				pageX < 600 ? pageX - 180 : pageX - 340,
				pageY > 1000 ? pageY - 870 : pageY - 840
			],
			'center'
		)
	}
	
	return <>{
		bars.map((bar) => {
			const {key, width, height, x, y, data: { value }} = bar;
			
			return (
				<g 
					key={key} 
					transform={`translate(${x}, ${y})`}
					onMouseMove={(e: React.MouseEvent<SVGElement, MouseEvent>) => {
						handleTooltip({
							pageX: e.pageX,
							pageY: e.pageY,
							color: value === maxValue ? '#f1658a' : '#fddce5',
							data: { ...bar?.data?.data,	},
						})
					}}
					onMouseLeave={hideTooltip}
				>
					<circle
						transform={`translate(${width/2}, ${0})`}
						cx={0} 
						cy={0} 
						r={width / 2}
						fill={value === maxValue ? '#f1658a' : '#fddce5'}
						cursor={'pointer'}
					>
					</circle>
					<rect
						transform={`translate(0, 0)`} 
						width={width}
						height={height}
						fill={value === maxValue ? '#f1658a' : '#fddce5'}
						cursor={'pointer'}
					>
					</rect>
				</g>
			);
		})
	}</>
}

export default ChartBar;