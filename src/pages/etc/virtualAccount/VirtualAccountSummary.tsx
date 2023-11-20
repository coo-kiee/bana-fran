import { FC } from 'react';
import Utils from 'utils/Utils';

// hook
import useUserInfo from 'hooks/user/useUser';

// service
import ETC_SERVICE from 'service/etcService';

// type, constants
import { ETC_TAB_TYPE, VirtualAccountSummaryDataType } from 'types/etc/etcType';
import { ETC_OVERALL_TABLE_INFO } from 'constants/etc';

// components
import Table from 'pages/common/table';
import TableList from 'pages/common/table/TableList';

const VirtualAccountSummary: FC<{ tabType: ETC_TAB_TYPE }> = ({ tabType }) => {
  const {
    user: { fCode },
  } = useUserInfo();

  const listData = ETC_SERVICE.useEtcTotal<{ fran_store: number }, VirtualAccountSummaryDataType>(
    'FXFBHJ5WT2GYEO9EFZ46',
    { fran_store: fCode },
    'etc_virtual_acc_balance_total',
  );

  return (
    <>
      <p className="title bullet">가상 계좌 잔액</p>
      <Table className="board-wrap board-top" cellPadding="0" cellSpacing="0">
        <Table.ColGroup colGroupAttributes={ETC_OVERALL_TABLE_INFO[tabType].colgroup} />
        <Table.TableHead thData={ETC_OVERALL_TABLE_INFO[tabType].thead} />
        <TableList
          queryRes={listData}
          isPagination={false}
          render={({ fran_name, bank_code, account, total_charge, used_amount, balance }) => (
            <tr>
              <td className="align-center">{fran_name}</td>
              <td className="align-left">{bank_code}</td>
              <td className="align-center">{account}</td>
              <td className="align-right">{Utils.numberComma(total_charge)}원</td>
              <td className="align-right">{Utils.numberComma(used_amount)}원</td>
              <td className="align-right">
                <strong>{Utils.numberComma(balance)}원</strong>
              </td>
            </tr>
          )}
        />
      </Table>
    </>
  );
};

export default VirtualAccountSummary;
