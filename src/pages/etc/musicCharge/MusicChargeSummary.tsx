import { FC } from 'react';
import { format, subMonths } from 'date-fns';
import Utils from 'utils/Utils';

// hook
import useUserInfo from 'hooks/user/useUser';

// service
import ETC_SERVICE from 'service/etcService';

// component
import Table from 'pages/common/table';
import TableList from 'pages/common/table/TableList';

// type, constants
import { ETC_TAB_TITLE, ETC_OVERALL_TABLE_INFO } from 'constants/etc';
import { ETC_TAB_TYPE } from 'types/etc/etcType';

const MusicChargeSummary: FC<{ tabType: ETC_TAB_TYPE }> = ({ tabType }) => {
  const {
    user: { fCode },
  } = useUserInfo();

  const listData = ETC_SERVICE.useMusicTotal(fCode);

  return (
    <>
      <p className="title bullet">{format(subMonths(new Date(), 1), `yyyy년 M월 ${ETC_TAB_TITLE[tabType]}`)}</p>
      <Table className="board-wrap board-top" cellPadding="0" cellSpacing="0">
        <Table.ColGroup colGroupAttributes={ETC_OVERALL_TABLE_INFO[tabType].colgroup} />
        <Table.TableHead thData={ETC_OVERALL_TABLE_INFO[tabType].thead} />
        <TableList
          queryRes={listData}
          render={(datas) =>
            datas?.map(({ std_date, item, supply_amt, vat_amt, total_amt }, idx) => (
              <tr key={idx}>
                <td className="align-center">{std_date}</td>
                <td className="align-left">{item}</td>
                <td className="align-center">{Utils.numberComma(supply_amt)}</td>
                <td className="align-center">{Utils.numberComma(vat_amt)}</td>
                <td className="align-center">{Utils.numberComma(total_amt)}</td>
              </tr>
            ))
          }
        />
      </Table>
    </>
  );
};

export default MusicChargeSummary;
