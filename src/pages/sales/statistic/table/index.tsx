
// Utils
import Utils from 'utils/Utils';

interface StatisticTable {
	data: any;
	rowPerPage: number;
	currentPage: number;
}

const SalesStatisticTable = ({ data, rowPerPage, currentPage }: StatisticTable) => {
	// totalSales: 합계 계산용 data 가공
	const totalSales = {
		total_sales_amt: data?.reduce((acc: any, cur: any) => { return acc + cur.total_sales_amt; }, 0), // 총 매출
		app_delivery_amt: data?.reduce((acc: any, cur: any) => { return acc + cur.app_delivery_amt; }, 0), // 앱주문 배달매출
		etc_delivery_amt: data?.reduce((acc: any, cur: any) => { return acc + cur.etc_delivery_amt; }, 0), // 쿠팡/배민
		app_delivery_charge: data?.reduce((acc: any, cur: any) => { return acc + cur.app_delivery_charge; }, 0), // 배달비
		paid_sales_amt: data?.reduce((acc: any, cur: any) => { return acc + cur.paid_sales_amt; }, 0), // 유상매출 합계
		kiosk_card_amt: data?.reduce((acc: any, cur: any) => { return acc + cur.kiosk_card_amt; }, 0), // 카드(키오스크/POS)
		app_card_amt: data?.reduce((acc: any, cur: any) => { return acc + cur.app_card_amt; }, 0), // 카드매출(어플)
		pos_cash_amt: data?.reduce((acc: any, cur: any) => { return acc + cur.pos_cash_amt; }, 0), // 현금매출
		paid_point: data?.reduce((acc: any, cur: any) => { return acc + cur.paid_point; }, 0), // 유상포인트
		hd_coupon_charge: data?.reduce((acc: any, cur: any) => { return acc + cur.hd_coupon_charge; }, 0), // 본사쿠폰
		free_sales_amt: data?.reduce((acc: any, cur: any) => { return acc + cur.free_sales_amt; }, 0), // 무상서비스
		bana_point: data?.reduce((acc: any, cur: any) => { return acc + cur.bana_point; }, 0), // 바나포인트
		fran_coupon_charge: data?.reduce((acc: any, cur: any) => { return acc + cur.fran_coupon_charge; }, 0), // 가맹점 쿠폰
	};

	return (
		<tbody>
			<tr>
				<th rowSpan={2}>일시</th>
				<th rowSpan={2} className='bg-a'>
					총매출<br />(부가세 포함)
				</th>
				<th rowSpan={2} className='bg-b'>
					앱 주문<br />배달매출<br />(배달비 포함)
				</th>
				<th rowSpan={2} className='bg-c'>
					쿠팡/배민<br />배달 매출<br />(배달비 제외)
				</th>
				<th rowSpan={2} className='bg_d'>
					배달비<br />(앱 주문)
				</th>
				<th rowSpan={2} className='bg-e bg-e-right'>
					유상매출<br />합계<br />(부가세 포함)
				</th>
				<th colSpan={5} className='bg-e bg-e-bottom'>
					유상 매출 상세 (부가세 포함)
				</th>
				<th rowSpan={2} className='bg-right'>
					무상서비스 비용 합계
				</th>
				<th colSpan={2} className='bg-bottom'>
					바나포인트 (적립&월간랭킹보상)
				</th>
			</tr>
			<tr>
				<th className='bg-e height-63'>
					카드매출<br />(키오스크/POS)
				</th>
				<th className='bg-e height-63'>
					카드매출<br />(어플)
				</th>
				<th className='bg-e height-63'>
					현금매출<br />(POS)
				</th>
				<th className='bg-e height-63'>
					유상포인트<br />매출
				</th>
				<th className='bg-e height-63'>
					본사 쿠폰<br />매출
				</th>
				<th>
					바나포인트<br />사용금액
				</th>
				<th>
					가맹점 쿠폰<br />사용금액
				</th>
			</tr>
			<tr>
				<td className='total'>합계</td>
				<td className='total'>
					{Utils.numberComma(totalSales.total_sales_amt)}<br />
					<span>({(100 * totalSales.total_sales_amt) / totalSales.total_sales_amt}%)</span>
				</td>
				<td className='total'>
					{Utils.numberComma(totalSales.app_delivery_amt)}<br />
					<span>({Math.round((100 * totalSales.app_delivery_amt) / totalSales.total_sales_amt)}%)</span>
				</td>
				<td className='total'>
					{Utils.numberComma(totalSales.etc_delivery_amt)}<br />
					<span>({Math.round((100 * totalSales.etc_delivery_amt) / totalSales.total_sales_amt)}%)</span>
				</td>
				<td className='total'>{Utils.numberComma(totalSales.app_delivery_charge)}</td>
				<td className='total'>
					{Utils.numberComma(totalSales.paid_sales_amt)}<br />
					<span>({Math.round((100 * totalSales.paid_sales_amt) / totalSales.total_sales_amt)}%)</span>
				</td>
				<td className='total'>
					{Utils.numberComma(totalSales.kiosk_card_amt)}<br />
					<span>({Math.round((100 * totalSales.kiosk_card_amt) / totalSales.total_sales_amt)}%)</span>
				</td>
				<td className='total'>
					{Utils.numberComma(totalSales.app_card_amt)}<br />
					<span>({Math.round((100 * totalSales.app_card_amt) / totalSales.total_sales_amt)}%)</span>
				</td>
				<td className='total'>
					{Utils.numberComma(totalSales.pos_cash_amt)}<br />
					<span>({Math.round((100 * totalSales.pos_cash_amt) / totalSales.total_sales_amt)}%)</span>
				</td>
				<td className='total'>
					{Utils.numberComma(totalSales.paid_point)}<br />
					<span>({Math.round((100 * totalSales.paid_point) / totalSales.total_sales_amt)}%)</span>
				</td>
				<td className='total'>
					{Utils.numberComma(totalSales.hd_coupon_charge)}<br />
					<span>({Math.round((100 * totalSales.hd_coupon_charge) / totalSales.total_sales_amt)}%)</span>
				</td>
				<td className='total'>
					{Utils.numberComma(totalSales.free_sales_amt)}<br />
					<span>({Math.round((100 * totalSales.free_sales_amt) / totalSales.total_sales_amt)}%)</span>
				</td>
				<td className='total'>
					{Utils.numberComma(totalSales.bana_point)}<br />
					<span>({Math.round((100 * totalSales.bana_point) / totalSales.total_sales_amt)}%)</span>
				</td>
				<td className='total'>
					{Utils.numberComma(totalSales.fran_coupon_charge)}<br />
					<span>({Math.round((100 * totalSales.fran_coupon_charge) / totalSales.total_sales_amt)}%)</span>
				</td>
			</tr>
			{data?.map((salesData: any, idx: number) => {
				const {
					std_date,
					total_sales_amt,
					app_delivery_amt,
					etc_delivery_amt,
					app_delivery_charge,
					paid_sales_amt,
					kiosk_card_amt,
					app_card_amt,
					pos_cash_amt,
					paid_point,
					hd_coupon_charge,
					free_sales_amt,
					bana_point,
					fran_coupon_charge,
				} = salesData;

				return (
					((currentPage - 1) * rowPerPage <= idx) &&
					(currentPage * rowPerPage > idx) &&
					<tr key={idx}>
						<td>{Utils.converDateFormat(new Date(std_date), '-')}</td>
						<td>{Utils.numberComma(total_sales_amt)}</td>
						<td>{Utils.numberComma(app_delivery_amt)}</td>
						<td>{Utils.numberComma(etc_delivery_amt)}</td>
						<td>{Utils.numberComma(app_delivery_charge)}</td>
						<td>{Utils.numberComma(paid_sales_amt)}</td>
						<td>{Utils.numberComma(kiosk_card_amt)}</td>
						<td>{Utils.numberComma(app_card_amt)}</td>
						<td>{Utils.numberComma(pos_cash_amt)}</td>
						<td>{Utils.numberComma(paid_point)}</td>
						<td>{Utils.numberComma(hd_coupon_charge)}</td>
						<td>{Utils.numberComma(free_sales_amt)}</td>
						<td>{Utils.numberComma(bana_point)}</td>
						<td>{Utils.numberComma(fran_coupon_charge)}</td>
					</tr>
				);
			})}
		</tbody>
	);
};

export default SalesStatisticTable;
