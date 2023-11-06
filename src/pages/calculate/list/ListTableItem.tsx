// Const
import { ETC_CHARGE_MULTIPLY } from 'constants/calculate/etc';
import { LIST_STATUS } from 'constants/calculate/list';

// Type
import { CalculateLastMonthTotalQueryResult } from 'types/calculate/calculateType';

// Util
import Utils from 'utils/Utils';

// Component
import NoData from 'pages/common/noData';

interface IListTableItem {
  data: CalculateLastMonthTotalQueryResult;
}
const ListTableItem = ({ data }: IListTableItem) => {
  if (data.out.calculate_status === LIST_STATUS.NO_DATA) return <NoData text={data.out.error_msg} isTable showImg />;

  if (data.list.length === 0) return <NoData isTable />;

  return (
    <>
      {data.list.map((item) => {
        const multiplyValue = ETC_CHARGE_MULTIPLY[item.calculate_type];

        return (
          <tr key={item.calculate_d_id}>
            <td>{`${item.from_date}~${item.to_date}`}</td>
            <td>{item.calculate_type}</td>
            <td>{item.item_type}</td>
            <td>{item.item_detail}</td>
            <td>{Utils.numberComma(item.item_cnt)}</td>
            <td>{Utils.numberComma(item.item_price)}</td>
            <td className="align-right">{Utils.numberComma(item.supply_amt * multiplyValue)}</td>
            <td className="align-right">{Utils.numberComma(item.vat_amt * multiplyValue)}</td>
            <td className="align-right">
              <strong>{Utils.numberComma(item.total_amt * multiplyValue)}</strong>
            </td>
            <td>{item.etc}</td>
          </tr>
        );
      })}
    </>
  );
};

export default ListTableItem;
