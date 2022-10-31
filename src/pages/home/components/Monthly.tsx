// DatePicker
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import { ko } from 'date-fns/esm/locale';
import { format, addMonths, subMonths } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';

// Components
import Board from 'pages/home/components/Board';
import CalendarHeader from './calendar/CalendarHeader';
import CalendarCell from './calendar/CalendarCell';


type Props = {};

const Monthly = (props: Props) => {
    
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());

    const prevMonth = () => {
        setCurrentMonth(subMonths(currentMonth, 1));
    };
    const nextMonth = () => {
        setCurrentMonth(addMonths(currentMonth, 1));
    };
    const onDateClick = (day: any) => {
        setSelectedDate(day);
    };

	const today = new Date();
	return (
		<Board boardClass='month-sales' title='Month' suffix='총 매출'>
			<div className='contents-list calendar'>
                {/* <CalendarHeader
                    currentMonth={currentMonth}
                    prevMonth={prevMonth}
                    nextMonth={nextMonth}
                />
                <CalendarCell
                    currentMonth={currentMonth}
                    selectedDate={selectedDate}
                    onDateClick={onDateClick}
                /> */}
			</div>
			<p className='noti'>* 부가세 포함</p>
		</Board>
	);
};

export default Monthly;







/*

<DatePicker
					inline
					disabledKeyboardNavigation
					calendarClassName='revenue-datepicker'
					// timeClassName={handleDayNight}
					locale={ko}
					timeCaption='월별 매출'
					dateFormat='yyyy-MM-dd'
					// selected={reservation}
					// minDate={new Date()}
					// filterTime={filterPassedTime}
					onChange={() => {}}
					renderCustomHeader={({ date, decreaseMonth, increaseMonth }) => {
						return (
							<div className='monthly_datepicker-header header-month'>
                                <button
                                    type='button'
                                    className='react-datepicker__navigation react-datepicker__navigation--previous'
                                    aria-label='Previous Month'
                                    onClick={decreaseMonth}>
                                    <span className='react-datepicker__navigation-icon react-datepicker__navigation-icon--previous'>
                                        Previous Month
                                    </span>
                                </button>
								
								<div className='reservation_date'>
									{
										(date.getMonth() + 1 < 10
											? '0' + String(date.getMonth() + 1)
											: String(date.getMonth() + 1)
                                        )
                                    }월
								</div>
								<button
									type='button'
									className='react-datepicker__navigation react-datepicker__navigation--next react-datepicker__navigation--next--with-time'
									aria-label='Next Month'
									onClick={increaseMonth}>
									<span className='react-datepicker__navigation-icon react-datepicker__navigation-icon--next'>
										Next Month
									</span>
								</button>
							</div>
						);
					}}
				/>

*/