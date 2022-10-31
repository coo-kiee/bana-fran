import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useQueryClient } from 'react-query';
import { addMonths, subMonths } from 'date-fns';

// global state
import { franState } from 'state';

// API
import HOME_SERVICE from 'service/homeService';
// Components
import Board from 'pages/home/components/board/Board';
import CalendarHeader from './calendar/CalendarHeader';
import CalendarCell from './calendar/CalendarCell';
// Utils
// import Utils from 'utils/Utils';


type Props = {};

const Monthly = (props: Props) => {

    const queryClient = useQueryClient();
	const fCode = useRecoilValue(franState);
    // 선택한 달 state
    const [currentMonth, setCurrentMonth] = useState(new Date());
    // 선택한 날 state
    const [selectedDate, setSelectedDate] = useState(new Date());
    const { data } = HOME_SERVICE.useSalesTerms({ f_code: fCode, search_type: 'M', search_month: `${new Date(currentMonth).getFullYear()}-${new Date(currentMonth).getMonth() + 1}-01`, })

    // console.log(currentMonth)
    // console.log(new Date())
    useEffect(() => {
        queryClient.invalidateQueries(['sales_terms', fCode, `${new Date(currentMonth).getFullYear()}-${new Date(currentMonth).getMonth() + 1}-01`]);
        console.log(currentMonth)
    }, [fCode, currentMonth, queryClient])
    
    // 오늘 기준
	const today = new Date();

    const prevMonth = () => {
        setCurrentMonth(subMonths(currentMonth, 1));
    };
    const nextMonth = () => {
        currentMonth < today && setCurrentMonth(addMonths(currentMonth, 1));
    };
    const onDateClick = (day: any) => {
        setSelectedDate(day);
    };

	return (
		<Board boardClass='month-sales' title='Month' suffix='총 매출'>
			<div className='contents-list calendar'>
                <CalendarHeader
                    currentMonth={currentMonth}
                    prevMonth={prevMonth}
                    nextMonth={nextMonth}
                />
                <CalendarCell
                    currentMonth={currentMonth}
                    selectedDate={selectedDate}
                    onDateClick={onDateClick}
                    salesData={data}
                />
			</div>
			<p className='noti'>* 부가세 포함</p>
		</Board>
	);
};

export default Monthly;