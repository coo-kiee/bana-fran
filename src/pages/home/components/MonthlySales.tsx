import { Suspense, useMemo, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useRecoilValue } from 'recoil';
import { addMonths, subMonths, differenceInMonths, isSameMonth, format } from 'date-fns';

// global state
import { franState } from 'state';

// API
import HOME_SERVICE from 'service/homeService';
// Components
import Board from 'pages/home/components/board/Board';
import CalendarHeader from 'pages/home/components/calendar/CalendarHeader';
import CalendarBody from 'pages/home/components/calendar/CalendarBody';
import Loading from 'pages/common/loading';
import SuspenseErrorPage from 'pages/common/suspenseErrorPage';

const MonthlySales = ({ selectedDate }: { selectedDate: Date }) => {
  const fCode = useRecoilValue(franState);
  const searchMonth = useMemo(() => format(selectedDate, 'yyyy-MM-01'), [selectedDate]); // 선택한 달 (params)
  const { data } = HOME_SERVICE.useSalesTerms({ f_code: fCode, search_type: 'M', search_month: searchMonth });

  return <CalendarBody selectedDate={selectedDate} data={data || []} />;
};

const MonthlySalesConatiner = () => {
  const today = new Date();
  // 현재 날짜 state
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const prevMonth = () => {
    // 최대 12개월까지만 조회
    differenceInMonths(today, selectedDate) < 12 && setSelectedDate(subMonths(selectedDate, 1));
  };
  const nextMonth = () => {
    // 이번 달 이후엔 조회 X
    !isSameMonth(today, selectedDate) && setSelectedDate(addMonths(selectedDate, 1));
  };

  return (
    <Board boardClass="month-sales" title="Month" url="/sales/statistic" suffix="총 매출">
      <div className="contents-list calendar">
        <CalendarHeader selectedDate={selectedDate} prevMonth={prevMonth} nextMonth={nextMonth} />
        <ErrorBoundary
          fallbackRender={({ resetErrorBoundary }) => <SuspenseErrorPage resetErrorBoundary={resetErrorBoundary} />}
          onError={(e) => console.log('error on MonthlySales(Month 총 매출): ', e)}
        >
          <Suspense fallback={<Loading width={50} height={50} marginTop={100} />}>
            <MonthlySales selectedDate={selectedDate} />
          </Suspense>
        </ErrorBoundary>
      </div>
      <p className="noti">* 부가세 포함</p>
    </Board>
  );
};
export default MonthlySalesConatiner;
