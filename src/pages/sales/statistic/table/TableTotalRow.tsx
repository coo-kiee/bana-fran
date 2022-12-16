// Types
import { SalesStatisticData } from 'types/sales/salesType';
// Utils
import Utils from 'utils/Utils';

const TableTotalRow = ({ data }: { data: SalesStatisticData[] }) => {
    
	// totalSales: 합계 계산용 data 가공
	const totalSales = {
		total_sales_amt: data?.reduce((acc, cur) => { return acc + cur.total_sales_amt; }, 0),          // 총 매출
		app_delivery_amt: data?.reduce((acc, cur) => { return acc + cur.app_delivery_amt; }, 0),        // 앱주문 배달매출
		etc_delivery_amt: data?.reduce((acc, cur) => { return acc + cur.etc_delivery_amt; }, 0),        // 쿠팡/배민
		etc_delivery_charge: data?.reduce((acc, cur) => { return acc + cur.etc_delivery_charge; }, 0),  // 쿠팡/배민 배달비
		app_delivery_charge: data?.reduce((acc, cur) => { return acc + cur.app_delivery_charge; }, 0),  // 배달비
		paid_sales_amt: data?.reduce((acc, cur) => { return acc + cur.paid_sales_amt; }, 0),            // 유상매출 합계
		kiosk_card_amt: data?.reduce((acc, cur) => { return acc + cur.kiosk_card_amt; }, 0),            // 카드(키오스크/POS)
		app_card_amt: data?.reduce((acc, cur) => { return acc + cur.app_card_amt; }, 0),                // 카드매출(어플)
		pos_cash_amt: data?.reduce((acc, cur) => { return acc + cur.pos_cash_amt; }, 0),                // 현금매출
		paid_point: data?.reduce((acc, cur) => { return acc + cur.paid_point; }, 0),                    // 유상포인트
		hd_coupon_charge: data?.reduce((acc, cur) => { return acc + cur.hd_coupon_charge; }, 0),        // 본사쿠폰
		free_sales_amt: data?.reduce((acc, cur) => { return acc + cur.free_sales_amt; }, 0),            // 무상서비스
		bana_point: data?.reduce((acc, cur) => { return acc + cur.bana_point; }, 0),                    // 바나포인트
		fran_coupon_charge: data?.reduce((acc, cur) => { return acc + cur.fran_coupon_charge; }, 0),    // 가맹점 쿠폰
	};

    return (
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
    )
}

export default TableTotalRow