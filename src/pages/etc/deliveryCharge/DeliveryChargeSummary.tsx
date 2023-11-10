import Utils from 'utils/Utils';

// hook
import useUserInfo from 'hooks/user/useUser';

// service
import ETC_SERVICE from 'service/etcService';

// type
import { SummaryDataType } from 'types/etc/etcType';

const DeliveryChargeSummary = () => {
  const { user } = useUserInfo();

  let summaryData = {
    std_date: '-',
    item: '바나 딜리버리 수수료(주문금액의 2%, VAT 별도) - 차감예정(익월 5일)',
    supply_amt: 0,
    vat_amt: 0,
    total_amt: 0,
  };
  const { data, isSuccess } = ETC_SERVICE.useEtcTotal<{ fran_store: number }, SummaryDataType>(
    'YDKG75HJE31EPGS47MXQ',
    { fran_store: user.fCode },
    'etc_delivery_total',
  );

  if (isSuccess) {
    summaryData = data;
  }

  return (
    <tr>
      <td className="align-center">{summaryData.std_date}</td>
      <td className="align-left">{summaryData.item}</td>
      <td className="align-right">{Utils.numberComma(summaryData.supply_amt)}</td>
      <td className="align-right">{Utils.numberComma(summaryData.vat_amt)}</td>
      <td className="align-right">{Utils.numberComma(summaryData.total_amt)}</td>
    </tr>
  );
};

export default DeliveryChargeSummary;
