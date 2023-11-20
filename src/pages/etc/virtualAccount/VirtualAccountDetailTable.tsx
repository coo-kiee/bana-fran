import { FC, useRef } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useQueryErrorResetBoundary } from 'react-query';
import Utils from 'utils/Utils';
import { etcVirtualAccountTotalSumFn } from 'utils/etc/sumEtcDetailTotalInfo';

// type, constants
import { SearchDate } from 'constants/calculate/common';
import { ETC_TAB_TYPE, VirtualAccListType } from 'types/etc/etcType';
import { ETC_COL_THEAD_LIST, ETC_DETAIL_SUM_INFO } from 'constants/etc';

// hook
import useHandlePageDataCnt from 'hooks/pagination/useHandlePageDataCnt';
import usePageInfo from 'hooks/pagination/usePageInfo';
import useUserInfo from 'hooks/user/useUser';

// component
import Table from 'pages/common/table';
import ExcelButton from 'pages/common/excel/ExcelButton';
import Pages from 'pages/common/pagination/Pages';
import Sticky from 'pages/common/sticky';
import SuspenseErrorPage from 'pages/common/suspenseErrorPage';
import TableTotalInfo from 'pages/common/table/TableTotalInfo';

// service
import ETC_SERVICE from 'service/etcService';

const VirtualAccountDetailTable: FC<{ searchDate: SearchDate; tabType: ETC_TAB_TYPE }> = ({
  searchDate: { fromDate, toDate },
  tabType,
}) => {
  const {
    user: { fCode, fCodeName },
  } = useUserInfo();
  const { reset } = useQueryErrorResetBoundary();
  const tableRef = useRef<HTMLTableElement>(null);
  const thRef = useRef<HTMLTableRowElement>(null);
  const { checkCurrentPageData } = usePageInfo();
  const listData = ETC_SERVICE.useEtcList<VirtualAccListType[]>(
    'CS4QOSEGOQGJ8QCALM7L',
    ['etc_virtual_acc_detail_list', JSON.stringify({ fCode, from: fromDate, to: toDate })],
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
        sumFn={etcVirtualAccountTotalSumFn}
      >
        <div className="price-info">
          <p className="hyphen">로열티는 일할 계산되지 않습니다. (월 단위 요금 청구)</p>
        </div>
      </TableTotalInfo>

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
              datas?.map(({ balance, deposit, division, log_date, etc, state }, index) => {
                const display = checkCurrentPageData(index) ? '' : 'none';

                return (
                  <tr key={index} style={{ display }}>
                    <td className="align-center">{log_date}</td>
                    <td className={`align-center ${division === '차감' ? `negative-value` : ''}`}>{division}</td>
                    <td className={`align-center ${division === '차감' ? `negative-value` : ''}`}>
                      {Utils.numberComma(deposit)}
                    </td>
                    <td className="align-center">{state}</td>
                    <td className="balance">{Utils.numberComma(balance)}</td>
                    <td className="align-left">{etc}</td>
                  </tr>
                );
              })
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
          fileName={`${fromDate}~${toDate}_${fCodeName}_가상계좌내역`}
          addRowColor={{ rowNums: [1], colors: ['d3d3d3'] }}
          colWidths={ETC_COL_THEAD_LIST[tabType].colgroup.map(({ width }) => ({
            wpx: width !== '*' ? Number(((Number(width.replace('%', '')) * 1540) / 100).toFixed(2)) : 400,
          }))}
        />
        <Pages />
      </div>
    </>
  );
};

export default VirtualAccountDetailTable;
