import { useRef, useState } from 'react';
import { format, lastDayOfMonth, setMonth, setDate } from 'date-fns';
import { ErrorBoundary } from 'react-error-boundary';

// Const
import { CALCULATE_EXCEL_FILENAME, CALCULATE_TYPE } from 'constants/calculate/common';
import {
  COUPON_DETAIL_COLGROUP_INFO,
  COUPON_DETAIL_FILTER_OPTION,
  COUPON_DETAIL_FILTER_TYPE,
  COUPON_DETAIL_THEAD_INFO,
  COUPON_DETAIL_TOTAL_INFO,
} from 'constants/calculate/coupon';

// Hook
import useCouponFilterCondition from 'hooks/calculate/coupon/useCouponFilterCondition';
import useCouponFilters from 'hooks/calculate/coupon/useCouponFilters';
import useUserInfo from 'hooks/user/useUser';

// Component
import ExcelButton from 'pages/common/excel/ExcelButton';
import Pages from 'pages/common/pagination/Pages';
import PageInfoProvider from 'pages/common/pagination/PageInfoProvider';
import SuspenseErrorPage from 'pages/common/suspenseErrorPage';
import Table from 'pages/common/table';
import CalculateDetailTotalInfo from '../component/CalculateDetailTotalInfo';
import CalculateDetailSearch from '../component/CalculateDetailSearch';
import CalculateDetailFilter from '../component/CalculateDetailFilter';
import CouponDetailList from './CouponDetailList';

const CouponDetail = () => {
  const tableRef = useRef<HTMLTableElement>(null); // 엑셀 다운에 사용

  const { user } = useUserInfo();
  const { couponFilters } = useCouponFilters();
  const { filterCondition, handleFilterCondition } = useCouponFilterCondition();

  const lastMonth = setMonth(new Date(), new Date().getMonth() - 1);
  const [searchDate, setSearchDate] = useState({
    fromDate: format(setDate(lastMonth, 1), 'yyyy-MM-dd'),
    toDate: format(lastDayOfMonth(lastMonth), 'yyyy-MM-dd'),
  });

  return (
    <>
      <p className="title bullet">상세내역</p>
      <div className="search-wrap">
        <CalculateDetailSearch searchDate={searchDate} handleSearchDate={setSearchDate}>
          <div className="select-wrap">
            <CalculateDetailFilter
              name={COUPON_DETAIL_FILTER_TYPE.COUPON}
              value={filterCondition[COUPON_DETAIL_FILTER_TYPE.COUPON]}
              options={couponFilters}
              handleOnChange={handleFilterCondition}
            />
            &nbsp;
            <CalculateDetailFilter
              name={COUPON_DETAIL_FILTER_TYPE.DEVICE}
              value={filterCondition[COUPON_DETAIL_FILTER_TYPE.DEVICE]}
              options={COUPON_DETAIL_FILTER_OPTION[COUPON_DETAIL_FILTER_TYPE.DEVICE]}
              handleOnChange={handleFilterCondition}
            />
          </div>
        </CalculateDetailSearch>
      </div>
      <PageInfoProvider>
        <CalculateDetailTotalInfo
          searchDate={searchDate}
          initialDetailTotalInfo={COUPON_DETAIL_TOTAL_INFO}
          render={(setDetailTotalInfo) => (
            <Table className="board-wrap board-top" cellPadding="0" cellSpacing="0" tableRef={tableRef}>
              <Table.ColGroup colGroupAttributes={COUPON_DETAIL_COLGROUP_INFO} />
              <Table.TableHead style={{ whiteSpace: 'pre-line' }} thData={COUPON_DETAIL_THEAD_INFO} />
              <ErrorBoundary FallbackComponent={() => <SuspenseErrorPage isTable={true} />}>
                <CouponDetailList
                  searchDate={searchDate}
                  filterCondition={filterCondition}
                  setDetailTotalInfo={setDetailTotalInfo}
                />
              </ErrorBoundary>
            </Table>
          )}
        />
        <div className="result-function-wrap">
          <ExcelButton
            type={'table'}
            target={tableRef}
            tableRef={tableRef}
            fileName={`${user.fCodeName}_${CALCULATE_EXCEL_FILENAME[CALCULATE_TYPE.COUPON]}(${searchDate.fromDate}~${
              searchDate.toDate
            })`}
            sheetOption={{ origin: 'B3' }}
            colWidths={Object.values(COUPON_DETAIL_COLGROUP_INFO).flatMap((item) =>
              item.width !== '*' ? { wpx: Number(item.width) * 1.2 } : { wpx: 400 },
            )}
            addRowColor={{ rowNums: [1, 2], colors: ['d3d3d3', 'd3d3d3'] }}
          />
          <Pages />
        </div>
      </PageInfoProvider>
    </>
  );
};

export default CouponDetail;
