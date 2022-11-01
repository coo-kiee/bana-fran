import { BasicTooltip, useTooltip } from "@nivo/tooltip";
import { format } from "date-fns";
import Utils from "utils/Utils";
import ChartTooltip from "./ChartTooltip";

// custom bar
const ChartBar = ({ bars }: any) => {
	const { showTooltipAt, hideTooltip } = useTooltip();

	const maxValue: number = Math.max(...bars.map((bar: any) => {
		return bar.data.value
	}), 0)

	const handleMouseEnter = (point: any) => {
		const { x, y, color, clientX, clientY, data: {std_date, sales_charge} } = point;
		showTooltipAt(
			<ChartTooltip 
				id={format(new Date(std_date), 'MM/dd')} 
				value={(sales_charge ? Utils.numberComma(sales_charge) : '-') + '원'} 
				color={color} />,
				[(x > 320 ? clientX - 350 : clientX - 170), (y > 100 ? clientY - 640 : clientY - 580)]
			// [(point.x > 350) ? (point.x - 80) : (point.x + 100), point.y > 150 ? point.y + 50 : point.y + 80],
			// ,'top'
  		)
	}
	
	const handleMouseMove = (point: any) => {
		const { x, y, color, clientX, clientY, data: {std_date, sales_charge} } = point;
		showTooltipAt(
			<ChartTooltip 
				id={format(new Date(std_date), 'MM/dd')} 
				value={Utils.numberComma(sales_charge) + '원'} 
				color={color} />,
				[(x > 320 ? clientX - 350 : clientX - 170), (y > 100 ? clientY - 640 : clientY - 580)]
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
				onMouseEnter={(e: any) => {
					handleMouseEnter({
						x: x,
						y: y,
						clientX: e.clientX,
						clientY: e.clientY,
						width: 70,
						height: 4,
						color: value === maxValue ? '#f1658a' : '#fddce5',
						data: {
							...bar?.data?.data,
						},
						formattedValue: Number(
							parseInt(bar?.data?.data?.sales_charge) || 0
						),
					})
				}}
				onMouseMove={(e: any) => {
					handleMouseMove({
						x: x,
						y: y,
						clientX: e.clientX,
						clientY: e.clientY,
						width: 70,
						height: 4,
						color: value === maxValue ? '#f1658a' : '#fddce5',
						data: {
							...bar?.data?.data,
						},
						formattedValue: Number(
							parseInt(bar?.data?.data?.sales_charge) || 0
						),
					})
				}}
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