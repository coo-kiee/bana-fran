import { BasicTooltip } from "@nivo/tooltip";

const ChartTooltip = ({ id, value, color }: any) => {

	return (
		<BasicTooltip
			id={id}
            value={value}
            color={color}
			renderContent={() => {
				return (
					<div>
						<div>
							<svg width={13} height={11}>
								<rect width={10} height={10} fill={color}></rect>
							</svg>
							<span style={{ color: '#f1658a' }}>{id}</span>
						</div>
						<div style={{ fontWeight: 'bold', color: '#444', marginLeft: '13px' }}>{value}</div>
					</div>
				);
			}}
		/>
	);
};
export default ChartTooltip;