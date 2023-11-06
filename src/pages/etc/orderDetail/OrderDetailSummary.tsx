import { useRecoilValue } from 'recoil';

// service
import ETC_SERVICE from 'service/etcService';

// state
import { franState } from 'state';

const OrderDetailSummary = () => {
  const franCode = useRecoilValue(franState);
  let tableBody: { amount: string[]; supply_amt: string[]; vat_amt: string[] } = {
    amount: [],
    supply_amt: [],
    vat_amt: [],
  }; // 프로시저 성공 후 업데이트
  const { data, isSuccess: totalSuccess } = ETC_SERVICE.useOrderDetailStatistic(franCode);

  if (totalSuccess) {
    tableBody = { amount: data.amount, supply_amt: data.supply_amt, vat_amt: data.vat_amt };
  }

  return (
    <>
      <tr key="etc_table_tr_total">
        <td className="align-center">발주금액(합계)</td>
        {tableBody.amount.map((el, idx) => (
          <td key={`etc_table_total_td_${idx}`} className="align-right">
            {el}
          </td>
        ))}
      </tr>
      <tr key="etc_table_tr_supply">
        <td className="align-center">공급가</td>
        {tableBody.supply_amt.map((el, idx) => (
          <td key={`etc_table_supply_td_${idx}`} className="align-right">
            {el}
          </td>
        ))}
      </tr>
      <tr key="etc_table_tr_vat">
        <td className="align-center">부가세</td>
        {tableBody.vat_amt.map((el, idx) => (
          <td key={`etc_table_vat_${idx}`} className="align-right">
            {el}
          </td>
        ))}
      </tr>
    </>
  );
};

export default OrderDetailSummary;
