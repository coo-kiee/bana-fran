import { FC } from 'react';
import { subMonths } from 'date-fns';

// component
import PageInfoProvider from 'pages/common/pagination/PageInfoProvider';
import ExtraDetailTable from './ExtraDetailTable';
import Calander from 'pages/common/calander';
import MembershipDetailTableFallback from 'pages/membership/component/MembershipDetailTableFallback';

// type, constant
import { MEMBERSHIP_PAGE_TYPE } from 'types/membership/membershipType';

// hook
import useSearchDate from 'hooks/common/useSearchDate';

const ExtraDetail: FC<{ pageType: MEMBERSHIP_PAGE_TYPE }> = ({ pageType }) => {
  const { searchDate, handleSearchDate } = useSearchDate({
    dateFormat: 'yyyy-MM',
    fromDate: subMonths(new Date(), 1),
    toDate: new Date(),
  });

  return (
    <>
      <p className="title bullet">상세내역</p>
      <div className="search-wrap">
        <Calander
          fromDate={searchDate.fromDate}
          toDate={searchDate.toDate}
          render={({ fromDate, toDate }) => (
            <button type="button" className="btn-search" onClick={() => handleSearchDate({ fromDate, toDate })}>
              조회
            </button>
          )}
          showMonthYearPicker
          dateFormat="yyyy-MM"
        />
      </div>

      <div className="search-result-wrap">
        <div className="search-date">
          <p>
            조회기간: {searchDate.fromDate} ~ {searchDate.toDate}
          </p>
        </div>
      </div>
      <PageInfoProvider fallbackComponent={() => <MembershipDetailTableFallback pageType={pageType} />}>
        <ExtraDetailTable searchDate={searchDate} pageType={pageType} />
      </PageInfoProvider>
    </>
  );
};

export default ExtraDetail;
