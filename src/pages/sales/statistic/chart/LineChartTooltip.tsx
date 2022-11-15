import { format } from 'date-fns';
import styled from 'styled-components';
import Utils from 'utils/Utils';

const LineChartTooltip = ({ point, searchType }: any) => {
	const { serieId, serieColor, data: { xFormatted, yFormatted } } = point;
	// console.log(point)
	let salesType = '';
	switch (serieId) {
		case 'total': salesType = '총 매출'; break;
		case 'paid': salesType = '유상매출'; break;
		case 'app': salesType = '배달매출';	break;
		case 'free': salesType = '서비스'; break;
		default: salesType = '매출'; break;
	}
	return (
		<CustomTooltip className='custom-tooltip'>
			<p>
                {
                    searchType === 'D' ? 
                    format(new Date(xFormatted), 'MM.dd') : 
                    format(new Date(xFormatted), 'MM월')
                }
                {searchType === 'D' ? `(${Utils.getDayName(xFormatted)})` : ''}
            </p>
			<TooltipContents className='tooltip-contents' color={serieColor}>
				<StyledRect color={serieColor} />
				{salesType}
				<span>{Utils.numberComma(yFormatted) || 0}원</span>
			</TooltipContents>
		</CustomTooltip>
	);
};

export default LineChartTooltip;

const CustomTooltip = styled.div`
	min-width: 60px;
	padding: 3px 8px;
	background-color: #fff;
	box-shadow: 1.2px 1.2px 3px 1px #d3d3d3;
	color: #333;
	p {
		font-size: 14px;
		// margin-left: 16px;
	}
`;
const TooltipContents = styled.div`
	display: flex;
	align-items: center;
	font-size: 16px;
	color: ${(props) => props.color || '#333'};
	font-weight: bold;
	span {
		color: #333;
		margin-left: 4px;
	}
`;
const StyledRect = styled.div`
	width: 12px;
	height: 12px;
	background-color: ${(props) => props.color || '#333'};
	margin-right: 4px;
`;