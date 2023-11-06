import Utils from 'utils/Utils';

// hook
import useUserInfo from 'hooks/user/useUser';

// service
import ETC_SERVICE from 'service/etcService';

// type
import { VirtualAccountSummaryDataType } from 'types/etc/etcType';

const VirtualAccountSummary = () => {
  const {
    user: { fCode },
  } = useUserInfo();

  let summaryData = {
    fran_name: '-',
    bank_code: '-',
    account: '0',
    total_charge: '0',
    used_amount: '0',
    balance: 0,
  };

  const { data, isSuccess } = ETC_SERVICE.useEtcTotal<{ fran_store: number }, VirtualAccountSummaryDataType>(
    'FXFBHJ5WT2GYEO9EFZ46',
    { fran_store: fCode },
    'etc_virtual_acc_balance_total',
  );

  if (isSuccess) {
    summaryData = data;
  }

  return (
    <tr>
      <td className="align-center">{summaryData.fran_name}</td>
      <td className="align-left">{summaryData.bank_code}</td>
      <td className="align-center">{summaryData.account}</td>
      <td className="align-right">{Utils.numberComma(summaryData.total_charge)}원</td>
      <td className="align-right">{Utils.numberComma(summaryData.used_amount)}원</td>
      <td className="align-right">
        <strong>{Utils.numberComma(summaryData.balance)}원</strong>
      </td>
    </tr>
  );
};

export default VirtualAccountSummary;
