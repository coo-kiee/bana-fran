// Const
import { AffiliateTabType, AFFILIATE_TAB_TYPE } from 'constants/calculate/affiliate';
import { CalculateType, CALCULATE_TYPE } from 'constants/calculate/common';
import { ETC_CHARGE_MULTIPLY } from 'constants/calculate/etc';

// Type
import { CalculateLastMonthEachQueryResult } from 'types/calculate/calculateType';

// Util
import Utils from 'utils/Utils';

interface ICalculateLastMonthTableItem {
  data: CalculateLastMonthEachQueryResult;
  caculateType: CalculateType | AffiliateTabType;
}
const CalculateLastMonthTableItem = ({ caculateType, data }: ICalculateLastMonthTableItem) => {
  const render = () => {
    switch (caculateType) {
      case AFFILIATE_TAB_TYPE.COUPON:
        return (
          <tr>
            <td className="align-center">{`${data.from_date}~${data.to_date}`}</td>
            <td className="align-left">{data.item_name}</td>
            <td className="align-center">{data.publisher}</td>
            <td className="align-right">{Utils.numberComma(data.supply_amt)}</td>
            <td className="align-right">{Utils.numberComma(data.vat_amt)}</td>
            <td className="align-right">{Utils.numberComma(data.total_amt)}</td>
          </tr>
        );

      case CALCULATE_TYPE.ETC:
        const multiplyValue = ETC_CHARGE_MULTIPLY[data.calculate_type];

        return (
          <tr>
            <td className="align-center">{`${data.from_date}~${data.to_date}`}</td>
            <td className="align-center">{data.calculate_type}</td>
            <td className="align-left">{data.item_name}</td>
            <td className="align-right">{Utils.numberComma(data.supply_amt * multiplyValue)}</td>
            <td className="align-right">{Utils.numberComma(data.vat_amt * multiplyValue)}</td>
            <td className="align-right">{Utils.numberComma(data.total_amt * multiplyValue)}</td>
          </tr>
        );

      default:
        return (
          <tr>
            <td className="align-center">{`${data.from_date}~${data.to_date}`}</td>
            <td className="align-left">{data.item_name}</td>
            <td className="align-right">{Utils.numberComma(data.supply_amt)}</td>
            <td className="align-right">{Utils.numberComma(data.vat_amt)}</td>
            <td className="align-right">{Utils.numberComma(data.total_amt)}</td>
          </tr>
        );
    }
  };
  return <>{render()}</>;
};

export default CalculateLastMonthTableItem;
