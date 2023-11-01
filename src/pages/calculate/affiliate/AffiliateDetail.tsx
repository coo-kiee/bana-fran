import React, { FC, useRef } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

// Const
import { CALCULATE_EXCEL_FILENAME } from 'constants/calculate/common';

// Type
import {
  AffiliateTabType,
  AFFILIATE_DETAIL_TABLE_COLGROUP_INFO,
  AFFILIATE_TAB_TYPE,
} from 'constants/calculate/affiliate';

// Hook
import useUserInfo from 'hooks/user/useUser';
import useSearchDate from 'hooks/common/useSearchDate';

// Component
import SuspenseErrorPage from 'pages/common/suspenseErrorPage';
import CalculateDetailSearch from '../component/CalculateDetailSearch';
import ExcelButton from 'pages/common/excel/ExcelButton';
import PageInfoProvider from 'pages/common/pagination/PageInfoProvider';
import Pages from 'pages/common/pagination/Pages';
import AffiliateDetailTable from './AffiliateDetailTable';

interface IAffiliateDetail {
  tabType: AffiliateTabType;
}
const AffiliateDetail: FC<IAffiliateDetail> = ({ tabType }) => {
  const tableRef = useRef<HTMLTableElement>(null); // 엑셀 다운에 사용

  const { user } = useUserInfo();
  const { searchDate, handleSearchDate } = useSearchDate({ tabTypeObj: AFFILIATE_TAB_TYPE, tabType });

  return (
    <React.Fragment key={tabType}>
      <div className="search-wrap">
        <p className="title">상세 내역</p>
        <CalculateDetailSearch searchDate={searchDate} handleSearchDate={handleSearchDate} />
      </div>
      <PageInfoProvider>
        <ErrorBoundary FallbackComponent={() => <SuspenseErrorPage />}>
          <AffiliateDetailTable tableRef={tableRef} tabType={tabType} searchDate={searchDate} />
        </ErrorBoundary>
        <div className="result-function-wrap">
          <ExcelButton
            type={'table'}
            target={tableRef}
            tableRef={tableRef}
            fileName={`${user.fCodeName}_${CALCULATE_EXCEL_FILENAME[tabType]}(${searchDate.fromDate}~${searchDate.toDate})`}
            sheetOption={{ origin: 'B3' }}
            colWidths={Object.values(AFFILIATE_DETAIL_TABLE_COLGROUP_INFO[tabType]).flatMap((item) =>
              item.width !== '*' ? { wpx: Number(item.width) * 1.2 } : { wpx: 400 },
            )}
            addRowColor={{ rowNums: [1, 2], colors: ['d3d3d3', 'd3d3d3'] }}
          />
          <Pages />
        </div>
      </PageInfoProvider>
    </React.Fragment>
  );
};

export default AffiliateDetail;
