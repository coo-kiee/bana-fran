import { format } from 'date-fns';

const CalendarHeader = ({ currentMonth, prevMonth, nextMonth }: any) => {
    
    const days = ['일', '월', '화', '수', '목', '금', '토'];

    return (
        <header className="calendar-header header">
            <div className="month">
                <button className='prev month-button' onClick={prevMonth}></button>
                <span className="title">
                    {format(currentMonth, 'MM')}월
                </span>
                <button className={`next month-button`} onClick={nextMonth}></button>
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