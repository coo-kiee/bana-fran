import { useQueryErrorResetBoundary } from 'react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { subMonths } from 'date-fns';

// component
import EtcDetailTable from 'pages/etc/component/EtcDetailTable';
import MonthRankDetailTable from './MonthRankDetailTable';
import Calander from 'pages/common/calander';
import MembershipDetailTableFallback from 'pages/membership/component/MembershipDetailTableFallback';

// type, constants
import { MEMBERSHIP_COL_THEAD_LIST } from 'constants/membership';
import { MEMBERSHIP_PAGE_TYPE } from 'types/membership/membershipType';

// hook
import useSearchDate from 'hooks/common/useSearchDate';
import useUserInfo from 'hooks/user/useUser';

const MonthRankDetail = () => {
  const { reset } = useQueryErrorResetBoundary();
  const {
    user: { fCodeName },
  } = useUserInfo();
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

      <ErrorBoundary
        onReset={reset}
        fallbackRender={({ resetErrorBoundary }) => (
          <MembershipDetailTableFallback
            currentTab={MEMBERSHIP_PAGE_TYPE.MONTHRANK}
            resetErrorBoundary={resetErrorBoundary}
          />
        )}
      >
        <EtcDetailTable
          colgroup={MEMBERSHIP_COL_THEAD_LIST[MEMBERSHIP_PAGE_TYPE.MONTHRANK].colgroup}
          thead={MEMBERSHIP_COL_THEAD_LIST[MEMBERSHIP_PAGE_TYPE.MONTHRANK].thead}
          excelOption={{
            fileName: `${searchDate.fromDate}~${searchDate.toDate}_${fCodeName}_월간랭킹현황`,
            addRowColor: { rowNums: [1], colors: ['d3d3d3'] },
          }}
        >
          <MonthRankDetailTable searchDate={searchDate} />
        </EtcDetailTable>
      </ErrorBoundary>
    </>
  );
};

export default MonthRankDetail;
