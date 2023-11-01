import React, { FC, useRef } from 'react';

// Const
import { CALCULATE_EXCEL_FILENAME, CALCULATE_TYPE } from 'constants/calculate/common';
import { CLAIM_TAB_TYPE, CLAIM_DETAIL_TABLE_COLGROUP_INFO, CLAIM_DETAIL_FILTER_TYPE } from 'constants/calculate/claim';

// Type
import { ClaimTabType } from 'constants/calculate/claim';

// Hook
import useClaimFilterCondition from 'hooks/calculate/claim/useClaimFilterCondition';
import useUserInfo from 'hooks/user/useUser';
import useSearchDate from 'hooks/common/useSearchDate';

// Component
import ClaimDetailSort from './ClaimDetailSort';
import CalculateDetailSearch from '../component/CalculateDetailSearch';
import ClaimDetailTable from './ClaimDetailTable';
import ExcelButton from 'pages/common/excel/ExcelButton';
import PageInfoProvider from 'pages/common/pagination/PageInfoProvider';
import Pages from 'pages/common/pagination/Pages';

interface IClaimDetail {
  tabType: ClaimTabType;
}
const ClaimDetail: FC<IClaimDetail> = ({ tabType }) => {
  const tableRef = useRef<HTMLTableElement>(null); // 엑셀 다운에 사용

  const { user } = useUserInfo();
  const { filterCondition, handleFilterCondition } = useClaimFilterCondition(tabType);
  const { searchDate, handleSearchDate } = useSearchDate({ tabTypeObj: CLAIM_TAB_TYPE, tabType });

  return (
    <React.Fragment key={tabType}>
      <div className="search-wrap">
        <ClaimDetailSort
          tabType={tabType}
          filterCondition={filterCondition}
          handleFilterCondition={handleFilterCondition}
        />
        <CalculateDetailSearch searchDate={searchDate} handleSearchDate={handleSearchDate} />
      </div>
      <PageInfoProvider>
        <ClaimDetailTable
          tableRef={tableRef}
          tabType={tabType}
          sortType={filterCondition[CLAIM_DETAIL_FILTER_TYPE.SORT]}
          searchDate={searchDate}
        />
        <div className="result-function-wrap">
          <ExcelButton
            type={'table'}
            target={tableRef}
            tableRef={tableRef}
            fileName={`${user.fCodeName}_${CALCULATE_EXCEL_FILENAME[CALCULATE_TYPE.CLAIM]}(${searchDate.fromDate}~${
              searchDate.toDate
            })`}
            sheetOption={{ origin: 'B3' }}
            colWidths={Object.values(CLAIM_DETAIL_TABLE_COLGROUP_INFO[tabType]).flatMap((item) =>
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

export default ClaimDetail;
