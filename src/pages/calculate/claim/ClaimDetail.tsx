import React, { FC } from 'react';

// Const
import { CLAIM_TAB_TYPE, CLAIM_DETAIL_FILTER_TYPE } from 'constants/calculate/claim';

// Type
import { ClaimTabType } from 'constants/calculate/claim';

// Hook
import useClaimFilterCondition from 'hooks/calculate/claim/useClaimFilterCondition';
import useSearchDate from 'hooks/common/useSearchDate';

// Component
import ClaimDetailSort from './ClaimDetailSort';
import ClaimDetailTable from './ClaimDetailTable';
import PageInfoProvider from 'pages/common/pagination/PageInfoProvider';
import Calander from 'pages/common/calander';

interface IClaimDetail {
  tabType: ClaimTabType;
}
const ClaimDetail: FC<IClaimDetail> = ({ tabType }) => {
  const { filterCondition, handleFilterCondition } = useClaimFilterCondition(tabType);
  const { searchDate, handleSearchDate } = useSearchDate({ tabTypeObj: CLAIM_TAB_TYPE, tabType });

  return (
    <>
      <div className="search-wrap">
        <ClaimDetailSort
          tabType={tabType}
          filterCondition={filterCondition}
          handleFilterCondition={handleFilterCondition}
        />
        <Calander
          key={tabType}
          fromDate={searchDate.fromDate}
          toDate={searchDate.toDate}
          render={({ fromDate, toDate }) => (
            <button className="btn-search" onClick={() => handleSearchDate({ fromDate, toDate })}>
              조회
            </button>
          )}
        />
      </div>
      <PageInfoProvider>
        <ClaimDetailTable
          tabType={tabType}
          sortType={filterCondition[CLAIM_DETAIL_FILTER_TYPE.SORT]}
          searchDate={searchDate}
        />
      </PageInfoProvider>
    </>
  );
};

export default ClaimDetail;
