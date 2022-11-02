import { useTooltip } from "@nivo/tooltip";
import { format } from "date-fns";
// Utils
import Utils from "utils/Utils";
// Components
import ChartTooltip from "./ChartTooltip";

// custom bar
const ChartBar = ({ bars }: any) => {
	const { showTooltipAt, hideTooltip } = useTooltip();

	// 최대 매출액
	const maxValue: number = Math.max(...bars.map((bar: any) => {
		return bar.data.value
	}), 0)

	const handleTooltip = (point: any) => {
		const { x, y, color, clientX, clientY, data: {std_date, sales_charge} } = point;
		showTooltipAt(
			<ChartTooltip 
				id={format(new Date(std_date), 'MM/dd')} 
				value={Utils.numberComma(sales_charge || 0) + '원'} 
				color={color} 
				/>,
				[(x > 320 ? clientX - 350 : clientX - 170), (y > 100 ? clientY - 700 : clientY - 680)],
				'center'
				
  		)
	}
	
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
			<g 
				key={key} 
				transform={`translate(${x}, ${y})`}
				onMouseOver={(e: any) => {
					handleTooltip({
						x: x,
						y: y,
						clientX: e.clientX,
						clientY: e.clientY,
						// width: width,
						// height: height,
						color: value === maxValue ? '#f1658a' : '#fddce5',
						data: { ...bar?.data?.data,	},
						// formattedValue: Number(bar?.data?.data?.sales_charge),
					})
				}}
				onMouseMove={(e: any) => {
					handleTooltip({
						x: x,
						y: y,
						clientX: e.clientX,
						clientY: e.clientY,
						// width: width,
						// height: height,
						color: value === maxValue ? '#f1658a' : '#fddce5',
						data: { ...bar?.data?.data,	},
						// formattedValue: Number(bar?.data?.data?.sales_charge),
					})
				}}
				onMouseLeave={(e: any) => {hideTooltip();}}
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
	});
};

export default ChartBar;