// Types
import { DataArrayProps, SalesStatisticData } from 'types/sales/salesType';
// Utils
import Utils from 'utils/Utils';

const TablePrefixSum = ({ data }: DataArrayProps<SalesStatisticData>) => {
	// 합계 계산용 data 가공
	const {
        total_sales_amt, 
        app_delivery_amt, 
        etc_delivery_amt, 
        etc_delivery_charge, 
        app_delivery_charge, 
        paid_sales_amt, 
        kiosk_card_amt,
        app_card_amt,
        pos_cash_amt,
        paid_point,
        hd_coupon_charge,
        free_sales_amt,
        bana_point,
        fran_coupon_charge
    } = {
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
		fran_coupon_charge: data?.reduce((acc, cur) => { return acc + cur.fran_coupon_charge; }, 0)     // 가맹점 쿠폰
	};
    
    return (
        <tr>
            <td className='total'>합계</td>
            <td className='total'>
                {Utils.numberComma(total_sales_amt)}<br />
                <span>({total_sales_amt !== 0 ? 100 : 0}%)</span>
            </td>
            <td className='total'>
                {Utils.numberComma(app_delivery_amt)}<br />
                <span>
                    ({(100 * app_delivery_amt / total_sales_amt || 0).toFixed(1)}%)
                </span>
            </td>
            <td className='total'>{Utils.numberComma(app_delivery_charge)}</td>
            <td className='total'>
                {Utils.numberComma(paid_sales_amt)}<br />
                <span>
                    ({(100 * paid_sales_amt / total_sales_amt || 0).toFixed(1)}%)
                </span>
            </td>
            <td className='total'>
                {Utils.numberComma(kiosk_card_amt)}<br />
                <span>
                    ({(100 * kiosk_card_amt / total_sales_amt || 0).toFixed(1)}%)
                </span>
            </td>
            <td className='total'>
                {Utils.numberComma(app_card_amt)}<br />
                <span>
                    ({(100 * app_card_amt / total_sales_amt || 0).toFixed(1)}%)
                </span>
            </td>
            <td className='total'>
                {Utils.numberComma(pos_cash_amt)}<br />
                <span>
                    ({(100 * pos_cash_amt / total_sales_amt || 0).toFixed(1)}%)
                </span>
            </td>
            <td className='total'>
                {Utils.numberComma(etc_delivery_amt)}<br />
                <span>
                    ({(100 * etc_delivery_amt / total_sales_amt || 0).toFixed(1)}%)
                </span>
            </td>
            <td className='total'>
                {Utils.numberComma(etc_delivery_charge)}<br />
                <span>
                    ({(100 * etc_delivery_charge / total_sales_amt || 0).toFixed(1)}%)
                </span>
            </td>
            <td className='total'>
                {Utils.numberComma(paid_point)}<br />
                <span>({(100 * paid_point / total_sales_amt || 0).toFixed(1)}%)</span>
            </td>
            <td className='total'>
                {Utils.numberComma(hd_coupon_charge)}<br />
                <span>
                    ({(100 * hd_coupon_charge / total_sales_amt || 0).toFixed(1)}%)
                </span>
            </td>
            <td className='total'>
                {Utils.numberComma(free_sales_amt)}<br />
                <span>
                    ({(100 * free_sales_amt / total_sales_amt || 0).toFixed(1)}%)
                </span>
            </td>
            <td className='total'>
                {Utils.numberComma(bana_point)}<br />
                <span>({(100 * bana_point / total_sales_amt || 0).toFixed(1)}%)</span>
            </td>
            <td className='total'>
                {Utils.numberComma(fran_coupon_charge)}<br />
                <span>
                    ({(100 * fran_coupon_charge / total_sales_amt || 0).toFixed(1)}%)
                </span>
            </td>
        </tr>
    )
}

export default TablePrefixSum