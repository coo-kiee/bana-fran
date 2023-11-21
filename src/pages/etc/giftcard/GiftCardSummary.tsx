import { FC } from 'react';
import Utils from 'utils/Utils';

// hook
import useUserInfo from 'hooks/user/useUser';

// service
import ETC_SERVICE from 'service/etcService';

// type, constant
import { ETC_OVERALL_TABLE_INFO } from 'constants/etc';
import { ETC_TAB_TYPE } from 'types/etc/etcType';

// component
import TableList from 'pages/common/table/TableList';
import Table from 'pages/common/table';

const GiftCardSummary: FC<{ tabType: ETC_TAB_TYPE }> = ({ tabType }) => {
  const {
    user: { fCode },
  } = useUserInfo();

  const listData = ETC_SERVICE.useChkGiftCardStock({ f_code: fCode });

  return (
    <>
      <p className="title bullet">실물 상품권 재고 현황</p>
      <Table className="board-wrap board-top" cellPadding="0" cellSpacing="0">
        <Table.ColGroup colGroupAttributes={ETC_OVERALL_TABLE_INFO[tabType].colgroup} />
        <Table.TableHead thData={ETC_OVERALL_TABLE_INFO[tabType].thead} />
        <TableList
          queryRes={listData}
          render={({
            fran_stock_cnt1,
            fran_stock_amt1,
            fran_stock_cnt3,
            fran_stock_amt3,
            fran_stock_cnt5,
            fran_stock_amt5,
            hq_stock_cnt1,
            hq_stock_amt1,
            hq_stock_cnt3,
            hq_stock_amt3,
            hq_stock_cnt5,
            hq_stock_amt5,
          }) => {
            const cnt1_class = fran_stock_cnt1 !== hq_stock_cnt1 ? 'negative-value' : '';
            const cnt3_class = fran_stock_cnt3 !== hq_stock_cnt3 ? 'negative-value' : '';
            const cnt5_class = fran_stock_cnt5 !== hq_stock_cnt5 ? 'negative-value' : '';
            const total_class =
              fran_stock_cnt1 + fran_stock_cnt3 + fran_stock_cnt5 !== hq_stock_cnt1 + hq_stock_cnt3 + hq_stock_cnt5 ||
              fran_stock_amt1 + fran_stock_amt3 + fran_stock_amt5 !== hq_stock_amt1 + hq_stock_amt3 + hq_stock_amt5
                ? 'negative-value'
                : '';
            return (
              <>
                <tr>
                  <td>매장 보유 재고</td>
                  <td className={`align-center ${cnt1_class}`}>
                    {Utils.numberComma(fran_stock_cnt1)}장 ({Utils.numberComma(fran_stock_amt1)})
                  </td>
                  <td className={`align-center ${cnt3_class}`}>
                    {Utils.numberComma(fran_stock_cnt3)}장 ({Utils.numberComma(fran_stock_amt3)})
                  </td>
                  <td className={`align-center ${cnt5_class}`}>
                    {Utils.numberComma(fran_stock_cnt5)}장 ({Utils.numberComma(fran_stock_amt5)})
                  </td>
                  <td className={`align-center ${total_class}`}>
                    {Utils.numberComma(fran_stock_cnt1 + fran_stock_cnt3 + fran_stock_cnt5)}장 (
                    {Utils.numberComma(fran_stock_amt1 + fran_stock_amt3 + fran_stock_amt5)})
                  </td>
                </tr>
                <tr>
                  <td>본사DB 재고</td>
                  <td className={`align-center ${cnt1_class}`}>
                    {Utils.numberComma(hq_stock_cnt1)}장 ({Utils.numberComma(hq_stock_amt1)})
                  </td>
                  <td className={`align-center ${cnt3_class}`}>
                    {Utils.numberComma(hq_stock_cnt3)}장 ({Utils.numberComma(hq_stock_amt3)})
                  </td>
                  <td className={`align-center ${cnt5_class}`}>
                    {Utils.numberComma(hq_stock_cnt5)}장 ({Utils.numberComma(hq_stock_amt5)})
                  </td>
                  <td className={`align-center ${total_class}`}>
                    {Utils.numberComma(hq_stock_cnt1 + hq_stock_cnt3 + hq_stock_cnt5)}장 (
                    {Utils.numberComma(hq_stock_amt1 + hq_stock_amt3 + hq_stock_amt5)})
                  </td>
                </tr>
              </>
            );
          }}
        />
      </Table>
    </>
  );
};

export default GiftCardSummary;
