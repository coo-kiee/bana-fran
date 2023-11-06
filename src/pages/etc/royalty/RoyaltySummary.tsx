import Utils from 'utils/Utils';

// hook
import useUserInfo from 'hooks/user/useUser';

// service
import ETC_SERVICE from 'service/etcService';

// type
import { SummaryDataType } from 'types/etc/etcType';

const RoyaltySummary = () => {
  const {
    user: { fCode },
  } = useUserInfo();

  let summaryData = {
    std_date: '-',
    item: '(-)로열티',
    supply_amt: 0,
    vat_amt: 0,
    total_amt: 0,
  };

  const { data, isSuccess } = ETC_SERVICE.useEtcTotal<{ fran_store: number }, SummaryDataType>(
    'C0UUYOSQY3S4OUKJE7XG',
    { fran_store: fCode },
    'etc_royalty_total',
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

export default RoyaltySummary;
