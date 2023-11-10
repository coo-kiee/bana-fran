import { FC, useRef } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useQueryErrorResetBoundary } from 'react-query';
import Utils from 'utils/Utils';
import { deepClone } from 'utils/deepClone';

// type, constants
import { SearchDate } from 'constants/calculate/common';
import { ETC_TAB_TYPE, RoyaltyDetailListType } from 'types/etc/etcType';
import { ETC_COL_THEAD_LIST, ETC_DETAIL_SUM_INFO, EtcDetailSumInfo, ROYALTY_SUM_TYPE } from 'constants/etc';

// hook
import useHandlePageDataCnt from 'hooks/pagination/useHandlePageDataCnt';
import usePageInfo from 'hooks/pagination/usePageInfo';
import useUserInfo from 'hooks/user/useUser';

// component
import Table from 'pages/common/table';
import ExcelButton from 'pages/common/excel/ExcelButton';
import Pages from 'pages/common/pagination/Pages';
import Sticky from 'pages/common/sticky';
import TableTotalInfo from 'pages/common/table/TableTotalInfo';
import SuspenseErrorPage from 'pages/common/suspenseErrorPage';

// service
import ETC_SERVICE from 'service/etcService';

interface RoyaltyDetailTableProps {
  searchDate: SearchDate;
  tabType: ETC_TAB_TYPE;
}
const RoyaltyDetailTable: FC<RoyaltyDetailTableProps> = ({ searchDate: { fromDate, toDate }, tabType }) => {
  const {
    user: { fCode, fCodeName },
  } = useUserInfo();
  const { reset } = useQueryErrorResetBoundary();
  const tableRef = useRef<HTMLTableElement>(null);
  const thRef = useRef<HTMLTableRowElement>(null);
  const { checkCurrentPageData } = usePageInfo();

  const listData = ETC_SERVICE.useEtcList<RoyaltyDetailListType[]>(
    'YGQA4CREHNZCZIXPF2AH',
    ['etc_royalty_list', JSON.stringify({ fCode, from: fromDate, to: toDate })],
    [fCode, fromDate, toDate],
  );

  useHandlePageDataCnt(listData);

  return (
    <>
      <TableTotalInfo
        fromDate={fromDate}
        toDate={toDate}
        queryRes={listData}
        initialDetailTotalInfo={ETC_DETAIL_SUM_INFO[tabType]}
        sumFn={(initial: EtcDetailSumInfo, datas: RoyaltyDetailListType[]) => {
          const sumObj = datas.reduce((arr, { total_amount }) => {
            if (ROYALTY_SUM_TYPE.TOTAL in arr) {
              arr[ROYALTY_SUM_TYPE.TOTAL].sum += total_amount;
            }
            return arr;
          }, deepClone(initial));

          return sumObj;
        }}
        priceInfo={
          <div className="price-info">
            <p className="hyphen">로열티는 일할 계산되지 않습니다. (월 단위 요금 청구)</p>
          </div>
        }
      />

      <Sticky reference={thRef.current} contentsRef={tableRef.current}>
        <Table.ColGroup colGroupAttributes={ETC_COL_THEAD_LIST[tabType].colgroup} />
        <Table.TableHead thData={ETC_COL_THEAD_LIST[tabType].thead} />
      </Sticky>
      <Table className="board-wrap" cellPadding="0" cellSpacing="0" tableRef={tableRef}>
        <Table.ColGroup colGroupAttributes={ETC_COL_THEAD_LIST[tabType].colgroup} />
        <Table.TableHead thData={ETC_COL_THEAD_LIST[tabType].thead} trRef={thRef} />
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ resetErrorBoundary }) => (
            <SuspenseErrorPage resetErrorBoundary={resetErrorBoundary} isTable={true} />
          )}
        >
          <Table.TableList
            queryRes={listData}
            render={(datas) =>
              datas?.map(({ std_date, state, suply_amount, tax_amount, total_amount }, index) => (
                <tr key={index} style={{ display: checkCurrentPageData(index) ? '' : 'none' }}>
                  <td className="align-center">{std_date}</td>
                  <td className="align-left">{state}</td>
                  <td className="align-right">{Utils.numberComma(suply_amount)}</td>
                  <td className="align-right">{Utils.numberComma(tax_amount)}</td>
                  <td className="align-right">{Utils.numberComma(total_amount)}</td>
                </tr>
              ))
            }
          />
        </ErrorBoundary>
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
          fileName={`${fromDate}~${toDate}_${fCodeName}_로열티내역`}
          addRowColor={{ rowNums: [1, 2], colors: ['d3d3d3', 'd3d3d3'] }}
        />
        <Pages />
      </div>
    </>
  );
};

export default RoyaltyDetailTable;
