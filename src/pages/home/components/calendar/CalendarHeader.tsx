import { differenceInMonths, format, isSameMonth, isSameYear } from 'date-fns';
// Types
import { CalendarHeaderProps } from 'types/home/homeType';

const CalendarHeader = ({ currentDate, prevMonth, nextMonth }: CalendarHeaderProps) => {    
    const days = ['일', '월', '화', '수', '목', '금', '토']; // 요일
    const today = new Date(); // 오늘

    return (
        <header className="calendar-header header">
            <div className="navigation">
                <button className='prev navigation-button' onClick={prevMonth} disabled={(differenceInMonths(today, currentDate) >= 12)}></button>
                <span className="title">
                    { !isSameYear(currentDate,today) ? `${format(currentDate, 'yyyy')}년 ` : ''}{format(currentDate, 'MM')}월
                </span>
                <button className={`next navigation-button`} onClick={nextMonth} disabled={isSameMonth(today, currentDate)}></button>
            </div>
            <ul className='days'>
                {days.map((day, idx) => {
                    return (<li className={`day${day === '일' ? ' sunday' : ''}${day === '토' ? ' saturday' : ''}`} key={idx}>{day}</li>)
                })}
            </ul>
        </header>
    );
};

export default CalendarHeader;