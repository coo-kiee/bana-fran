import React, { FC } from 'react';

// Type
import { AffiliateTabType, AFFILIATE_TAB_TYPE } from 'constants/calculate/affiliate';

// Hook
import useSearchDate from 'hooks/common/useSearchDate';

// Component
import PageInfoProvider from 'pages/common/pagination/PageInfoProvider';
import AffiliateDetailTable from './AffiliateDetailTable';
import Calander from 'pages/common/calander';

interface IAffiliateDetail {
  tabType: AffiliateTabType;
}
const AffiliateDetail: FC<IAffiliateDetail> = ({ tabType }) => {
  const { searchDate, handleSearchDate } = useSearchDate({ tabTypeObj: AFFILIATE_TAB_TYPE, tabType });

  return (
    <React.Fragment key={tabType}>
      <div className="search-wrap">
        <p className="title">상세 내역</p>
        <Calander
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
        <AffiliateDetailTable tabType={tabType} searchDate={searchDate} />
      </PageInfoProvider>
    </React.Fragment>
  );
};

export default AffiliateDetail;
