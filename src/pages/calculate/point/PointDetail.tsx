import { useRef, useState } from 'react';
import { format, lastDayOfMonth, setMonth, setDate } from 'date-fns';
import { ErrorBoundary } from 'react-error-boundary';

// Const
import { CALCULATE_EXCEL_FILENAME, CALCULATE_TYPE } from 'constants/calculate/common';
import {
  POINT_DETAIL_COLGROUP_INFO,
  POINT_DETAIL_FILTER_OPTION,
  POINT_DETAIL_FILTER_TYPE,
  POINT_DETAIL_THEAD_INFO,
  POINT_DETAIL_TOTAL_INFO,
} from 'constants/calculate/point';

// Hook
import usePointFilterCondition from 'hooks/calculate/point/usePointFilterCondition';

// Component
import ExcelButton from 'pages/common/excel/ExcelButton';
import Pages from 'pages/common/pagination/Pages';
import PageInfoProvider from 'pages/common/pagination/PageInfoProvider';
import SuspenseErrorPage from 'pages/common/suspenseErrorPage';
import Table from 'pages/common/table';
import CalculateDetailTotalInfo from '../component/CalculateDetailTotalInfo';
import PointDetailList from './PointDetailList';
import CalculateDetailCalander from '../component/CalculateDetailCalander';
import CalculateDetailSearchButton from '../component/CalculateDetailSearchButton';
import CalculateDetailFilter from '../component/CalculateDetailFilter';

const PointDetail = () => {
  const tableRef = useRef<HTMLTableElement>(null); // 엑셀 다운에 사용

  const { filterCondition, handleFilterCondition } = usePointFilterCondition();

  const lastMonth = setMonth(new Date(), new Date().getMonth() - 1);
  const [searchDate, setSearchDate] = useState({
    fromDate: format(setDate(lastMonth, 1), 'yyyy-MM-dd'),
    toDate: format(lastDayOfMonth(lastMonth), 'yyyy-MM-dd'),
  });

  const handleSearchDate = (props: { fromDate: string; toDate: string }) => {
    setSearchDate(props);
  };

  return (
    <>
      <p className="title bullet">상세내역</p>
      <div className="search-wrap">
        <CalculateDetailCalander
          searchDate={searchDate}
          render={(calanderSearchDate) => (
            <CalculateDetailSearchButton handleSearch={() => handleSearchDate(calanderSearchDate)} />
          )}
        >
          <div className="select-wrap">
            <CalculateDetailFilter
              name={POINT_DETAIL_FILTER_TYPE.POINT}
              value={filterCondition[POINT_DETAIL_FILTER_TYPE.POINT]}
              options={POINT_DETAIL_FILTER_OPTION[POINT_DETAIL_FILTER_TYPE.POINT]}
              handleOnChange={handleFilterCondition}
            />
            &nbsp;
            <CalculateDetailFilter
              name={POINT_DETAIL_FILTER_TYPE.DEVICE}
              value={filterCondition[POINT_DETAIL_FILTER_TYPE.DEVICE]}
              options={POINT_DETAIL_FILTER_OPTION[POINT_DETAIL_FILTER_TYPE.DEVICE]}
              handleOnChange={handleFilterCondition}
            />
          </div>
        </CalculateDetailCalander>
      </div>
      <PageInfoProvider>
        <CalculateDetailTotalInfo
          searchDate={searchDate}
          initialDetailTotalInfo={POINT_DETAIL_TOTAL_INFO}
          render={(setDetailTotalInfo) => (
            <Table className="board-wrap board-top" cellPadding="0" cellSpacing="0" tableRef={tableRef}>
              <Table.ColGroup colGroupAttributes={POINT_DETAIL_COLGROUP_INFO} />
              <Table.TableHead style={{ whiteSpace: 'pre-line' }} thData={POINT_DETAIL_THEAD_INFO} />
              <ErrorBoundary FallbackComponent={() => <SuspenseErrorPage isTable={true} />}>
                <PointDetailList
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
            tableRef={tableRef}
            titleFrom={searchDate.fromDate}
            titleTo={searchDate.toDate}
            colspan={Object.values(POINT_DETAIL_COLGROUP_INFO).flatMap((item) => item.width)}
            excelFileName={CALCULATE_EXCEL_FILENAME[CALCULATE_TYPE.POINT]}
          />
          <Pages />
        </div>
      </PageInfoProvider>
    </>
  );
};

export default PointDetail;
