import { differenceInMonths, format, isSameMonth, isSameYear } from 'date-fns';
// Types
import { CalendarHeaderProps } from 'types/home/homeType';

const CalendarHeader = ({ selectedDate, prevMonth, nextMonth }: CalendarHeaderProps) => {
  const today = new Date();
  const days = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <header className="calendar-header header">
      <div className="navigation">
        <button
          className="prev navigation-button"
          onClick={prevMonth}
          disabled={differenceInMonths(today, selectedDate) >= 12}
        ></button>
        <span className="title">
          {!isSameYear(selectedDate, today) ? `${format(selectedDate, 'yyyy')}년 ` : ''}
          {format(selectedDate, 'MM')}월
        </span>
        <button
          className={`next navigation-button`}
          onClick={nextMonth}
          disabled={isSameMonth(today, selectedDate)}
        ></button>
      </div>
      <ul className="days">
        {days.map((day, idx) => {
          return (
            <li className={`day${day === '토' ? ' saturday' : ''}${day === '일' ? ' sunday' : ''}`} key={idx}>
              {day}
            </li>
          );
        })}
      </ul>
    </header>
  );
};

export default CalendarHeader;
