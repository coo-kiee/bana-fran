import { useRecoilValue } from 'recoil';

// global states
import { franState } from 'state';
// API
import HOME_SERVICE from 'service/homeService';
// Components
import Board from 'pages/home/components/board/Board';
import Utils from 'utils/Utils';

const CalculateList = () => {
	const fCode = useRecoilValue(franState);
	const { data } = HOME_SERVICE.useHomeCalculateList({ f_code: fCode });

	return (
		<Board boardClass='status' title='최근 정산 현황' url='/caculate/list'>
			<table className='contents-list' cellPadding='0' cellSpacing='0'>
				<colgroup>
					<col width='105' />
					<col width='105' />
					<col width='105' />
					<col width='105' />
					<col width='105' />
				</colgroup>
				<tbody>
					<tr>
						<th>정산월</th>
						<th>보전금액</th>
						<th>청구금액</th>
						<th>합계</th>
						<th>상태</th>
					</tr>
					{data?.map((settlement: any, idx: number, origData: any) => {
						const { std_month, receive_charge, send_charge, total_send_charge, status, status_name } = settlement;
						return (
							<tr key={String(std_month) + idx}>
								<td className={status === 10 ? 'point' : ''}>{std_month}</td>
								<td className={status === 10 ? 'point' : ''}>{Utils.numberComma(send_charge)}</td>
								<td className={status === 10 ? 'point' : ''}>{Utils.numberComma(receive_charge)}</td>
								<td className={status === 10 ? 'point point-text' : ''}>{Utils.numberComma(total_send_charge)}</td>
								<td className={status === 10 ? 'point' : ''}>{status_name}</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</Board>
	);
};

export default CalculateList;
