import { useRecoilValue } from 'recoil';
// global state
import { franState } from 'state';
// API
import HOME_SERVICE from 'service/homeService';
// Components
import Board from './board/Board';
// Utils
import Utils from 'utils/Utils';

const Membership = () => {
	const fCode = useRecoilValue(franState);

	const { data } = HOME_SERVICE.useMembershipInfo({ f_code: fCode });
	// console.log(data);

	return (
		<Board boardClass='membership' title='멤버십 적립 현황' suffix='누적'>
			<table className='contents-list' cellPadding='0' cellSpacing='0'>
				<colgroup>
					<col width='258' />
					<col width='125' />
					<col width='*' />
				</colgroup>
				<tbody>
					<tr>
						<th>구분</th>
						<th>건수</th>
						<th>금액</th>
					</tr>
					<tr>
						<td className='sortation'>미사용 바나포인트(P)</td>
						<td className='align-right'>-</td>
						<td className='align-right'>{data && Utils.numberComma(data[0].bana_point)}P</td>
					</tr>
					<tr>
						<td className='sortation'>미사용 무료쿠폰(스탬프적립)</td>
						<td className='align-right'>{data && Utils.numberComma(data[0].stamp_coupon_cnt)}</td>
						<td className='align-right'>{data && Utils.numberComma(data[0].stamp_coupon_amt)}원</td>
					</tr>
					<tr>
						<td className='sortation'>미사용 무료쿠폰(월간랭킹)</td>
						<td className='align-right'>{data && Utils.numberComma(data[0].month_coupon_cnt)}</td>
						<td className='align-right'>-</td>
					</tr>
				</tbody>
			</table>
		</Board>
	);
};

export default Membership;
