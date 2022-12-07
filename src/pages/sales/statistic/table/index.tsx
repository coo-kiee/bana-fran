import { useRef, forwardRef } from 'react';
// Types
import { SalesTable } from 'types/sales/salesType';
// Utils
import Utils from 'utils/Utils';

// Components
import Loading from 'pages/common/loading';
import Sticky from 'pages/common/sticky';
import TableColGroup from 'pages/sales/statistic/table/TableColGroup';
import TableHead from 'pages/sales/statistic/table/TableHead';
import TableBody from './TableBody';

const SalesStatisticTable = forwardRef(({ data, isLoading, rowPerPage, currentPage, searchType }: SalesTable, forwardRef: React.LegacyRef<HTMLTableElement>) => {
	
	// totalSales: 합계 계산용 data 가공
	const totalSales = {
		total_sales_amt: data?.reduce((acc: any, cur: any) => { return acc + cur.total_sales_amt; }, 0), // 총 매출
		app_delivery_amt: data?.reduce((acc: any, cur: any) => { return acc + cur.app_delivery_amt; }, 0), // 앱주문 배달매출
		etc_delivery_amt: data?.reduce((acc: any, cur: any) => { return acc + cur.etc_delivery_amt; }, 0), // 쿠팡/배민
		etc_delivery_charge: data?.reduce((acc: any, cur: any) => { return acc + cur.etc_delivery_charge; }, 0), // 쿠팡/배민 배달비
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
	
	/* sticky 기준 ref */
	const stickyRef = useRef<HTMLTableRowElement>(null);
	
	return (
		<>
			<Sticky reference={stickyRef.current}>
				<TableColGroup />
				<TableHead />
			</Sticky>

			<table className='board-wrap board-top' cellPadding='0' cellSpacing='0' ref={forwardRef}>
				<TableColGroup />
				<TableHead ref={stickyRef} />
				<tbody>
					{
						isLoading ?
						<Loading width={100} height={100} marginTop={16} isTable={true} /> :
						<>
							<tr>
								<td className='total'>합계</td>
								<td className='total'>
									{Utils.numberComma(totalSales.total_sales_amt)}<br />
									<span>({totalSales.total_sales_amt !== 0 ? 100 : 0}%)</span>
								</td>
								<td className='total'>
									{Utils.numberComma(totalSales.app_delivery_amt)}<br />
									<span>
										({(100 * totalSales.app_delivery_amt / totalSales.total_sales_amt || 0).toFixed(1)}%)
									</span>
								</td>
								<td className='total'>{Utils.numberComma(totalSales.app_delivery_charge)}</td>
								<td className='total'>
									{Utils.numberComma(totalSales.paid_sales_amt)}<br />
									<span>
										({(100 * totalSales.paid_sales_amt / totalSales.total_sales_amt || 0).toFixed(1)}%)
									</span>
								</td>
								<td className='total'>
									{Utils.numberComma(totalSales.kiosk_card_amt)}<br />
									<span>
										({(100 * totalSales.kiosk_card_amt / totalSales.total_sales_amt || 0).toFixed(1)}%)
									</span>
								</td>
								<td className='total'>
									{Utils.numberComma(totalSales.app_card_amt)}<br />
									<span>
										({(100 * totalSales.app_card_amt / totalSales.total_sales_amt || 0).toFixed(1)}%)
									</span>
								</td>
								<td className='total'>
									{Utils.numberComma(totalSales.pos_cash_amt)}<br />
									<span>
										({(100 * totalSales.pos_cash_amt / totalSales.total_sales_amt || 0).toFixed(1)}%)
									</span>
								</td>
								<td className='total'>
									{Utils.numberComma(totalSales.etc_delivery_amt)}<br />
									<span>
										({(100 * totalSales.etc_delivery_amt / totalSales.total_sales_amt || 0).toFixed(1)}%)
									</span>
								</td>
								<td className='total'>
									{Utils.numberComma(totalSales.etc_delivery_charge)}<br /> 
									{/* 쿠팡배민배달비 */}
									<span>
										({(100 * totalSales.etc_delivery_charge / totalSales.total_sales_amt || 0).toFixed(1)}%)
									</span>
								</td>
								<td className='total'>
									{Utils.numberComma(totalSales.paid_point)}<br />
									<span>({(100 * totalSales.paid_point / totalSales.total_sales_amt || 0).toFixed(1)}%)</span>
								</td>
								<td className='total'>
									{Utils.numberComma(totalSales.hd_coupon_charge)}<br />
									<span>
										({(100 * totalSales.hd_coupon_charge / totalSales.total_sales_amt || 0).toFixed(1)}%)
									</span>
								</td>
								<td className='total'>
									{Utils.numberComma(totalSales.free_sales_amt)}<br />
									<span>
										({(100 * totalSales.free_sales_amt / totalSales.total_sales_amt || 0).toFixed(1)}%)
									</span>
								</td>
								<td className='total'>
									{Utils.numberComma(totalSales.bana_point)}<br />
									<span>({(100 * totalSales.bana_point / totalSales.total_sales_amt || 0).toFixed(1)}%)</span>
								</td>
								<td className='total'>
									{Utils.numberComma(totalSales.fran_coupon_charge)}<br />
									<span>
										({(100 * totalSales.fran_coupon_charge / totalSales.total_sales_amt || 0).toFixed(1)}%)
									</span>
								</td>
							</tr>
							<TableBody data={data} rowPerPage={rowPerPage} currentPage={currentPage} searchType={searchType} />
						</>
					}
				</tbody>
			</table>
		</>
	);
});

export default SalesStatisticTable;
