import { FC } from 'react';
import Utils from 'utils/Utils';

// hook
import useUserInfo from 'hooks/user/useUser';

// service
import ETC_SERVICE from 'service/etcService';

// type
import { ETC_TAB_TYPE, SummaryDataType } from 'types/etc/etcType';
import { ETC_TAB_TITLE, ETC_OVERALL_TABLE_INFO } from 'constants/etc';
import { format, subMonths } from 'date-fns';
import Table from 'pages/common/table';
import TableList from 'pages/common/table/TableList';

const RoyaltySummary: FC<{ tabType: ETC_TAB_TYPE }> = ({ tabType }) => {
  const {
    user: { fCode },
  } = useUserInfo();

  const listData = ETC_SERVICE.useEtcTotal<{ fran_store: number }, SummaryDataType>(
    'C0UUYOSQY3S4OUKJE7XG',
    { fran_store: fCode },
    'etc_royalty_total',
  );

  return (
    <>
      <p className="title bullet">{format(subMonths(new Date(), 1), `yyyy년 M월 ${ETC_TAB_TITLE[tabType]} 내역`)}</p>
      <Table className="board-wrap board-top" cellPadding="0" cellSpacing="0">
        <Table.ColGroup colGroupAttributes={ETC_OVERALL_TABLE_INFO[tabType].colgroup} />
        <Table.TableHead thData={ETC_OVERALL_TABLE_INFO[tabType].thead} />
        <TableList
          queryRes={listData}
          render={({ std_date, item, supply_amt, vat_amt, total_amt }) => (
            <tr>
              <td className="align-center">{std_date}</td>
              <td className="align-left">{item}</td>
              <td className="align-right">{Utils.numberComma(supply_amt)}</td>
              <td className="align-right">{Utils.numberComma(vat_amt)}</td>
              <td className="align-right">{Utils.numberComma(total_amt)}</td>
            </tr>
          )}
        />
      </Table>
    </>
  );
};

export default RoyaltySummary;
