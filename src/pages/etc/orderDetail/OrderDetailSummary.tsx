import { FC } from 'react';
import { format, subMonths } from 'date-fns';
import Utils from 'utils/Utils';

// service
import ETC_SERVICE from 'service/etcService';

// hook
import useUserInfo from 'hooks/user/useUser';

// type, constant
import { ETC_TAB_TYPE, OrderDetailSummaryDataType } from 'types/etc/etcType';
import { ETC_OVERALL_TABLE_INFO } from 'constants/etc';

// components
import Table from 'pages/common/table';
import TableList from 'pages/common/table/TableList';

const OrderDetailSummary: FC<{ tabType: ETC_TAB_TYPE }> = ({ tabType }) => {
  const {
    user: { fCode },
  } = useUserInfo();

  const listData = ETC_SERVICE.useEtcTotal<{ fran_store: number }, OrderDetailSummaryDataType>(
    '2Q65LKD2JBSZ3OWKWTWY',
    { fran_store: fCode },
    'etc_order_detail_statistic',
  );

  return (
    <>
      <p className="title bullet">월별 발주금액 통계</p>
      <Table className="board-wrap board-top" cellPadding="0" cellSpacing="0">
        <Table.ColGroup colGroupAttributes={ETC_OVERALL_TABLE_INFO[tabType].colgroup} />
        <Table.TableHead thData={ETC_OVERALL_TABLE_INFO[tabType].thead} />
        <TableList
          queryRes={listData}
          render={(datas) => {
            const previousMonths: { [key: string]: string }[] = Array.from({ length: 13 }, (_, idx1) => idx1).map(
              (el) => ({
                date_monthly: format(subMonths(new Date(), 12 - el), 'yyyy-MM'),
                amount: Utils.numberComma(datas[12 - el] ? datas[12 - el].amount : 0),
                supply_amt: Utils.numberComma(datas[12 - el] ? datas[12 - el].supply_amt : 0),
                vat_amt: Utils.numberComma(datas[12 - el] ? datas[12 - el].vat_amt : 0),
              }),
            );

            return (
              <>
                <tr>
                  <td className="align-center">발주금액(합계)</td>
                  {previousMonths
                    .map((el) => el.amount)
                    .map((el, idx) => (
                      <td key={`etc_table_amount_td_${idx}`} className="align-right">
                        {el}
                      </td>
                    ))}
                </tr>
                <tr>
                  <td className="align-center">공급가</td>
                  {previousMonths
                    .map((el) => el.supply_amt)
                    .map((el, idx) => (
                      <td key={`etc_table_supply_td_${idx}`} className="align-right">
                        {el}
                      </td>
                    ))}
                </tr>
                <tr>
                  <td className="align-center">부가세</td>
                  {previousMonths
                    .map((el) => el.vat_amt)
                    .map((el, idx) => (
                      <td key={`etc_table_vat_td_${idx}`} className="align-right">
                        {el}
                      </td>
                    ))}
                </tr>
              </>
            );
          }}
        />
      </Table>
    </>
  );
};

export default OrderDetailSummary;
