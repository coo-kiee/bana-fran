// Types
import { SalesStatisticData, SalesTableRowProps } from 'types/sales/salesType';
// Utils
import Utils from 'utils/Utils';

const TableRow = ({ data, isDisplay = true }: SalesTableRowProps<SalesStatisticData>) => {
  const {
    std_date,
    str_hour,
    total_sales_amt,
    app_delivery_amt,
    etc_delivery_amt,
    app_delivery_charge,
    e_coupon_charge,
    etc_delivery_charge,
    paid_sales_amt,
    kiosk_card_amt,
    app_card_amt,
    kiosk_e_pay_amt,
    app_e_pay_amt,
    pos_cash_amt,
    paid_point,
    hd_coupon_charge,
    hd_bana_point,
    stamp_coupon_charge,
    hd_coupon_charge_2,
    free_sales_amt,
    bana_point,
    fran_coupon_charge,
  } = data;

  // std_date 형태 가공 (T~Z 문자열 제거)
  const salesDate = std_date?.replace(/T.*Z/, '');
  const salesHour = `${str_hour} ~ ${Number(str_hour) < 9 ? `0${Number(str_hour) + 1}` : Number(str_hour) + 1}시`;

  return (
    <tr className={!isDisplay ? 'undisplay' : ''}>
      <td>{salesDate || salesHour}</td>
      <td>{Utils.numberComma(total_sales_amt)}</td>
      <td>{Utils.numberComma(app_delivery_amt)}</td>
      <td>{Utils.numberComma(app_delivery_charge)}</td>
      <td>{Utils.numberComma(paid_sales_amt)}</td>
      <td>{Utils.numberComma(kiosk_card_amt)}</td>
      <td>{Utils.numberComma(app_card_amt)}</td>
      <td>{Utils.numberComma(kiosk_e_pay_amt)}</td>
      <td>{Utils.numberComma(app_e_pay_amt)}</td>
      <td>{Utils.numberComma(pos_cash_amt)}</td>
      <td>{Utils.numberComma(etc_delivery_amt)}</td>
      <td>{Utils.numberComma(etc_delivery_charge)}</td>
      <td>{Utils.numberComma(paid_point)}</td>
      <td>{Utils.numberComma(e_coupon_charge)}</td>
      <td>{Utils.numberComma(hd_bana_point)}</td>
      <td>{Utils.numberComma(stamp_coupon_charge)}</td>
      <td>{Utils.numberComma(hd_coupon_charge)}</td>
      <td>{Utils.numberComma(free_sales_amt)}</td>
      <td>{Utils.numberComma(bana_point)}</td>
      <td>{Utils.numberComma(fran_coupon_charge)}</td>
      <td>{Utils.numberComma(hd_coupon_charge_2)}</td>
    </tr>
  );
};

export default TableRow;
