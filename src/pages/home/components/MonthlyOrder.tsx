import { useRecoilValue } from 'recoil';

// global states
import { franState } from 'state';
// API
import HOME_SERVICE from 'service/homeService';
// Components
import Board from 'pages/home/components/board/Board';
import Utils from 'utils/Utils';

const MonthlyOrder = () => {
	const fCode = useRecoilValue(franState);
	const { data } = HOME_SERVICE.useMonthlyOrderList({ f_code: fCode });

	return (
		<Board boardClass='ordering' title='월별 발주 금액' url='/sales/statistic'>
			<table className='contents-list' cellPadding='0' cellSpacing='0'>
				<colgroup>
					<col width='104' />
					<col width='151' />
				</colgroup>
				<thead>
					<tr>
						<th>월</th>
						<th>발주금액</th>
					</tr>
				</thead>
				<tbody>
					{data?.map((order: any, idx: number, origData: any) => {
						const {deposit, log_date} = order;
						return (
							<tr key={log_date + idx}>
								<td className={idx === (origData.length - 1) ? 'last' : ''}>{log_date}</td>
								<td className={idx === (origData.length - 1) ? 'last' : ''}>{Utils.numberComma(deposit)}</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</Board>
	);
};

export default MonthlyOrder;
