import { FC } from 'react';
import { subMonths } from 'date-fns';

// component
import MonthRankDetailTable from './MonthRankDetailTable';
import Calander from 'pages/common/calander';
import MembershipDetailTableFallback from 'pages/membership/component/MembershipDetailTableFallback';
import PageInfoProvider from 'pages/common/pagination/PageInfoProvider';

// type, constants
import { MEMBERSHIP_PAGE_TYPE } from 'types/membership/membershipType';

// hook
import useSearchDate from 'hooks/common/useSearchDate';

const MonthRankDetail: FC<{ pageType: MEMBERSHIP_PAGE_TYPE }> = ({ pageType }) => {
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
          dateFormat="yyyy-MM"
          showMonthYearPicker
        />
      </div>

      <PageInfoProvider fallbackComponent={() => <MembershipDetailTableFallback pageType={pageType} />}>
        <MonthRankDetailTable searchDate={searchDate} pageType={pageType} />
      </PageInfoProvider>
    </>
  );
};

export default MonthRankDetail;
