import { useRecoilValue } from 'recoil';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, isSaturday, isSunday, addDays } from 'date-fns';
// global state
import { franState } from 'state';

// API
import HOME_SERVICE from 'service/homeService';
import Utils from 'utils/Utils';

const CalendarCell = ({ currentMonth, selectedDate, onDateClick, salesData }: any) => {

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);



    console.log(salesData)
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = '';

    while (day <= endDate) {
        for (let i = 0; i < 7; i++) {
            formattedDate = format(day, 'd');
            const cloneDay = day;
            const targetData = salesData?.filter((franData: any) => { return (new Date(franData.std_date).getDate() === Number(format(cloneDay, 'd'))) });

            days.push(
                <div
                    className={`calendar-body-col cell
                        ${isSaturday(day) ? 'sat' : ''}
                        ${isSunday(day) ? 'sun' : ''}
                        ${!isSameMonth(day, monthStart) ? 'disabled' : ''}
                        ${isSameDay(day, selectedDate) ? 'selected' : ''}
                    `}
                    key={Number(day)}
                    // onClick={() => onDateClick(parse('yyyy-MM-dd', 'dd/MM/yyyy', cloneDay))}
                >
                    <span className={'date-num'}>
                        {formattedDate}
                    </span>
                    { format(currentMonth, 'M') === format(day, 'M') ? <span className='date-sales'>{
                        targetData ? `${Utils.roundingDown10000(targetData[0]?.sales_charge)}만` : ''
                    }</span> : null }
                </div>,
            );
            day = addDays(day, 1);
        }
        rows.push(
            <div className="calendar-body-row" key={Number(day)}>
                {days}
            </div>,
        );
        days = [];
    }
    return <div className="calendar-body">{rows}</div>;
};

export default CalendarCell;