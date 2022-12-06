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

const MonthlySales = ({currentDate}: {currentDate:Date}) => {
	const fCode = useRecoilValue(franState);
    const searchMonth: string = useMemo(() => {return format(currentDate, 'yyyy-MM-01')}, [currentDate]); // 선택한 달 (params)
    
    const { data } = HOME_SERVICE.useSalesTerms({ f_code: fCode, search_type: 'M', search_month: searchMonth });
    
	return <CalendarBody currentDate={currentDate} data={data} />;
};

const MonthlySalesConatiner = () => {
    // 현재 날짜 state
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    // 오늘 기준
	const today = new Date();

    const prevMonth = () => {
        (differenceInMonths(today, currentDate) < 12) && setCurrentDate(subMonths(currentDate, 1));
    };
    const nextMonth = () => {
        !isSameMonth(today, currentDate) && setCurrentDate(addMonths(currentDate, 1));
    };

    return (
        <Board boardClass='month-sales' title='Month' url='/sales/statistic' suffix='총 매출'>
            <div className='contents-list calendar'>
                <CalendarHeader
                    currentDate={currentDate}
                    prevMonth={prevMonth}
                    nextMonth={nextMonth}
                />
                <ErrorBoundary fallbackRender={({ resetErrorBoundary }) => <SuspenseErrorPage resetErrorBoundary={resetErrorBoundary} />} onError={(e) => console.log('error on MonthlyOrder(Month 총 매출): ', e)}>
                    <Suspense fallback={<Loading width={50} height={50} marginTop={100} />}>
                        <MonthlySales currentDate={currentDate} />
                    </Suspense>
                </ErrorBoundary>
            </div>
            <p className='noti'>* 부가세 포함</p>
        </Board>
    )
}
export default MonthlySalesConatiner;
