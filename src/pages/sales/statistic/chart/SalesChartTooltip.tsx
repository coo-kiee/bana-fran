import React from 'react'
import { BasicTooltip } from '@nivo/tooltip';

const SalesChartTooltip = ({data}: any) => {
    
    // const { id, value, color} = point;
    console.log(data)
	return (
		data.map((point: any, idx: number) => {
            const { id, value, color} = point;
            return (
                <BasicTooltip id={id} value={value} color={color} key={idx} />
            )
        }) 
        // <BasicTooltip
		// 	id={id}
        //     value={value}
        //     color={color}
		// 	renderContent={() => {
		// 		return (
		// 			<div>
		// 				<div>
		// 					<svg width={13} height={10}>
		// 						<rect width={8} height={8} fill={color}></rect>
		// 					</svg>
		// 					<span style={{ color: '#f1658a' }}>{id}</span>
		// 				</div>
		// 				<div style={{ fontWeight: 'bold', color: '#444', marginLeft: '13px' }}>{value}</div>
		// 			</div>
		// 		);
		// 	}}
		// />
	);
}

export default SalesChartTooltip