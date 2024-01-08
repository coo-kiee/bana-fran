import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  isSaturday,
  isSunday,
  addDays,
} from 'date-fns';
// Types
import { CalendarBodyProps } from 'types/home/homeType';
// Utils
import Utils from 'utils/Utils';

const CalendarBody = ({ selectedDate, data }: CalendarBodyProps) => {
  const today = new Date();
  const startMonth = startOfMonth(selectedDate); // 달의 시작일
  const endMonth = endOfMonth(startMonth); // 달의 말일
  const startWeekDay = startOfWeek(startMonth); // 첫 주의 시작일
  const endWeekDay = endOfWeek(endMonth); // 마지막 주의 마지막 일

  // 초기값 설정
  const rows: JSX.Element[] = [];
  let days: JSX.Element[] = []; // 렌더링할 한 주의 날짜들
  let day: Date = startWeekDay;

  while (day <= endWeekDay) {
    for (let i = 0; i < 7; i++) {
      const formattedDate = format(day, 'd'); // 날짜 표시 형식 변환
      const dayCopy = day;
      const targetData = data?.filter(({ std_date }) => isSameDay(new Date(std_date), dayCopy));
      const salesCharge = targetData[0]?.sales_charge || 0;

      days.push(
        <div
          className={`calendar-body-col day
                        ${isSaturday(day) ? 'sat' : ''}
                        ${isSunday(day) ? 'sun' : ''}
                        ${!isSameMonth(day, startMonth) ? 'disabled' : ''}
                        ${isSameDay(day, today) ? 'today' : ''}
                    `}
          key={`${Number(day)} day`}
        >
          <span className={'date-num'}>{formattedDate}</span>
          {
            isSameMonth(selectedDate, day) && salesCharge > 0 ? (
              <span className="date-sales">{`${Utils.roundingDown10000(salesCharge)}만`}</span>
            ) : null // 매출 0원 초과, 같은 월일 때
          }
        </div>,
      );

      day = addDays(day, 1); // day 1 증가
    }
    rows.push(
      <div className="calendar-body-row week" key={`${Number(day)} week`}>
        {days}
      </div>,
    );
    days = []; // 1주 다 채우면 days 초기화
  }
  return <div className="calendar-body">{rows}</div>;
};

export default CalendarBody;
