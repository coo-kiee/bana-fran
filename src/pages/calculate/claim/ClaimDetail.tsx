import { FC, useRef, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { format, lastDayOfMonth, setDate, setMonth } from 'date-fns';

// Const
import { CALCULATE_EXCEL_FILENAME, CALCULATE_TYPE } from 'constants/calculate/common';
import {
  CLAIM_TAB_TYPE,
  CLAIM_DETAIL_TABLE_COLGROUP_INFO,
  CLAIM_DETAIL_TABLE_THEAD_INFO,
  CLAIM_DETAIL_FILTER_TYPE,
  CLAIM_DETAIL_TOTAL_INFO,
} from 'constants/calculate/claim';

// Type
import { ClaimTabType } from 'constants/calculate/claim';

// Hook
import useClaimFilterCondition from 'hooks/calculate/claim/useClaimFilterCondition';
import useUserInfo from 'hooks/user/useUser';

// Component
import SuspenseErrorPage from 'pages/common/suspenseErrorPage';
import ClaimDetailSort from './ClaimDetailSort';
import CalculateDetailSearch from '../component/CalculateDetailSearch';
import ClaimDetailList from './ClaimDetailList';
import CalculateDetailTotalInfo from '../component/CalculateDetailTotalInfo';
import ExcelButton from 'pages/common/excel/ExcelButton';
import PageInfoProvider from 'pages/common/pagination/PageInfoProvider';
import Pages from 'pages/common/pagination/Pages';
import Table from 'pages/common/table';

interface IClaimDetail {
  tabType: ClaimTabType;
}
const ClaimDetail: FC<IClaimDetail> = ({ tabType }) => {
  const tableRef = useRef<HTMLTableElement>(null); // 엑셀 다운에 사용

  const { user } = useUserInfo();
  const { filterCondition, handleFilterCondition } = useClaimFilterCondition(tabType);

  const lastMonth = setMonth(new Date(), new Date().getMonth() - 1);
  // 검색 조건
  const [searchDate, setSearchDate] = useState({
    [CLAIM_TAB_TYPE.ALL]: {
      fromDate: format(setDate(lastMonth, 1), 'yyyy-MM-dd'),
      toDate: format(lastDayOfMonth(lastMonth), 'yyyy-MM-dd'),
    },
    [CLAIM_TAB_TYPE.CALCULATE]: {
      fromDate: format(setDate(lastMonth, 1), 'yyyy-MM-dd'),
      toDate: format(lastDayOfMonth(lastMonth), 'yyyy-MM-dd'),
    },
  });

  const [handleSearchDate] = useState(() => (props: { fromDate: string; toDate: string }) => {
    setSearchDate((prev) => ({ ...prev, [tabType]: { ...prev[tabType], ...props } }));
  });

  return (
    <>
      <div className="search-wrap">
        <ClaimDetailSort
          tabType={tabType}
          filterCondition={filterCondition}
          handleFilterCondition={handleFilterCondition}
        />
        <CalculateDetailSearch key={tabType} searchDate={searchDate[tabType]} handleSearchDate={handleSearchDate} />
      </div>
      <PageInfoProvider>
        <CalculateDetailTotalInfo
          key={tabType}
          searchDate={searchDate[tabType]}
          initialDetailTotalInfo={CLAIM_DETAIL_TOTAL_INFO[tabType]}
          render={(setDetailTotalInfo) => (
            <Table className="board-wrap board-top" cellPadding="0" cellSpacing="0" tableRef={tableRef}>
              <Table.ColGroup colGroupAttributes={CLAIM_DETAIL_TABLE_COLGROUP_INFO[tabType]} />
              <Table.TableHead style={{ whiteSpace: 'pre-line' }} thData={CLAIM_DETAIL_TABLE_THEAD_INFO[tabType]} />
              <ErrorBoundary FallbackComponent={() => <SuspenseErrorPage isTable={true} />}>
                <ClaimDetailList
                  tabType={tabType}
                  sortType={filterCondition[CLAIM_DETAIL_FILTER_TYPE.SORT]}
                  searchDate={searchDate[tabType]}
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
            fileName={`${user.fCodeName}_${CALCULATE_EXCEL_FILENAME[CALCULATE_TYPE.CLAIM]}(${
              searchDate[tabType].fromDate
            }~${searchDate[tabType].toDate})`}
            sheetOption={{ origin: 'B3' }}
            colWidths={Object.values(CLAIM_DETAIL_TABLE_COLGROUP_INFO[tabType]).flatMap((item) =>
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

export default ClaimDetail;
