import { BasicTooltip, useTooltip } from "@nivo/tooltip";

const ChartTooltip = (props: any) => {
	const { id, value, color } = props;
    const { hideTooltip } = useTooltip()

	return (
		<BasicTooltip
			id={id}
            value={value}
            color={color}
			renderContent={() => {
				return (
					<div style={{position: 'relative'}}>
						<div>
							<svg width={13} height={10}>
								<rect width={8} height={8} fill={color}></rect>
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