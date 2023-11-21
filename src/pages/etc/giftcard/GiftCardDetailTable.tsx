import { FC, useRef } from 'react';
import Utils from 'utils/Utils';
import { etcGiftCardTotalSumFn } from 'utils/etc/sumEtcDetailTotalInfo';

// type, constants
import { DetailTableProps } from 'types/etc/etcType';
import { ETC_COL_THEAD_LIST, ETC_DETAIL_SUM_INFO, giftcardFilterOption } from 'constants/etc';

// hook
import useGiftcardOption from 'hooks/etc/useGiftcardOption';
import useHandlePageDataCnt from 'hooks/pagination/useHandlePageDataCnt';
import usePageInfo from 'hooks/pagination/usePageInfo';
import useUserInfo from 'hooks/user/useUser';

// component
import Table from 'pages/common/table';
import ExcelButton from 'pages/common/excel/ExcelButton';
import Pages from 'pages/common/pagination/Pages';
import Sticky from 'pages/common/sticky';
import TableTotalInfo from 'pages/common/table/TableTotalInfo';

// service
import ETC_SERVICE from 'service/etcService';

const GiftCardDetailTable: FC<DetailTableProps<giftcardFilterOption>> = ({
  searchDate: { fromDate, toDate },
  filterCondition,
  tabType,
}) => {
  const tableRef = useRef<HTMLTableElement>(null);
  const thRef = useRef<HTMLTableRowElement>(null);
  const {
    user: { fCode, fCodeName },
  } = useUserInfo();
  const { checkCurrentPageData } = usePageInfo();
  const { filterData } = useGiftcardOption();
  const listData = ETC_SERVICE.useGiftCardList(
    ['etc_gift_card_list', JSON.stringify({ fCode, from: fromDate, to: toDate })],
    [fCode, fromDate, toDate],
  );

  useHandlePageDataCnt(listData, filterCondition, filterData);

  return (
    <>
      <TableTotalInfo
        fromDate={fromDate}
        toDate={toDate}
        queryRes={listData}
        initialDetailTotalInfo={ETC_DETAIL_SUM_INFO[tabType]}
        sumFn={etcGiftCardTotalSumFn}
      >
        <div className="price-info">
          <p className="hyphen">키오스크/POS 판매금액은 가상계좌에서 자동 차감됩니다.</p>
          <p className="hyphen">어플 판매금액은 가상계좌에서 차감되지 않습니다.</p>
          <p className="hyphen">판매취소된 상품권은 폐기되므로 재고에 반영되지 않습니다.</p>
        </div>
      </TableTotalInfo>

      <Sticky reference={thRef.current} contentsRef={tableRef.current}>
        <Table.ColGroup colGroupAttributes={ETC_COL_THEAD_LIST[tabType].colgroup} />
        <Table.TableHead thData={ETC_COL_THEAD_LIST[tabType].thead} />
      </Sticky>
      <Table className="board-wrap" cellPadding="0" cellSpacing="0" tableRef={tableRef}>
        <Table.ColGroup colGroupAttributes={ETC_COL_THEAD_LIST[tabType].colgroup} />
        <Table.TableHead thData={ETC_COL_THEAD_LIST[tabType].thead} trRef={thRef} />
        <Table.TableList
          queryRes={listData}
          render={(datas) =>
            datas
              ?.filter((couponDetail) => filterData(filterCondition!, couponDetail))
              .map(({ std_date, gubun, item_name, item_cnt, item_amt, rcp_type, account_amt }, index) => (
                <tr key={index} style={{ display: checkCurrentPageData(index) ? '' : 'none' }}>
                  <td className="align-center">{std_date}</td>
                  <td className={`align-center ${gubun.includes('임의') ? 'negative-value' : ''}`}>{gubun}</td>
                  <td className="align-center">{item_name}</td>
                  <td className="align-center">
                    {Utils.numberComma(item_cnt)}장 ({Utils.numberComma(item_amt)})
                  </td>
                  <td className="align-center">{rcp_type}</td>
                  <td className={`align-center ${account_amt < 0 ? 'negative-value' : ''}`}>
                    {Utils.numberComma(account_amt)}
                  </td>
                </tr>
              ))
          }
        />
      </Table>
      <div className="result-function-wrap">
        <ExcelButton
          type={'table'}
          target={tableRef}
          tableRef={tableRef}
          sheetOption={{ origin: 'B3' }}
          colWidths={ETC_COL_THEAD_LIST[tabType].colgroup.map(({ width }) =>
            width !== '*' ? { wpx: Number(width) } : { wpx: 400 },
          )}
          fileName={`${fromDate}~${toDate}_${fCodeName}_상품권내역`}
          addRowColor={{ rowNums: [1], colors: ['d3d3d3'] }}
        />
        <Pages />
      </div>
    </>
  );
};

export default GiftCardDetailTable;
