import { format } from 'date-fns';

const CalendarHeader = ({ currentMonth, prevMonth, nextMonth }: any) => {
    
    const days = ['일', '월', '화', '수', '목', '금', '토'];

    return (
        <header className="calendar-header">
            <div className="month-title">
                <div onClick={prevMonth}></div>
                <span className="title">
                    {format(currentMonth, 'MM')}월
                </span>
                <div onClick={nextMonth}></div>
            </div>
            <ul className='days'>
                {days.map((day, idx) => {
                    return (<li className='day' key={idx}>{day}</li>)
                })}
            </ul>
        </header>
    );
};

export default CalendarHeader;