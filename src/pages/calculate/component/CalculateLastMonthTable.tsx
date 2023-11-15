import { FC } from 'react';
import { subMonths } from 'date-fns';

// Const
import { ETC_CHARGE_MULTIPLY } from 'constants/calculate/etc';
import { AffiliateTabType } from 'constants/calculate/affiliate';
import {
  CALCULATE_TITLE,
  CALCULATE_TYPE,
  CalculateType,
  LAST_MONTH_TABLE_COLGROUP_INFO,
  LAST_MONTH_TABLE_THEAD_INFO,
} from 'constants/calculate/common';

// Hook
import useUserInfo from 'hooks/user/useUser';

// Util
import Utils from 'utils/Utils';

// API
import { useCalculateLastMonthEach } from 'service/calculateService';

// Component
import Table from 'pages/common/table';
import CalculateLastMonthTableItem from './CalculateLastMonthTableItem';

interface CalculateLastMonthTableProps {
  caculateType: CalculateType | AffiliateTabType;
}
const CalculateLastMonthTable: FC<CalculateLastMonthTableProps> = ({ caculateType }) => {
  const { user } = useUserInfo();

  const lastMonthDate = subMonths(new Date(), 1);

  // Query
  const lastMonthRes = useCalculateLastMonthEach({
    f_code: user.fCode,
    search_item_type: caculateType,
  });
  const totalInfo =
    caculateType === CALCULATE_TYPE.ETC &&
    lastMonthRes.data?.reduce(
      (arr, cur) => {
        if (ETC_CHARGE_MULTIPLY[cur.calculate_type]) {
          const multiplyValue = ETC_CHARGE_MULTIPLY[cur.calculate_type];

          arr.supply += cur.supply_amt * multiplyValue;
          arr.vat += cur.vat_amt * multiplyValue;
          arr.total += cur.total_amt * multiplyValue;
        }

        return arr;
      },
      { supply: 0, vat: 0, total: 0 },
    );

  return (
    <>
      <p className="title bullet">
        {lastMonthDate.getFullYear()}년 {lastMonthDate.getMonth() + 1}월 {CALCULATE_TITLE[caculateType]}
      </p>
      <Table className="board-wrap board-top" cellPadding="0" cellSpacing="0">
        <Table.ColGroup colGroupAttributes={LAST_MONTH_TABLE_COLGROUP_INFO[caculateType]} />
        <Table.TableHead thData={LAST_MONTH_TABLE_THEAD_INFO[caculateType]} />
        <Table.TableList
          queryRes={lastMonthRes}
          isPagination={false}
          render={(datas) => (
            <>
              {datas.map((data, index) => (
                <CalculateLastMonthTableItem key={index} data={data} caculateType={caculateType} />
              ))}
              {totalInfo && (
                <tr>
                  <td className="align-center">{`${datas[0].from_date}~${datas[0].to_date}`}</td>
                  <td className="align-center" colSpan={2}>
                    합계
                  </td>
                  <td className="align-right">{Utils.numberComma(totalInfo.supply)}</td>
                  <td className="align-right">{Utils.numberComma(totalInfo.vat)}</td>
                  <td className="align-right">{Utils.numberComma(totalInfo.total)}</td>
                </tr>
              )}
            </>
          )}
        />
      </Table>
    </>
  );
};

export default CalculateLastMonthTable;
