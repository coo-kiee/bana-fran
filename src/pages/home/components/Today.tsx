import { useRecoilValue } from 'recoil';
// global state
import { franState } from 'state';

// API
import HOME_SERVICE from 'service/homeService';
// Components
import Board from 'pages/home/components/Board';
// Utils
import Utils from 'utils/Utils';



const Today = () => {
	const fCode = useRecoilValue(franState);
	const { data } = HOME_SERVICE.useSalesToday({ f_code: fCode });
	
	let	totalSales = 0,
		paidSales = 0,
		freeService = 0;

	// 바나포인트결제, 카드결제, 현금결제, 배달매출, 가맹점쿠폰결제, 본사쿠폰결제, 유상포인트결제
	const salesData = data ? data[0] : [];
	let { bana_point, card_charge, cash_charge, delivery_charge, fran_coupon_charge, hd_coupon_charge, paid_point } = salesData;

	if (data) {
		freeService = fran_coupon_charge + bana_point;
		paidSales = card_charge + cash_charge + paid_point + hd_coupon_charge;
		totalSales = freeService + paidSales + delivery_charge;
	}

	return (
			<Board boardClass='today' title='Today' suffix='총 매출'>
				<table className='contents-list' cellPadding='0' cellSpacing='0'>
					<colgroup>
						<col width='163' />
						<col width='163' />
						<col width='163' />
						<col width='163' />
						<col width='163' />
						<col width='163' />
						<col width='163' />
						<col width='163' />
						<col width='163' />
						<col width='163' />
					</colgroup>
					<tbody>
						<tr>
							<th rowSpan={2}>총매출 <br /> (부가세 포함)</th>
							<th rowSpan={2}>배달매출 <br /> (부가세 포함) </th>
							<th colSpan={5}>유상매출 (부가세 포함)</th>
							<th colSpan={3}>무상 서비스 비용</th>
						</tr>
						<tr>
							<td className='sales'>합계</td>
							<td className='sales'>카드결제</td>
							<td className='sales'>현금결제</td>
							<td className='sales'>유상포인트결제</td>
							<td className='sales'>본사쿠폰결제</td>
							<td className='service'>합계</td>
							<td className='service'>가맹점쿠폰결제</td>
							<td className='service'>바나포인트결제</td>
						</tr>
						<tr>
							<td className='point'>{Utils.numberComma(totalSales)}원</td>
							<td>
								{data && Utils.numberComma(delivery_charge || 0)}원<span className='percentage'>({Math.round(100 * delivery_charge/totalSales || 0)}%)</span>
							</td>
							<td className='point'>
								{data && Utils.numberComma(paidSales)}원<span className='percentage'>({Math.round(100 * paidSales/totalSales || 0)}%)</span>
							</td>
							<td>
								{data && Utils.numberComma(card_charge || 0)}원<span className='percentage'>({Math.round(100 * card_charge/totalSales || 0)}%)</span>
							</td>
							<td>
								{data && Utils.numberComma(cash_charge || 0)}원<span className='percentage'>({Math.round(100 * cash_charge/totalSales || 0)}%)</span>
							</td>
							<td>
								{data && Utils.numberComma(paid_point || 0)}원<span className='percentage'>({Math.round(100 * paid_point/totalSales || 0)}%)</span>
							</td>
							<td>
								{data && Utils.numberComma(hd_coupon_charge || 0)}원<span className='percentage'>({Math.round(100 * hd_coupon_charge/totalSales || 0)}%)</span>
							</td>
							<td className='point'>
								{Utils.numberComma(fran_coupon_charge + bana_point)}원<span className='percentage'>({Math.round(100 * freeService/totalSales || 0)}%)</span>
							</td>
							<td>
								{data && Utils.numberComma(fran_coupon_charge || 0)}원<span className='percentage'>({Math.round(100 * fran_coupon_charge/totalSales || 0)}%)</span>
							</td>
							<td>
								{data && Utils.numberComma(bana_point || 0)}원<span className='percentage'>({Math.round(100 * bana_point/totalSales || 0)}%)</span>
							</td>
						</tr>
					</tbody>
				</table>
                <div className='description'>
                    <p className='hyphen'>총 매출(자체 앱주문 배달비 포함): 유상매출+무상서비스</p>
                    <p className='hyphen'>유상매출과 무상서비스 금액에 자체 앱주문 배달비 포함.</p>
                    <p className='hyphen'>배달매출: 앱배달/쿠팡/배민 합계. (앱주문 배달비 포함)</p>
                </div>
			</Board>
	);
};

export default Today;
