// Types
import { BarChartTooltipProps } from "types/home/homeType";

const ChartTooltip = ({ id, value, color }: BarChartTooltipProps) => {
	return (
		<div className="tooltip">
			<div>
				<svg width={13} height={11}>
					<rect width={10} height={10} fill={color}></rect>
				</svg>
				<span className="tooltip-id">{id}</span>
			</div>
			<div className="tooltip-value">{value}</div>
		</div>
	);
};
export default ChartTooltip;