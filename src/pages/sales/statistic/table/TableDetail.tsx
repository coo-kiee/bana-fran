// Types
import { SalesStatisticData, SalesTableDetailProps } from "types/sales/salesType";
// Utils
import Utils from "utils/Utils";
// Components
import NoData from "pages/common/noData";

const TableDetail = ({data, rowPerPage, currentPage, searchType}: SalesTableDetailProps<SalesStatisticData[]>) => {
    return (
        <>{
            data.length > 0 ? 
            data.map((salesData, idx) => {
                const {
                    std_date,
                    total_sales_amt,
                    app_delivery_amt,
                    etc_delivery_amt,
                    app_delivery_charge,
                    etc_delivery_charge,
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

                // pagination
                const isDisplay = (currentPage - 1) * rowPerPage <= idx && currentPage * rowPerPage > idx;
                return (
                    <tr key={idx} style={isDisplay ? {} : { display: 'none' }}>
                        <td>{searchType === 'M' ? std_date : Utils.converDateFormat(new Date(std_date), '-')}</td>
                        <td>{Utils.numberComma(total_sales_amt)}</td>
                        <td>{Utils.numberComma(app_delivery_amt)}</td>
                        <td>{Utils.numberComma(app_delivery_charge)}</td>
                        <td>{Utils.numberComma(paid_sales_amt)}</td>
                        <td>{Utils.numberComma(kiosk_card_amt)}</td>
                        <td>{Utils.numberComma(app_card_amt)}</td>
                        <td>{Utils.numberComma(pos_cash_amt)}</td>
                        <td>{Utils.numberComma(etc_delivery_amt)}</td>
                        <td>{Utils.numberComma(etc_delivery_charge)}</td>
                        <td>{Utils.numberComma(paid_point)}</td>
                        <td>{Utils.numberComma(hd_coupon_charge)}</td>
                        <td>{Utils.numberComma(free_sales_amt)}</td>
                        <td>{Utils.numberComma(bana_point)}</td>
                        <td>{Utils.numberComma(fran_coupon_charge)}</td>
                    </tr>
                );
            }) : 
            <NoData isTable={true} rowSpan={1} colSpan={15} paddingTop={20} paddingBottom={20} />
        }</>
    )
}

export default TableDetail;