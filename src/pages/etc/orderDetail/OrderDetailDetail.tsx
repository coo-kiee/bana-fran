import { FC, useState, useRef } from 'react';
import { useQueryErrorResetBoundary } from 'react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { subMonths } from 'date-fns';
import Utils from 'utils/Utils';

// type
import { ETC_TAB_TYPE, OrderDetailListType } from 'types/etc/etcType';

// component
import Sticky from 'pages/common/sticky';
import EtcDetailSummary from '../component/EtcDetailSummary';
import Table from 'pages/common/table';
import ExcelButton from 'pages/common/excel/ExcelButton';
import PageInfoProvider from 'pages/common/pagination/PageInfoProvider';
import OrderDetailDetailTable from './OrderDetailDetailTable';
import Pages from 'pages/common/pagination/Pages';
import OrderDetailExcelTable from './OrderDetailExcelTable';
import Select from 'pages/common/select';
import Calander from 'pages/common/calander';
import SuspenseErrorPage from 'pages/common/suspenseErrorPage';

// hook
import useUserInfo from 'hooks/user/useUser';
import useSearchDate from 'hooks/common/useSearchDate';
import useOrderOption from 'hooks/etc/useOrderOption';

// type, constants
import {
  ETC_COL_THEAD_LIST,
  ETC_ORDER_EXCEL_COL_THEAD_LIST,
  ETC_ORDER_FILTER_OPTION,
  ETC_ORDER_FILTER_TYPE,
  orderFilterOption,
} from 'constants/etc';
import { SearchDate } from 'constants/calculate/common';

const OrderDetailDetail: FC<{ openOrderDetailModal: (nOrderID: number) => void }> = ({ openOrderDetailModal }) => {
  const { searchDate, handleSearchDate } = useSearchDate({
    fromDate: subMonths(new Date(), 1),
    toDate: new Date(),
  });
  const { filterCondition, handleFilterCondition } = useOrderOption();

  return (
    <>
      <p className="title bullet">상세내역</p>
      <div className="search-wrap">
        <Calander
          fromDate={searchDate.fromDate}
          toDate={searchDate.toDate}
          render={({ fromDate, toDate }) => (
            <>
              <div className="select-wrap">
                <Select
                  name={ETC_ORDER_FILTER_TYPE.STATE}
                  value={filterCondition[ETC_ORDER_FILTER_TYPE.STATE]}
                  options={ETC_ORDER_FILTER_OPTION[ETC_ORDER_FILTER_TYPE.STATE]}
                  handleOnChange={handleFilterCondition}
                />
              </div>
              <button type="button" className="btn-search" onClick={() => handleSearchDate({ fromDate, toDate })}>
                조회
              </button>
            </>
          )}
        />
      </div>

      <OrderDetailDetailData
        searchDate={searchDate}
        filterCondition={filterCondition}
        openOrderDetailModal={openOrderDetailModal}
      />
    </>
  );
};

interface OrderDetailDetailDataProps {
  searchDate: SearchDate;
  filterCondition: Record<keyof orderFilterOption, string>;
  openOrderDetailModal: (nOrderID: number) => void;
}
const OrderDetailDetailData: FC<OrderDetailDetailDataProps> = ({
  searchDate,
  filterCondition,
  openOrderDetailModal,
}) => {
  const { fromDate, toDate } = searchDate;
  const {
    user: { fCodeName },
  } = useUserInfo();
  const { reset } = useQueryErrorResetBoundary();
  const [detailTotalInfo, setDetailTotalInfo] = useState([] as OrderDetailListType[]);

  const tableRef = useRef<HTMLTableElement>(null);
  const thRef = useRef<HTMLTableRowElement>(null);
  const viewportTableRef = useRef<HTMLTableElement>(null);

  const summaryResult = [
    {
      title: '총 발주금액 합계',
      children: `${Utils.numberComma(
        detailTotalInfo.reduce((acc: any, cur: any) => (cur.state !== 50 ? (acc += cur.amount) : acc), 0) || 0,
      )}원`,
    },
    {
      title: '총 발주금액 공급가',
      children: `${Utils.numberComma(
        detailTotalInfo.reduce((acc: any, cur: any) => (cur.state !== 50 ? (acc += cur.supply_amt) : acc), 0) || 0,
      )}원`,
    },
    {
      title: '총 발주금액 부가세',
      children: `${Utils.numberComma(
        detailTotalInfo.reduce((acc: any, cur: any) => (cur.state !== 50 ? (acc += cur.vat_amt) : acc), 0) || 0,
      )}원`,
    },
  ];

  return (
    <>
      <EtcDetailSummary
        searchDate={`${fromDate} ~ ${toDate}`}
        summaryResult={summaryResult}
        currentTab={ETC_TAB_TYPE.ORDER}
      />

      <Sticky reference={thRef.current} contentsRef={viewportTableRef.current}>
        <Table.ColGroup colGroupAttributes={ETC_COL_THEAD_LIST[ETC_TAB_TYPE.ORDER].colgroup} />
        <Table.TableHead thData={ETC_COL_THEAD_LIST[ETC_TAB_TYPE.ORDER].thead} />
      </Sticky>
      <PageInfoProvider>
        <Table className="board-wrap" cellPadding="0" cellSpacing="0" tableRef={viewportTableRef}>
          <Table.ColGroup colGroupAttributes={ETC_COL_THEAD_LIST[ETC_TAB_TYPE.ORDER].colgroup} />
          <Table.TableHead thData={ETC_COL_THEAD_LIST[ETC_TAB_TYPE.ORDER].thead} trRef={thRef} />
          <ErrorBoundary
            onReset={reset}
            fallbackRender={({ resetErrorBoundary }) => (
              <SuspenseErrorPage resetErrorBoundary={resetErrorBoundary} isTable={true} />
            )}
          >
            <OrderDetailDetailTable
              searchDate={searchDate}
              filterCondition={filterCondition}
              setDetailTotalInfo={setDetailTotalInfo}
              openOrderDetailModal={openOrderDetailModal}
            />
          </ErrorBoundary>
        </Table>
        <div className="result-function-wrap">
          <ExcelButton
            type={'table'}
            target={tableRef}
            tableRef={tableRef}
            colWidths={ETC_ORDER_EXCEL_COL_THEAD_LIST.colgroup.map(({ width }) =>
              width !== '*' ? { wpx: Number(width) } : { wpx: 400 },
            )}
            addRowColor={{ rowNums: [1], colors: ['d3d3d3'] }}
            fileName={`${fromDate}~${toDate}_${fCodeName}_발주내역`}
          />
          <Pages />
        </div>

        {/* 엑셀 데이터 테이블 */}
        <Table className="board-wrap" cellPadding="0" cellSpacing="0" tableRef={tableRef} style={{ display: 'none' }}>
          <Table.ColGroup colGroupAttributes={ETC_ORDER_EXCEL_COL_THEAD_LIST.colgroup} />
          <Table.TableHead thData={ETC_ORDER_EXCEL_COL_THEAD_LIST.thead} />
          <OrderDetailExcelTable searchDate={searchDate} filterCondition={filterCondition} />
        </Table>
      </PageInfoProvider>
    </>
  );
};

export default OrderDetailDetail;
