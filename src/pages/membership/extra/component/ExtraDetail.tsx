import { ErrorBoundary } from 'react-error-boundary';
import { useQueryErrorResetBoundary } from 'react-query';
import { subMonths } from 'date-fns';

// component
import EtcDetailTable from 'pages/etc/component/EtcDetailTable';
import ExtraDetailTable from './ExtraDetailTable';
import MembershipDetailTableFallback from 'pages/membership/component/MembershipDetailTableFallback';
import Calander from 'pages/common/calander';

// type, constants
import { MEMBERSHIP_PAGE_TYPE } from 'types/membership/membershipType';
import { MEMBERSHIP_COL_THEAD_LIST } from 'constants/membership';

// hook
import useUserInfo from 'hooks/user/useUser';
import useSearchDate from 'hooks/common/useSearchDate';

const ExtraDetail = () => {
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

      <ErrorBoundary
        onReset={reset}
        fallbackRender={({ resetErrorBoundary }) => (
          <MembershipDetailTableFallback
            currentTab={MEMBERSHIP_PAGE_TYPE.EXTRA}
            resetErrorBoundary={resetErrorBoundary}
          />
        )}
      >
        <EtcDetailTable
          colgroup={MEMBERSHIP_COL_THEAD_LIST[MEMBERSHIP_PAGE_TYPE.EXTRA].colgroup}
          thead={EXTRA_DETAIL_LIST.thead}
          excelOption={{
            fileName: `${searchDate.fromDate}~${searchDate.toDate}_${fCodeName}_멤버십누적내역`,
            addRowColor: { rowNums: [1, 2], colors: ['d3d3d3', 'd3d3d3'] },
          }}
        >
          <ExtraDetailTable searchDate={searchDate} />
        </EtcDetailTable>
      </ErrorBoundary>
    </>
  );
};

export default ExtraDetail;

const EXTRA_DETAIL_LIST = {
  thead: [
    [
      { children: '일시', rowSpan: 2 },
      { children: '스탬프', colSpan: 3, className: 'price-area boder-th-b' },
      { children: '무료음료쿠폰(스탬프적립&월간랭킹보상)', colSpan: 3, className: 'boder-th-a' },
      { children: '바나포인트 (적립&월간랭킹보상)', colSpan: 3, className: 'price-area boder-th-b' },
    ],
    [
      { children: '지급 수', className: 'price-area height-63' },
      { children: '쿠폰전환 수', className: 'price-area height-63' },
      { children: '유효기간 소멸 수', className: 'price-area height-63' },
      {
        children: (
          <>
            발급 수<p>(금액)</p>
          </>
        ),
        className: 'height-63',
      },
      {
        children: (
          <>
            사용 수<p>(금액)</p>
          </>
        ),
        className: 'height-63',
      },
      {
        children: (
          <>
            유효기간 소멸 수<p>(금액)</p>
          </>
        ),
        className: 'height-63',
      },
      { children: '적립', className: 'price-area height-63' },
      { children: '사용', className: 'price-area height-63' },
      { children: '유효기간 소멸', className: 'price-area height-63' },
    ],
  ],
};
